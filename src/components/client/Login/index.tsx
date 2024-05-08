"use client";

// import { useRouter } from "next/navigation";
import type { FormEventHandler } from "react";

// import { useState } from 'react'; // 只能用于客户端组件

const Login = async ({ afterLogin }: any) => {
  // const Login = async ({ login }: { login(form: FormData): Promise<void> }) => {
  // const router = useRouter();
  // NOTE: 在`Server Component`模式下, 不能将普通函数传递给原生标签
  // 但可以将标记为`Server Action`的函数传递
  const handleSubmit = async () => {
    // const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    // const formData = new FormData(e.currentTarget);
    // await login(formData);
    // NOTE: 防止地址栏会退后登录框再次显示
    // history.replaceState(null, "", "/");
    // router.back()
    // router.replace("/");
    afterLogin();
  };
  // const submitAction = async () => {
  //   "use server";
  // };
  return (
    <div className="p-5 overflow-hidden">
      {/* <form onSubmit={handleSubmit} method="POST"> */}
      <form>
        {/* Error: Event handlers cannot be passed to Client Component props. */}
        {/* <form action={login}> */}
        {/* <form onSubmit={submitAction}> */}
        <div className="  py-1">
          <label>
            用户:{" "}
            <input
              className=" ml-4 border rounded-sm"
              type="email"
              name="email"
            />
          </label>
        </div>
        <div className="  py-1">
          <label>
            密码:{" "}
            <input
              className=" ml-4 border rounded-sm"
              type="password"
              name="password"
            />
          </label>
        </div>
        <div>
          <button
            type="button"
            className=" border px-2 mt-2 rounded float-right"
            onClick={handleSubmit}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
