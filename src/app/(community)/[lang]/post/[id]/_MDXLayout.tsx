import clsx from "clsx";
import tableStyle from './table.module.css'

export default function MDXWrapper({ children }: any) {
  // console.log(children, 'mdx layout children');

  return <div mdx-wrapper="" className={clsx(tableStyle.prose)}>{children}</div>;
}
