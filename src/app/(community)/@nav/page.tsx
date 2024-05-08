/**
 * @file /src/app/(community)/@nav/page.tsx
 * 这个页面本来就无法路由到, 因为根据文件的路径, 对应的路由是 `/`
 * 但是这个页面要渲染在上一级目录中的 layout.tsx 中,
 * 但是上一级目录的 layout.tsx 不会在`/`下渲染
 */
export default function Page(props: { children: React.ReactNode }) {
  return null;
}
