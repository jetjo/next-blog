import { parseMDXHeader } from "@/utils/mdx/compile.mjs";
import { proxyHeader2 } from "@/utils/mdx/mdx-header";
import style from './_header2.module.css'

function BlogHeader2(context: any, { children }: any) {
  const { title, date } = JSON.parse(parseMDXHeader(children));
  return (
    <div>
      <a href={context.path}>
        <h2 className={style.blogTitle}>{title}</h2>
      </a>
      <p>Posted: {date}</p>
      {/* <p>{slug}</p> */}
    </div>
  );
}

export default function Header2(context: any) {
  // @ts-ignore
  return proxyHeader2(BlogHeader2.bind(null, context), context);
}
