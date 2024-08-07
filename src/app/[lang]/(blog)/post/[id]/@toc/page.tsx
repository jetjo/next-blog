import type { Props } from "../../types/types.[id]";

import TocListItem from "./toc-list-item";
import { getPost } from "@/app/[lang]/(blog)/actions";

export { generateStaticParams } from '../_pre-render-utils/page';

export default async function TOC({ params, ...props }: Props) {

    if ('v' in props.searchParams) {
        return null;
    }

    const { post, content, codeBlocks, headings } = await getPost(params.id);
    if (!post) return null;
    // console.dir({ post });
    headings?.forEach((h, i) => h.idx = i);
    const h2s = headings?.filter(h => h.depth === 2)
    return (
        <div className={"doc-toc-box"}>
            {/* <section> */}
            <header>
                <h2 className={"toc-header, mb-4"}>In this article</h2>
            </header>
            <ul className={"toc-list"}>
                {h2s?.map((h2) => (
                    <TocListItem key={h2._id} h2={h2} />
                ))}
            </ul>
            {/* </section> */}
        </div>)
}