import { getLatestPopularPost } from "@/app/(community)/actions";
import { BlogDateTime$1 } from "@/app/(community)/components/blog-datetime";
import { ColorTags } from "@/app/(community)/components/color-tags";
import { WithTheme } from "@/components/server/hoc/theme";
import { _parseInt } from "utils/number.mjs";
import clsx from "clsx";
import style from "./1.module.css"

export default async function Example({ posts: _posts }: { posts?: any[] }) {
  const posts = _posts || await getLatestPopularPost();
  const ColorTagsWithTheme = WithTheme(ColorTags);
  return (
    <div className={clsx('mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-x-12 gap-y-20 border-t pt-10 sm:pt-16 xl:mx-0 xl:max-w-none xl:grid-cols-2', style.articleBox)}>
      {posts.map((post) => (
        <article key={post._id} className="flex max-w-xl flex-col items-start border rounded-lg p-10 ">
          <BlogDateTime$1 post={post} />
          <div className="group relative">
            <h2 className="mt-3 text-2xl font-semibold leading-6  text-[color:var(--foreground-h2)] group-hover:opacity-90">
              <a href={`/post/${post._id}`}>
                <span className="absolute inset-0" />
                {post.title}
              </a>
            </h2>
            <p className="mt-5 line-clamp-3 leading-6 ">{post.description}</p>
          </div>
          <div className="relative mt-8 flex flex-wrap gap-4">
            <ColorTagsWithTheme tags={post.tags.slice(0, 5)} />
          </div>
        </article>
      ))}
    </div>
  )
}
