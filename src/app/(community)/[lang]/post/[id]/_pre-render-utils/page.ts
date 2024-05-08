import { getLatestPopularPost } from "@/app/(community)/actions";

export async function generateStaticParams({ params }: any) {
    const posts = await getLatestPopularPost()
    return posts.map(p => ({ id: p?._id }))
}
