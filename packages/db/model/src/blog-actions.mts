// 必须明确引入,以解决如下问题:
// error TS2305: Module '"react"' has no exported member 'cache'.
///<reference types="react/canary" />

import type { IModel } from "./schema-helper.mjs";
import type { IBLog, ICodeBlock, IHeading } from "./blog.mjs";

import __path from "node:path";
import { writeFile } from "fs/promises";
import punycode from 'punycode/punycode.js'

import { compile } from "utils/mdx.mjs";
import { readFile } from "utils/file.mjs";
import { isSystemBlog, reserveTags, tagDiff } from "utils/tags-utils.mjs";
import { toBlog, toCodeBlock, toHeading, toMDXContent, toSearchIndex, BlogModel, CodeBlockModel, HeadingModel, MDXContentModel, SearchIndexModel } from "./blog.mjs";
import { headingKeys } from "./blog/Headings.mjs";
import { getBlogIdsOfTag, getMatchedTags, normalizeTags, saveTags, updateTags, getBlogCountTopN } from "./tag-actions.mjs";
import { pick } from "lodash-es";
import { redis } from "@db/driver"
import type { RedisJSON } from "@db/driver"

const isDev = process.env.NODE_ENV === 'development'
const isLowBattery = process.env.BATTERY?.toLocaleLowerCase() === 'low'
console.log({ isDev, isLowBattery });


// const cache = redisCanary.canary

// @ts-ignore
const _path = __path;

const localCache = {}

// const __dirname = dirname(fileURLToPath(import.meta.url));
const postStoreDir = process.env.postStorePath!;
const postStoreDirRel = process.env.postStorePathRel!;

const CWD = process.cwd()

const getRelPath = (p = '') => {
  const res = _path.relative(CWD, p)
  // console.log(p, res, '绝对路径->相对路径');
  return res;
}

const getAbsPath = (p = '') => {
  const res = _path.resolve(CWD, p)
  // console.log(p, res, '相对路径->绝对路径');
  return res;
}

