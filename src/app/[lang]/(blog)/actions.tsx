"use server";
import type { IBLog, IModel } from "@db/blog-model";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createPost as createPost_, getPost as getPost_, getBlogsOfTag as getBlogsOfTag_, getMatchedTags as getMatchedTags_, updateBlog$1, getPostList as getPostList_, getLatestPopulatePost as getLatestPopulatePost_, getBlogIdsOfTag as getBlogIdsOfTag_ } from "@db/blog-model";
import { cache } from "react";

// import { z } from "zod";

// const schema = z.object({
//   post: z.blob({ invalid_type_error: "Please upload blog file!" }),
// });

const userId = 0

const ReadmeConf = {
  rootDir: './readme',
  exampleDir: './example'
}

/**
 * 创建文章, 如果成功, 则重定向到`/post/[postId]`,\
 * 并设置`ref.postId`; 否则抛出异常.
 */
export async function createPost(form: FormData, preState?: PostFormState) {
  /*   let startTime = performance.now();
  while (performance.now() - startTime < 111115) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  } */
  // throw new Error();
  const postBlob = form.get("post") as File;
  // #region 临时代码用于测试`remarkUsage`插件
  const isPkgReadmeFile = Boolean(form.get('isReadme'))
  let remarkUsageOption;
  if (isPkgReadmeFile) {
    // 根据表单生成`remarkUsage`的配置信息, https://github.com/remarkjs/remark-usage?tab=readme-ov-file#options
    // 存储`package.json`
    const pkgFile = form.get('pkgFile') as File;
    // 1、解析出'pkg'对象
    // ....
    // 2、写入对应目录
    // ....
    const readmeFile = postBlob;// form.get('post') as File;
    // 3、将readmeFile存入对应目录
    // ....
    const exampleFile = form.get('exampleFile') as File;
    // 4、将exampleFile存入对应目录
    // ....
    remarkUsageOption = {
      /**
       * 用户上传到路径: 
       * ```js
       * `${process.cwd()}/.data/blogs/${userId}/${ReadmeConf.rootDir}/${pkg.name}/${ReadmeConf.exampleDir}`
       * ```
       * `pkg`从用户上传的`package.json`文件读取
       */
      // 目前为了测试需先将src/data/remark-usage/example.js放入工程根目录的.data/blogs文件夹内,
      // 然后上传src/data/remark-usage/readme.md进行测试,
      // 如果以下配置正确, 可以发现example.js的内容被编译并嵌入了`heading`指定的位置
      // `file.cwd`: 在使用包`@mdx-js/mdx`的`compile`编译时, 如果传入的不是文件而是文件内容, `file.cwd`就是`process.cwd`
      // 相对于`file.cwd`
      // 假定`readme`文件与`example`和`main`处于同一目录即./data/blogs
      example: 'example.js', // resolved from file.cwd???
      heading: 'usage',
      // 相对于`file.cwd`
      main: 'index.js', // pkg.exports, pkg.main; resolved from file.cwd???
      name: 'pi' // pkg.name
    }
  }
  // #endregion
  const postId = await createPost_(postBlob, { isPkgReadmeFile, remarkUsageOption });
  if (preState) {
    preState.ref ||= {};
    preState.postId = postId;
    preState.ref.postId = postId;
  }
  if (preState) {
    if (preState.pathName) revalidatePath(preState.pathName, "page");
    else if (preState.lang) revalidatePath(`/${preState.lang}/blogs`, "page");
  } else {
    // 经测试, 正确调用`revalidatePath`后确实有效,
    // 假如提交表单的页面就是`"/[lang]/(blog)/blogs"`对应的页面,
    // 在前后端都不执行重定向离开页面的前提下, 调用`revalidatePath`后会看到页面的文章列表自动刷新, 不需要手动刷新页面; 如果不调用`revalidatePath`, 则没有这种效果
    revalidatePath("/[lang]/(blog)/blogs", "page");
  }
  // revalidatePath("/blogs");
  // revalidatePath("/[lang]/blogs");
  // NOTE: 如果此`Server Action(createPost)`函数是直接或间接由`Client Component`的`useFormState`触发的, 则此重定向失效, 但是后续的语句也不会执行
  redirect(`/post/${postId}`);
  // 测试, 因为前面`redirect`, 确实没有执行
  return postId;
}

