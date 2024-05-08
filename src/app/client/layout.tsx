"use client";

import {
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from "next/navigation";
import Nav from "../(community)/components/Nav";
// import { useEffect, useState } from "react";

export default function Layout({
  auth,
  children,
}: {
  auth: React.ReactNode;
  children: React.ReactNode;
}) {
  // const [segments, setSegments] = useState<any>();
  // Error: Invalid hook call. Hooks can only be called inside of the body of a function component.
  // useEffect(() => {
  // 获取某个插槽内的内容所对应的路由段
  const loginSegment = useSelectedLayoutSegment("auth");
  const loginSegments = useSelectedLayoutSegments("auth");
  const roleSegment = useSelectedLayoutSegment("role");
  const roleSegments = useSelectedLayoutSegments("role");
  // setSegments({ loginSegment, loginSegments, roleSegment, roleSegments });
  // }, []);
  return (
    <>
      <Nav />
      {auth}
      <b />
      {children}
      <b />
      {JSON.stringify(
        { loginSegment, loginSegments, roleSegment, roleSegments },
        null,
        4
      )}
      <b />
    </>
  );
  // ...
}
