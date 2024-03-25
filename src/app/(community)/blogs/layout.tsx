import { createPost } from "../actions";
import style from "./layout.module.css";

export const metadata = {
  title: "My Blogs",
  Description: "A collection of my blogs",
  Keywords:
    "react, nextjs, tailwindcss, typescript, fullstack, javascript, css, html",
};

export default function Layout({ children }: any) {
  return (
    <div className="flex flex-col items-center">
      <div className={`leading-relaxed ${style.prose}`}>
        {/* 不能有`html`和`body`标签,会自动重用`RootLayout`的 */}
        {/* 因为`Layout`之间是嵌套关系, 此`Layout`会嵌套在`父Layout`中, 最终都会嵌套在`RootLayout`中  */}
        {children}
      </div>
      <div>
        {/* <h2>新建文章</h2> */}
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
      </div>
    </div>
  );
}
