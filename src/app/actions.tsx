"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Model } from "@/model";
import { compile } from "@/utils/mdx/compile.mjs";
import _path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function createPost(form: any) {
  let postId;
  try {
    // 1、存储上传的文件, 返回文件路径
    const path = "../../data/blogs/javascript.mdx";
    const fullPath = _path.resolve(__dirname, path);
    // 2、编译文件, 并存储到数据库, 返回ID
    const res = await Model.Blog.insertMany([
      {
        title: path.match(/\/([^/]+)\.mdx$/)![1] || "",
        path: fullPath,
      },
    ]);
    postId = res[0]._id;

    const code = await compile({ filePath: fullPath }); // compile(form.content);

    const res1 = await Model.MDXContent.insertMany([
      { content: code, blogId: postId },
    ]);

    revalidatePath("/posts");
    redirect(`/post/${postId}`);
  } catch (error) {
    throw error;
  }
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
