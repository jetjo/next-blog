
export async function generateStaticParams() {
  const posts = await fetch("http://localhost:3000/api/post")
    .then((res) => res.json())
    .catch(console.error);
  console.log(posts, "posts in generateStaticParams");

  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

export default async function Page(props: any) {
  const {
    params: { slug = "" },
  } = props;
  return <>{slug}</>;
}
