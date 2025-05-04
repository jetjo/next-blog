import type { Props } from "../../types/types.[id]";
import { getLatestPopularPost } from "@/app/[lang]/(blog)/actions";

export async function generateStaticParams({ params }: any) {
    const posts = await getLatestPopularPost()
    return posts.map(p => ({ id: p?._id }))
}


export default async function Page(props: Props) {
    return null;
}