const delUUID = (txt = '') => {
  const reg = /(```|~~~)([^\n]*?uuid=)([a-z0-9\-]+?)\s/g
  const res = txt.replace(reg, '$1$2 ');
  // console.log(res, '删除uuid后');
  return res;
}

async function findPostIdWithSameOf(fileContent = "", fileFullPath = "") {
  const codeRaw = fileContent;
  const fullPath = fileFullPath;
  const curPost = await readFile(fullPath);
  if (curPost && delUUID(curPost) === delUUID(codeRaw)) {
    console.log("文件未发生变化");
    const postId = await queryPostId(getRelPath(fullPath));
    if (!postId)
      throw new Error("文件系统中有此文章, 但是数据库中未找到对应信息!");
    return postId;
  }
}

// const _require = withWebpackContext();

// const punycode = _require('punycode/');

/**
 * 文件系统中存在文件, 但与上传文件内容不同; 或者文件系统没有对应文件; 进入数据库对应信息更新或创建阶段;\
 * 文件系统存在文件且与上传文件内容相同, 但数据库没有对应信息, 属于异常!
 */
export async function createPost(postBlob: File, { remarkUsageOption }: any) {
  const filename = punycode.encode(postBlob.name.replace(/\.mdx?$/, '')) + '.mdx'
  // 1、存储上传的文件, 返回文件路径
  const fullPath = _path.resolve(postStoreDir, filename);
  const codeRaw = await postBlob.slice(0).text();
  if (!codeRaw) throw new Error('文章没有内容,请上传有内容的文章!')
  // 不应如此确定是否更新文章, 而应该交由用户决定更新
  // const postId = remarkUsageOption ? null : await findPostIdWithSameOf(codeRaw, fullPath);
  // if (postId) return postId;
  try {
    if (remarkUsageOption) {
      // 因为传入`compile`的不是文件,而是文件内容, `file.cwd`是`process.cwd()`不是`./.data/blogs/userId/...`, 需要调整配置
      // remarkUsageOption.example = _path.resolve('./.data', remarkUsageOption.example) // resolve会自动转换为绝对路径
      remarkUsageOption.example = _path.join('./.data', 'blogs', remarkUsageOption.example)
      remarkUsageOption.main = _path.join('./.data', 'blogs', remarkUsageOption.main)
    }
    const compiled = await compile({ fileContent: codeRaw, blogName: postBlob.name, remarkUsageOption });
    if (!compiled.code) throw new Error("编译失败!");

    // const postId = await findPostIdWithSameOf(compiled.content, fullPath);
    // if (postId) return postId;
    // const copyCompiled = JSON.parse(JSON.stringify(compiled));
    // delete copyCompiled.matter.content;
    // delete copyCompiled.code;
    // console.dir(copyCompiled, { depth: null });

    if (isDev && !isLowBattery) {
      // TODO: 如果没有提前创建`.debug`目录, 会抛出异常!
      const debugDir = ".debug";
      const debugFile = _path.resolve(CWD, debugDir, filename.replace(/\.mdx?$/, `-${performance.now()}`) + ".jsx");
      //for test
      await writeFile(debugFile, compiled.code);
    }

    const { code, head, codeBlocks, content, headings, sumReadingTime } = compiled;
    // isDev && dir({ ...compiled, codeBlocks: [compiled.codeBlocks[0]], headings: [compiled.headings[0]] }, { depth: Infinity })
    // 2、编译文件, 并存储到数据库, 返回ID
    // prettier-ignore
    const res = await savePost(getRelPath(fullPath), code, head, codeBlocks!, content!, headings, sumReadingTime);
    // await saveFile(remarkUsageOption ? compiled.content || '' : postBlob.slice(0), fullPath);
    // printMatter(fullPath);
    return res;
  } catch (error) {
    throw error;
  }
}

export const getPost = (async function getPost(id: string) {
  const cache = localCache[id]
  // console.log({ cache, id, localCache }, 'getPost');
  // const rdCache = await redis.json.GET(id);
  // console.dir(rdCache, { depth: Infinity })
  if (cache) {
    setTimeout(async () => {
      try {
        await getPost(id)
        console.log('已读取博客!');
      } catch (e) {
        console.error('博客读取失败!', e);
      }
    }, 0);
    delete localCache[id]
    return cache;
  }
  const _post = (await BlogModel.findById(id));
  const content = (await MDXContentModel.findOne({ blogId: id }));
  const codeBlocks = (await CodeBlockModel.find({ blogId: id })) as ICodeBlock[];
  const headings = (await HeadingModel.find({ blogId: id })) as IHeading[];
  if (!_post || !content || !codeBlocks || !headings) return {}
  const post = toBlog(_post);
  const res = {
    post,
    content: toMDXContent(content),
    //@ts-ignore
    codeBlocks: codeBlocks.map(c => toCodeBlock(c)),
    //@ts-ignore
    headings: headings.map(h => toHeading(h)),
    matchedTags: undefined
  };
  const cacheStr = JSON.stringify(res, null, 4);
  if (isDev && !isLowBattery) {
    await writeFile(_path.resolve(CWD, '.debug', post._id + '-query.json'), cacheStr)
  }
  // @ts-ignore
  res.matchedTags = tagDiff(await getMatchedTags(post), reserveTags);
  return res;
})

const getPosts = (async function (ids: string[]) {
  const posts: (IBLog & IModel)[] = []
  for (const id of ids) {
    const _post = (await BlogModel.findById(id));
    if (!_post) continue;
    posts.push(toBlog(_post))
  }
  return posts;
})

export const getBlogsOfTag = (async function getBlogsOfTag(tag: string) {
  const ids = await getBlogIdsOfTag(tag)
  // return []
  return (await getPosts(ids)).filter(b => !isSystemBlog(b.tags));
})

export async function getPostList() {
  const posts = await BlogModel.find() as IBLog[];
  //@ts-ignore
  return posts.map((p) => (toBlog(p)));
}

/**
 * 临时实现, 后续需要修改
 * 根据访问量排序
 * 根据`post`关联的`comment`数量排序
 * 根据`post`关联的`rate`排序
 * 这些信息来源于`BlogAccess`表
 * @warn 如果文章标题不存在, 则返回的文章列表中会有`null`值
 * @param timestamp 用于判断是否从缓存读取, 当由于某些操作, 热门文章列表需要刷新时, 需要传递一个与之前调用时不同的时间戳
*/
// export const getLatestPopulatePost = (async function () {
export const getLatestPopulatePost = (async function getLatestPopulatePost(timestamp: number) {
  // @ts-ignore
  const posts = await BlogModel.find().sort({ updatedAt: -1 }).limit(15) as any[];
  // console.log(posts, "刚从数据库中获取的文章列表~");
  return posts.filter(p => p.title && !isSystemBlog(p.tags)).map((p) => toBlog(p));
})
// );

export type MDXHead = Awaited<ReturnType<typeof compile>>["head"];

/** 保存或更新文章 */
async function savePost(
  path: string,
  code: string,
  head: MDXHead,
  codeBlocks: any[],
  rawCode: string,
  headings: any[],
  sumReadingTime: number
) {
  // console.log({ sumReadingTime, head });

  try {
    const blog = Object.assign({}, head, { path: getRelPath(path), readingTime: (Number(sumReadingTime) + 1).toFixed(3) }) as any;
    if (head.keywords) {
      blog.tags = await normalizeTags(head.keywords.split(','));
      blog.keywords = blog.tags.join(',')
    }
    // 不合理, 根据用户的文件名决定是否是同一个文章,不妥.交由用户决定更新哪个文章
    // const postId = await queryPostId(blog.path);
    // if (postId) {
    //   codeBlocks.forEach((block) => {
    //     transformCodeBlockToModel(block, postId)
    //   });
    //   blog._id = postId;
    //   await updateBlog(blog, code, codeBlocks, rawCode);
    //   return postId;
    // }
    const newPost = await BlogModel.insertMany([blog]);
    const blogId = newPost[0]._id;
    const content = code;
    const _codeBlocks = codeBlocks?.map((block) => {
      return transformCodeBlockToModel(block, blogId)
    });

    headings = headings?.map(h => {
      // ({ depth: h.depth, value: h.value, id: h.data.id, ancestors: h.ancestors, children: h.children })
      h.id = h.data.id;
      h.blogId = blogId;
      h.children ||= [];
      return pick(h, headingKeys);
    })
    await saveTags(blog.tags, blogId)

    const needCached = {
      post: toBlog(newPost[0] as any),
      content: { content, blogId, rawContent: rawCode },
      codeBlocks: _codeBlocks,
      headings
    }
    const cacheStr = JSON.stringify(needCached, null, 4);
    if (isDev && !isLowBattery) {
      await writeFile(_path.resolve(CWD, '.debug', blogId + '-create.json'), cacheStr)
    }
    // await redis.json.set(blogId, '$', needCached as RedisJSON) RedisJson模块是Redis的收费模块, 需要单独安装才能使用.
    setTimeout(async () => {
      try {
        await MDXContentModel.insertMany([needCached.content]);
        _codeBlocks && await CodeBlockModel.insertMany(needCached.codeBlocks);
        headings && await HeadingModel.insertMany(needCached.headings);
        console.log('已创建博客!');
      } catch (e) {
        console.error('博客创建失败!', e);
        delete localCache[blogId]
        delBlog(blogId)
      }
    }, 0);
    localCache[blogId] = needCached;
    // console.log({ id: blogId, cache: needCached, localCache }, 'savePost');
    return String(blogId);
  } catch (error) {
    console.error(error, 'savePost');
  }
}

export async function delBlog(blogId: string) {
  try {
    await BlogModel.deleteOne({ _id: blogId })
  } catch (e) {
    console.error('博客删除失败!', e);
    throw new Error('博客删除失败!')
  }
}

export async function updateBlog$1({ blog, tags }: { blog: IBLog, tags?: string[] }) {
  if (tags) {
    await updateBlogTags({ blog, tags })
  }
}

async function updateBlogTags({ blog, tags }: { blog: IBLog, tags: string[] }) {
  tags = await updateTags(tags, blog.tags, blog._id)
  await BlogModel.findByIdAndUpdate(blog._id, { tags, keywords: tags.join(',') })
}

function transformCodeBlockToModel(block: any, blogId = '') {
  delete block.switcher;
  delete block.codeFenceBoundary;
  block = Object.assign({}, block.tokens, block)
  delete block.tokens;
  delete block.langToken;
  block.blogId = blogId;
  block.parse = {
    startPos: block.startPos,
    matchLen: block.matchLen,
    readingTime: block.readingTime,
  }
  delete block.readingTime;
  delete block.matchLen;
  delete block.startPos;
  return block;
  // block.tokens = JSON.stringify(block.tokens);
}

async function updateBlog(blog: any, code = "", codeBlockModels: any[] = [], rawCode = '') {
  const content = code;
  const blogId = blog._id;
  blog.tags = await normalizeTags(blog.tags);
  // console.log("update post", blogId);
  await BlogModel.updateOne({ _id: blogId }, { ...blog, path: getRelPath(blog.path) });
  // prettier-ignore
  await MDXContentModel.updateOne({ blogId }, { content, rawContent: rawCode });
  await CodeBlockModel.deleteMany({ blogId })
  await CodeBlockModel.insertMany(codeBlockModels);
}

async function queryPostId(path: string) {
  const post = await BlogModel.find({ path: getRelPath(path) });
  // console.log(post, "post++++++++++++++++");

  if (post.length) return String(post[0]._id);
  return null;
}

export const getAllTagFromCache = async () => {
  return getBlogCountTopN(-1);
}
