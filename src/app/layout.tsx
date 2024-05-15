import type { Metadata } from "next";
import clsx from "clsx";

import "@/assets/style";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { inter, robotMono, notoSans, notoSansSC } from '@/assets/fonts'

import TestCom_ from "@/tmp/components/TestCom_";
import Plum2 from "@/components/client/Plum2";
import { Theme } from "@/components/Theme";

import "utils/LangUtils.mjs";

config.autoAddCss = false;
export const metadata: Metadata = {
  title: "Code Sky",
  description: "My Code Sky",
};

// // 可以放在任何`Page`或`Layout`,生成静态参数
// // 但是放在这个`Layout`无效, 因为没有捕获`lang`参数段
// export async function generateStaticParams() {
//   return [{ lang: "en-US" }, { lang: "zh-CN" }];
// }

export default function RootLayout({ children, params, ...props }: any) {
  // console.log(props, "params root layout~~~");

  return (
    <html
      lang="en"
      className={clsx(
        robotMono.variable,
        notoSans.variable,
        notoSansSC.variable,
        inter.variable,
        'px-4',
        'md:px-14',
        'lg:px-24',
        'overflow-x-hidden overflow-y-auto',
        'snap-y snap-proximity',
        'scroll-p-[4.5em]',
        'scroll-smooth',
        'touch-manipulation',
        'pb-10',
      )}
    >
      <body>
        {/* <Script id="tyeme-setuper" strategy="beforeInteractive" blocking="render" async="">
          {themeSetupCode}
        </Script> */}
        <Theme />
        <Plum2 />
        {/* {props.nav} 不能加载(community)/@nav插槽 */}
        {children}
        <div className="auth-slot p-7">{props.auth}</div>
        <TestCom_ {...props} />
      </body>
    </html>
  );
}
