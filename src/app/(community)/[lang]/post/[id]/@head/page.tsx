import type { Props } from "../../types/types.[id]";

import clsx from "clsx";
import MDXLayout from '../_MDXLayout'
import BlogDateTime from "@/app/(community)/components/blog-datetime";
import { getPost } from "@/app/(community)/actions";

export { generateStaticParams } from '../_pre-render-utils/page';

export default async function Header({ params }: Props) {

    const { post, content, codeBlocks, headings } = await getPost(params.id);
    // console.dir({ post, headings });
    if (!post) return null;
    
    const heading1 = headings?.[0];
    const h1Content = heading1?.depth === 1 ? heading1.value : post?.title;

    // headings?.map(h => addUpOffsetTop(h.id))

    return (
        <MDXLayout>
            <div className={clsx('flex flex-col max-w-full gap-2')}>
                <h1 className={clsx('not-prose', 'block')}>
                    <a aria-hidden="true" >
                        <i h-link="" className=" inline-flex align-bottom mr-1"><svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></i>
                    </a>
                    {h1Content}
                </h1>
                <div className=" indent-[.333rem]">
                    {post && <BlogDateTime post={post} dateTemplate="MMM DD,YYYY" isListItem={false} />}
                </div>
            </div>
        </MDXLayout>)
}