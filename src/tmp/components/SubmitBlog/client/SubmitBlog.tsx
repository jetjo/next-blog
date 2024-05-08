// @ts-check
"use client";

import * as React from "react";
import type { PostFormState } from "@/app/(community)/actions";
import { createPostWithState } from "@/app/(community)/actions";
import { SubmitButton } from "@/components/client/buttons";
import { BiUpload } from "react-icons/bi";
import { useFormState } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const isDev = process.env.NODE_ENV === "development";

export default function SubmitBlog() {
  if (!isDev) return null;

  const pathName = usePathname();
  // console.log({ pathName });
  const [_state, formAction] = useFormState<Readonly<PostFormState>, FormData>(
    createPostWithState,
    {
      // NOTE: `message`字段会被`Server Action`自动填充, 不用声明, 仅限`Server Action`执行成功的情况, 否则, 服务端可以手动填充此字段值
      // message: "",
      timestamp: 0,
      ref: {},
      postId: "",
      pathName,
    }
  );

  const [state, setFormState] = useState(_state);
  useEffect(() => {
    if (JSON.stringify(state) !== JSON.stringify(_state)) {
      setFormState({ ..._state });
    }
  }, [_state]);

  useEffect(() => {
    if (pathName !== state.pathName) {
      setFormState({ ...state, pathName });
    }
  }, [pathName]);

  const [isAfterPost, setIsAfterPost] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!isAfterPost) return;
    setIsAfterPost(false);
    const postId = state.postId || state.ref?.postId;
    if (postId) {
      router.push(`/post/${postId}`);
      return; // 不写会执行后续语句
    }
    alert(state.message || "上传失败, 请联系系统管理员~");
  }, [state]);

  return (
    <div>
      {/* <h2>新建文章</h2> */}
      <form
        className=""
        action={async (e: FormData) => {
          await formAction(e);
          setIsAfterPost(true);
        }}
      >
        <input
          type="file"
          name="post"
          id="post"
          accept=".mdx,.md"
          defaultValue=""
        />
        <label htmlFor="post" className=" inline-flex items-center cursor-pointer">
          <BiUpload />{" "}
        </label>
        <pre aria-live="polite" className="sr-only text-red-500">
          {JSON.stringify(_state, null, 2)}
        </pre>
        <SubmitButton className=" px-2">保存</SubmitButton>
      </form>
    </div>
  );
}
