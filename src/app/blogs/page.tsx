import Link from "next/link";
import { createPost } from "../actions";
// import { usePathname } from "next/navigation";

export default function Blogs() {
  //   let startTime = performance.now();
  //   while (performance.now() - startTime < 1000) {
  //     // Do nothing for 1 ms per item to emulate extremely slow code
  //   }
  // `usePathname`只能在`Client Component`中使用
  // const pathName = usePathname();
  // console.log("path: ", pathName);

  return (
    <>
      {" "}
      <header>
        <h1 className="flex center-h">My blogs</h1>
        <Link href="/">Go Home</Link>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h2>新建文章</h2>
        <form className="" action={createPost}>
          <input
            type="file"
            name="post"
            id="post"
            className="visually-hidden"
            accept=".mdx"
            defaultValue=""
          />
          <label htmlFor="post">上传文章</label>
          <button>保存</button>
        </form>
      </main>
    </>
  );
}
