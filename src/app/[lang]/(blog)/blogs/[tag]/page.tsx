import type { Props } from "../types/types.[tag]";
import { getPosts } from "@/app/[lang]/(blog)/actions";
import Demo from "../_demos/三列响应式-最近文章列表";

export default async function Page(props: Props) {
    const tag = decodeURIComponent(props.params.tag);
    const posts = await getPosts(tag)
    return <Demo posts={posts} />
}