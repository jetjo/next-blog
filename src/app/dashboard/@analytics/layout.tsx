import Link from 'next/link'
 
/**
 * 经测试, 不会包裹同级`default.jsx`
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Link href="/dashboard/page-views">Page Views</Link>
        <Link href="/dashboard/visitors">Visitors</Link>
      </nav>
      <div>{children}</div>
    </>
  )
}
