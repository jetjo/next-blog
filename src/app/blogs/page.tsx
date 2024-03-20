import Link from "next/link";
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
      <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
    </>
  );
}
