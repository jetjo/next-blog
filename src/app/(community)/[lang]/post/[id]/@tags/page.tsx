import type { Props } from "../../types/types.[id]";

import Tags from "./tags";
import { getPost } from "@/app/(community)/actions";

export { generateStaticParams } from '../_pre-render-utils/page';

export default async function Page({ params }: Props) {

    const { post, content, codeBlocks, headings, matchedTags } = await getPost(params.id);
    if (!post) return null;
    return (<Tags post={post!} matchedTags={matchedTags}></Tags>)
}
