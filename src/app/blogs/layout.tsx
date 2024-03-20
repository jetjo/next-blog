export const metadata = {
  title: "My Blogs",
  Description: "A collection of my blogs",
  Keywords:
    "react, nextjs, tailwindcss, typescript, fullstack, javascript, css, html",
};

export default function Layout({ children }: any) {
  return (
    <>
      {/* 不能有`html`和`body`标签,会自动重用`RootLayout`的 */}
      {/* 因为`Layout`之间是嵌套关系, 此`Layout`会嵌套在`父Layout`中, 最终都会嵌套在`RootLayout`中  */}
      {children}
    </>
  );
}
