"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Model } from "@/model";
import { compile } from "@/utils/mdx/compile.mjs";
import _path, { dirname } from "path";
import { fileURLToPath } from "url";
import { readFile, saveFile } from "@/utils/file";

const __dirname = dirname(fileURLToPath(import.meta.url));
const postStoreDir = process.env.postStorePath!;

export async function createPost(form: FormData) {
  const postBlob = form.get("post") as File;
  // 1、存储上传的文件, 返回文件路径
  const fullPath = _path.resolve(postStoreDir, postBlob.name);
  const codeRaw = await postBlob.text();
  const curPost = await readFile(fullPath);
  let postId;
  if (curPost === codeRaw) {
    console.log("文件未发生变化");
    postId = await queryPostId(fullPath);
    if (!postId) throw new Error("文章未找到");
    revalidatePath("/posts");
    redirect(`/post/${postId}`);
  }
  try {
    await saveFile(postBlob.slice(0), fullPath);
    const code = await compile({ fileContent: codeRaw });
    // 2、编译文件, 并存储到数据库, 返回ID
    // prettier-ignore
    postId = await savePost({ title: postBlob.name, path: fullPath }, code);
  } catch (error) {
    throw error;
  }
  revalidatePath("/posts");
  redirect(`/post/${postId}`);
}

export async function getPost(id: string) {
  const post = await Model.Blog.findById(id);
  const content = await Model.MDXContent.findOne({ blogId: id });
  return {
    post: { title: post?.title, slug: post?.slug },
    content: content?.content,
  };
}

export async function getPostList() {
  const posts = await Model.Blog.find();
  return posts.map((p) => ({
    title: p.title,
    slug: p.slug,
    date: (p as any)["updatedAt"],
  }));
}

/** 保存或更新文章 */
async function savePost(blog: { title: string; path: string }, code: string) {
  let post = await Model.Blog.find({ path: blog.path });
  let postId;
  if (post.length) {
    console.log("update post", post[0]._id);
    await Model.MDXContent.updateOne({
      blogId: (postId = post[0]._id),
      content: code,
    });
    return postId;
  }
  post = await Model.Blog.insertMany([blog]);
  await Model.MDXContent.insertMany([
    { content: code, blogId: (postId = post[0]._id) },
  ]);
  return postId;
}

async function queryPostId(path: string) {
  const post = await Model.Blog.find({ path });
  if (post.length) return post[0]._id;
  return null;
}
