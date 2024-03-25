import BackgroundYear from "@/components/BackgroundYear/BackgroundYear";
import { getLatestPopulatePostGroupByYear } from "../actions";
import BlogItem from "./blog-item";

export default async function BlogList() {
  const posts = await getLatestPopulatePostGroupByYear();
  console.log(posts);

  return (
    <>
      {Object.entries(posts).map(([year, posts]) => (
        <>
          <BackgroundYear year={year} />
          {posts.map((post: any) => (
            <BlogItem key={post.key} post={post} />
          ))}
        </>
      ))}
    </>
  );
}
