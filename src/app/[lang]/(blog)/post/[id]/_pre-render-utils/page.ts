import { getLatestPopularPost } from "@/app/[lang]/(blog)/actions";

export async function generateStaticParams({ params }: any) {
    const posts = await getLatestPopularPost()
    return posts.map(p => ({ id: p?._id }))
}
