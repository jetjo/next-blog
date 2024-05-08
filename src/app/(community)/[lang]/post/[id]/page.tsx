// "use client";

import type { Metadata, ResolvingMetadata } from 'next';
import type { IBLog } from '@/model/blog';
import type { Props } from '../types/types.[id]';
import type { Blog } from '@/model/blog/Blog';

import { cookies } from "next/headers";
import { AllActiveLabels } from "@/langs";
import { loadCom_ } from "@/utils/mdx/load";
import { getPost } from "../../../actions";
import MDXLayout from "./_MDXLayout";
import Image from "./_components/_Image";
import { Check, Cross } from "./_components/icons";
import { Code, Pre } from "./_components/code";
import Chart from "./_components/chart";
import { Math as _MathCom, MathParams } from './_components/math'
import Table from "./_components/Table";
import HLink from "./_components/HLink";
import BlogDateTime from '@/app/(community)/components/blog-datetime';
import { addUpOffsetTop } from '@/utils/client/DOM/position';
import { NoContent } from '@/components/no-content';
export { generateStaticParams } from './_pre-render-utils/page';

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  // read route params
  const id = params.id!

  // fetch data
  const { post = {} as IBLog } = await getPost(id); // await fetch(`https://.../${id}`).then((res) => res.json())
  // console.log({ post });

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: post.title,
    keywords: post.keywords,
    description: post.description,
    // appLinks: post.links,
    // authors: post.author,
    // category: post.category
    // openGraph: {
    //   images: ['/some-specific-page-image.jpg', ...previousImages],
    // },
  }
}

export default async function Page({ params: { id, ...params }, ...props }: Props) {

  const { post, content, codeBlocks, headings } = await getPost(id);
  console.dir({ post });
  if (!post) return <NoContent className={" relative md:-right-4 lg:-right-8 xl:-right-10 "} message="没有此文章🥹!" />

  const MDXContent = await loadCom_({ code: content?.content || "" });
  if (!MDXContent) return <NoContent className={" relative md:-right-4 lg:-right-8 xl:-right-10 "} message="文章加载失败了☹️!" />
  // console.log(MDXContent.toString(), 'MDXContent default export');

  const preferGramLang = JSON.parse(cookies().get('preferGramLang')?.value || '{}') as AllActiveLabels;//['js']

  return (
    <>
      {/* https://unifiedjs.com/explore/package/@mdx-js/mdx/#notes */}
      {/* https://mdxjs.com/packages/mdx/#notes */}
      {/* 优化方案: https://nextjs.org/docs/pages/building-your-application/configuring/mdx#custom-elements */}
      {MDXContent({
        name: 'Jetjo`s blog!',
        year: '2024',
        codeBlocks,
        ...MathParams,
        components: {
          wrapper: MDXLayout,
          Image,
          Check,
          Cross,
          code: Code,
          pre: ({ children, ...props }: any) => <Pre preferGramLang={preferGramLang} codeBlocks={codeBlocks} {...props}>{children}</Pre>,
          Chart,
          Math: _MathCom,
          table: Table,
          "h-link": HLink,
        }
      })}
    </>
  );
}
