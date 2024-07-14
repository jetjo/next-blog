import TestCom_ from "@/tmp/components/TestCom_";
import DevOnly from "@/tmp/components/SubmitBlog/client/SubmitBlog";
import { AiOutlineHistory } from "react-icons/ai";

// export const revalidate = 3600 // revalidate the data at most every hour

export const metadata = {
  title: "My Blogs",
  Description: "A collection of my blogs",
  Keywords:
    "react, nextjs, tailwindcss, typescript, fullstack, javascript, css, html",
};

export default function Layout({
  children,
  // tags,
  params: { lang, ...params },
  ...props
}: any) {
  // console.log("layout", lang, props);

  // const dic = await getDictionary(lang); // ok
  return (
    <div className="flex flex-col items-center gap-28  py-12  px-6 lg:px-12">
      {props.fullTextSearch}
      <div className={`leading-relaxed`}>
        {/* 不能有`html`和`body`标签,会自动重用`RootLayout`的 */}
        {/* 因为`Layout`之间是嵌套关系, 此`Layout`会嵌套在`父Layout`中, 最终都会嵌套在`RootLayout`中  */}
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl lg:mx-0">
            {props.header}
          </div>
          {children}
        </div>
      </div>
      {/* {props.tags} */}
      <DevOnly />
      {/* <TestCom_ {...props} offset={"8em"} /> */}
    </div>
  );
}
