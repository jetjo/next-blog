"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as Model from "@/model/blog/actions";

export async function createPost(form: FormData) {
  const postBlob = form.get("post") as File;
  const postId = Model.createPost(postBlob);
  revalidatePath("/posts");
  redirect(`/post/${postId}`);
}

export async function getPost(id: string) {
  return Model.getPost(id);
}

export async function getPostList() {
  return Model.getPostList();
}

/**
 * 临时实现, 后续需要修改
 * 根据访问量排序
 * 根据`post`关联的`comment`数量排序
 * 根据`post`关联的`rate`排序
 * 这些信息来源于`BlogAccess`表
 */
export async function getLatestPopulatePost() {
  return Model.getLatestPopulatePost();
}

export async function getLatestPopulatePostGroupByYear(): Promise<any[]> {
  const posts = await Model.getLatestPopulatePost();
  const postGroup = {} as any;
  for (const post of posts) {
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
