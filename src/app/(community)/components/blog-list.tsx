import { isSystemBlog } from "@db/blog-model";
import BackgroundYear from "@/components/BackgroundYear/BackgroundYear";
import { getLatestPopularPostGroupByYear } from "../actions";
import BlogItem from "./blog-item";

// export const revalidate = 3600 // revalidate the data at most every hour

export default async function BlogList() {
  const posts = await getLatestPopularPostGroupByYear();
  // console.log({ posts });

  return (
    <>
      {Object.entries(posts).map(([year, posts]) => (
        <>
          <BackgroundYear year={year} />
          {posts.filter(p => !isSystemBlog(p.tags)).map((post: any) => (
            <BlogItem key={post._id} post={post} />
          ))}
        </>
      ))}
    </>
  );
}
