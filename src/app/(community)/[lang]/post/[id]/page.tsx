// "use client";

import type { Metadata, ResolvingMetadata } from 'next';
import type { AllActiveLabels } from "@/langs";
import type { IBLog } from "@db/blog-model";
import type { Props } from '../types/types.[id]';

import { cookies } from "next/headers";

import { loadCom_ } from "utils/mdx/load.mjs";
import { NoContent } from '@/components/no-content';
import { render } from 'utils/hightlighter.mjs';
export { generateStaticParams } from './_pre-render-utils/page';
import { Article } from './Article';
import { getPost } from "../../../actions";

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  // read route params
  const id = params.id!

  // fetch data
  const { post = {} as IBLog } = await getPost(id); // await fetch(`https://.../${id}`).then((res) => res.json())

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

  const { post, content, codeBlocks } = await getPost(id);
  // console.dir({ post });
  if (!post) return <NoContent className={" relative md:-right-4 lg:-right-8 xl:-right-10 "} message="没有此文章🥹!" />

  if (content.content) {
    content.content = content.content.replaceAll('hiddenForSwitcher', 'hiddenforswitcher');
    content.content = content.content.replaceAll('codeClassNames', 'codeclassnames');
    content.content = content.content.replaceAll('codeLenMax', 'codelenmax');
  }
  const MDXContent = await loadCom_({ code: content?.content || "" });
  // console.dir(content.content, { depth: Infinity })
  if (!MDXContent) return <NoContent className={" relative md:-right-4 lg:-right-8 xl:-right-10 "} message="文章加载失败了☹️!" />

  const preferGramLang = JSON.parse(cookies().get('preferGramLang')?.value || '{}') as AllActiveLabels;//['js']

  // const __html = await render(<Article id={id} ssrEntirely MDXContent={MDXContent} />);

  // return <div dangerouslySetInnerHTML={{ __html }}></div>
  return <Article id={id} preferGramLang={preferGramLang} MDXContent={MDXContent} codeBlocks={codeBlocks} />;
}
