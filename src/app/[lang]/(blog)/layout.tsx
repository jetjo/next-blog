import TestCom_ from "@/tmp/components/TestCom_";
import clsx from "clsx";


// // 可以放在任何`Page`或`Layout`,生成静态参数
// // 但是放在这个`Layout`无效, 因为没有捕获`lang`参数段
// export async function generateStaticParams() {
//   return [{ lang: "en-US" }, { lang: "zh-CN" }];
// }

export default function Layout(props: any) {
  // console.log(props, 'community layout');

  return (
    <main className={clsx("min-h-screen",
      'bg-[var(--main-bg-color)] ')}
    >
      <header main-header=""
        className={clsx(' overflow-hidden sticky z-[999999999] top-0 mb-6 ',
          '-mx-4',
          'md:-mx-14',
          'lg:-mx-24'
        )}
      >
        {props.nav}
        {/* <Nav /> */}
      </header>

      {/* 子节点有`sticky`定位(相对于html), 所以此section不能使用`overflow-hidden`, 否则形成`scroll container` */}
      <section className={'flex justify-center'}>{props.children}</section>

      <footer className="overflow-hidden"></footer>
      <TestCom_ {...props} offset={"4em"} />
    </main>
  );
}
