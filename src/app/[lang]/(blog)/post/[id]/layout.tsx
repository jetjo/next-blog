import clsx from "clsx";
import { isSystemBlog } from "utils/tags-utils.mjs";
import { getPost } from "@/app/[lang]/(blog)/actions";
import style from './article.module.css'

export type LayoutProps = {
  children: React.ReactNode,
  toc: React.ReactNode,
  head: React.ReactNode,
  tags: React.ReactNode,
}

export type Props = {
  params: {
    lang: string,
    id: string,
  }
} & LayoutProps

export default async function Layout({ params: { lang, id, ...params }, ...props }: Props) {
  // NOTE: useSelectedLayoutSegment(s) only works in Client Components.
  // const routeSegment = useSelectedLayoutSegment();
  // console.log(routeSegment);
  // const routeSegmentsC = useSelectedLayoutSegments();
  // console.log(routeSegmentsC);
  // console.log({ lang, id }, 'params???');
  const { post, content, codeBlocks, headings } = await getPost(id);

  console.log({ params });

  // if ('v' in props.searchParams) {
  //   return (
  //     <article className={clsx(style.article)}>
  //       {props.children}
  //     </article>
  //   )
  // }

  const articleWidth = " max-w-xl min-w-0 md:flex-1 md:mx-0";

  return (
    <div className={' flex flex-col max-w-full items-stretch gap-9'}>
      <header article-header="" className={clsx(style.article, articleWidth)}>{props.head}</header>
      <div className={" max-w-full block md:flex md:justify-center md:align-top md:gap-8 lg:gap-16 xl:gap-20 "}>
        <div className={clsx(articleWidth, 'mx-auto')}>
          <article
            className={clsx(style.article)}>
            {props.children}
          </article>
        </div>
        {
          !isSystemBlog(post?.tags || []) && (<div className={" hidden md:block max-w-52 lg:max-w-64 overflow-x-clip whitespace-nowrap text-ellipsis text-nowrap"}>
            <aside className={' sticky top-20'}>
              <nav className={clsx(style.toc)}>
                {props.toc}
              </nav>
              {props.tags}
            </aside>
          </div>)}
      </div>
    </div>);
}
