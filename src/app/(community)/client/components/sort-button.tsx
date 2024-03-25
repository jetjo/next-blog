"use client";

import { useSearchParams } from "next/navigation";

export default function SortButton() {
  const curParams = useSearchParams();
  console.log(curParams, "rerender");
  function updateSort(sort = "") {
    const params = new URLSearchParams(curParams.toString());
    params.set("sort", sort);
    // 对`history.pushState`等的调用会被`Next.js Router`捕获, 并将与`useSearchParams`钩子同步,
    // `useSearchParams`的返回值自动异步更新, 从而触发重新渲染
    // https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#using-the-native-history-api
    history.pushState(null, "", `?${params.toString()}`);
  }
  return (
    <div>
      <button type="button" onClick={() => updateSort("asc")}>
        升序
      </button>
      <button type="button" onClick={() => updateSort("desc")}>
        降序
      </button>
    </div>
  );
}
