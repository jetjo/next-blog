"use client";

export default function Layout({ children, role }: any) {
  return (
    <>
      <div className="">基本信息设置: {children}</div>
      <div className="">角色权限设置: {role}</div>
    </>
  );
}