export interface PostFormState {
  /** 响应完成的时间, 使得客户端能区分两次相同的响应内容, 实际测试无效.... */
  timestamp?: number;
  message?: string;
  postId?: string;
  readonly pathName?: string;
  readonly lang?: string;
  ref?: Omit<PostFormState, "ref"> & Record<string, string | number | boolean>;
}

export async function createPostWithState(
  preState: PostFormState,
  form: FormData
) {
  const preState_ = JSON.parse(JSON.stringify(preState));
  preState_.ref ||= {};
  try {
    await createPost(form, preState_);
    // NOTE: 如果此`Server Action(createPost)`函数是直接或间接由`Client Component`的`useFormState`触发的, 则此重定向失效,
    // 后续语句是否执行取决于是否是由`Client Component`的`useFormState`直接触发(即此`Server Action`是否是为了配合`useFormState`使用, 从而接收额外的`preState`作为第一个参数)
    // redirect(`/post/${postId}`);
    timestampForCache = performance.now();
    return {
      timestamp: timestampForCache,
      // NOTE: 如果执行成功, 此字段会被自动填充为合理的值, 这里赋值`success`会被覆盖; 例如, 执行过程中调用了`redirect`方法, 此字段值自动变为`NEXT_REDIRECT`
      // message: "success",
      ...preState_,
    };
  } catch (err: any) {
    // Error: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.
    // return { err };
    const timestamp = performance.now();
    return {
      timestamp,
      message: `${err?.message}, [${timestamp}]`,
      ...preState_,
    };
  } finally {
  }
}

// NOTE: cache返回的值不能在有`use server;`指令的模块中导出
const getCachedPost = cache(async (id) => await getPost_(id));

export const getPost = async (id: string) => await getCachedPost(id);

const getCachedPostsOfTag = cache(async (tag) => await getBlogsOfTag_(tag));
/**
 * @description 不包括系统博客
 */
export const getPosts = async (tag: string) => await getCachedPostsOfTag(tag);

export const getRelatedTags = async ({ tags }: { tags: string[] }) => await getMatchedTags_({ tags })

export async function updatePost({ blog, tags }: { blog: IBLog, tags: string[] }) {
  await updateBlog$1({ blog, tags });
  revalidatePath("/[lang]/(blog)/post/[id]", "page");
  revalidatePath("/[lang]/(blog)/posts/[tag]", "page");
  revalidatePath("/[lang]/(blog)/posts/@tags", "page");
  revalidatePath("/[lang]/(blog)/blogs/[tag]", "page");
  revalidatePath("/[lang]/(blog)/blogs/@tags", "page");
}

export const getPostList = async () => await getPostList_();

let timestampForCache = performance.now();

const getCachedPopPost = cache(async (timestamp) => await getLatestPopulatePost_(timestamp));

/**
 * 临时实现, 后续需要修改
 * 根据访问量排序
 * 根据`post`关联的`comment`数量排序
 * 根据`post`关联的`rate`排序
 * 这些信息来源于`BlogAccess`表
 */
export const getLatestPopularPost = (async (): Promise<(IBLog & IModel)[]> => await getCachedPopPost(timestampForCache));

export async function getLatestPopularPostGroupByYear(): Promise<any[]> {
  const posts = await getCachedPopPost(timestampForCache);
  const postGroup = {} as any;
  for (const post of posts) {
    if (!post) {
      console.warn('缺少文章信息~');
      continue;
    }
    const year = new Date(post.date).getFullYear();
    if (!postGroup[year]) {
      postGroup[year] = [];
    }
    postGroup[year].push(post);
  }

  // // 测试代码
  // postGroup[2021] = [...postGroup[2024]];
  // postGroup[2022] = [...postGroup[2024]];
  // postGroup[2023] = [...postGroup[2024]];

  // console.log(postGroup);
  // return posts;
  return postGroup;
}

const getBlogIdsOfTag = async (tag: string) => await getBlogIdsOfTag_(tag);
