import _path from "path";
import { compile } from "@/utils/mdx/compile.mjs";
import { readFile, saveFile } from "@/utils/file";
import { Model } from "./";

// const __dirname = dirname(fileURLToPath(import.meta.url));
const postStoreDir = process.env.postStorePath!;

async function findPostIdWithSameOf(fileContent = "", fileFullPath = "") {
  const codeRaw = fileContent;
  const fullPath = fileFullPath;
  const curPost = await readFile(fullPath);
  if (curPost && curPost === codeRaw) {
    console.log("文件未发生变化");
    const postId = await queryPostId(fullPath);
    if (!postId) throw new Error("文章未找到");
    return postId;
  }
}

export async function createPost(postBlob: File) {
  // 1、存储上传的文件, 返回文件路径
  const fullPath = _path.resolve(postStoreDir, postBlob.name);
  const codeRaw = await postBlob.slice(0).text();
  const postId = await findPostIdWithSameOf(codeRaw, fullPath);
  if (postId) return postId;
  try {
    await saveFile(postBlob.slice(0), fullPath);
    const { code, head } = await compile({ fileContent: codeRaw });
    // 2、编译文件, 并存储到数据库, 返回ID
    // prettier-ignore
    return await savePost(fullPath, code, head);
  } catch (error) {
    throw error;
  }
}

export async function getPost(id: string) {
  const post = await Model.Blog.findById(id);
  const content = await Model.MDXContent.findOne({ blogId: id });
  return {
    post: post._doc,
    content: content._doc,
  };
}

export async function getPostList() {
  const posts = await Model.Blog.find();
  return posts.map((p) => ({
    key: String(p._id),
    ...p,
    date: (p as any)["updatedAt"],
  }));
}

/**
 * 临时实现, 后续需要修改
 * 根据访问量排序
 * 根据`post`关联的`comment`数量排序
 * 根据`post`关联的`rate`排序
 * 这些信息来源于`BlogAccess`表
 */
export async function getLatestPopulatePost() {
  const posts = await Model.Blog.find().sort({ updatedAt: -1 }).limit(5);
  return posts.map((p) => ({
    key: String(p._id),
    ...p._doc,
    date: (p as any)["updatedAt"],
  }));
}

export type MDXHead = Awaited<ReturnType<typeof compile>>["head"];

/** 保存或更新文章 */
async function savePost(path: string, code: string, head: MDXHead) {
  const blog = Object.assign({}, head, { path }) as any;
  const postId = await queryPostId(blog.path);
  if (postId) {
    blog._id = postId;
    await updateBlog(blog, code);
    return postId;
  }
  const newPost = await Model.Blog.insertMany([blog]);
  const blogId = newPost[0]._id;
  const content = code;
  await Model.MDXContent.insertMany([{ content, blogId }]);
  return blogId;
}

async function updateBlog(blog: any, code = "") {
  const content = code;
  const blogId = blog._id;
  console.log("update post", blogId);
  await Model.Blog.updateOne({ _id: blogId }, blog);
  // prettier-ignore
  await Model.MDXContent.updateOne({ blogId }, { content });
}

async function queryPostId(path: string) {
  const post = await Model.Blog.find({ path });
  if (post.length) return post[0]._id;
  return null;
}
