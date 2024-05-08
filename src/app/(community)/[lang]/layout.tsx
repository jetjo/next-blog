// 可以放在任何`Page`或`Layout`,生成静态参数
export async function generateStaticParams() {
  return [{ lang: "en-US" }, { lang: "zh-CN" }];
}

export default function Layout({ children, params: { lang } }: any) {
  // console.log(lang, "community blog layout");

  return <>{children}</>;
}
