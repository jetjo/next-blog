export default function MDXWrapper({ children }: any) {
  console.log(children, 'mdx layout children');

  return <div mdx-wrapper="">{children}</div>;
}
