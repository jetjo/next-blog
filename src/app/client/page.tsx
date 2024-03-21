"use client";

import { useRouter } from "next/navigation";
// import { useRouter } from "next/router"; // 不能用于`Client Component`
import SortButton from "./components/sort-button";
import LocalOptions from "./components/local-options";

export default function Page() {
  const router = useRouter();
  return (
    <>
      {" "}
      <nav className="nav">
        <button type="button" onClick={() => router.push("/dashboard")}>
          Dashboard
        </button>
      </nav>
      <main className="flex min-h-screen justify-between p-24">
        <div className="flex1 items-mr1 float-items-right">
          <SortButton></SortButton>
          <LocalOptions></LocalOptions>
        </div>
      </main>
    </>
  );
}
