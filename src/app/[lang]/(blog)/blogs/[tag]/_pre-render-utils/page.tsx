import type { Props } from "../../types/types.[tag]";
import { getAllTagFromCache } from "@/app/[lang]/(blog)/actions";

export async function generateStaticParams({ params }: any) {
    const posts = await getAllTagFromCache()
    return posts.map(p => ({ tag: p }))
}


export default async function Page(props: Props) {
    return null;
}
