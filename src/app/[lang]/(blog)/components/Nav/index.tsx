import Link from "next/link";
import RLink from "@/components/server/NavItem/RLink";
import {
  RiHome2Line,
  RiArticleLine,
  RiScreenshotLine,
  RiChat1Line,
  RiGithubLine,
  RiUserHeartLine,
  RiArrowUpLine,
} from "react-icons/ri";
import ThemeSelectorLink from "../../../../../components/client/ThemeSelectorLink";
import GotoTop from "../../../../../components/client/GotoTop";
import clsx from "clsx";

const items = [
  {
    title: "Toggle Color Theme",
    href: "javascript:void(0)",
    mode: "icon" as const,
    Link: ThemeSelectorLink, //.bind(null, CLink),
  },
  {
    title: "Goto Top",
    href: "javascript:void(0)",
    mode: "icon" as const,
    Link: GotoTop, //.bind(null, CLink),
  },
  {
    title: "Home",
    href: "/",
    Icon: () => <RiHome2Line />,
  },
  {
    title: "Blog",
    href: "/blogs",
    Icon: () => <RiArticleLine />,
  },
  {
    title: "Demos",
    href: "/demos",
    Icon: () => <RiScreenshotLine />,
  },
  // {
  //   title: "Contact",
  //   href: "/contact",
  //   Icon: () => <RiChat1Line />,
  //   mode: "icon" as const,
  // },
  // {
  //   title: "Github",
  //   href: "https://github.com/jetjo",
  //   Icon: () => <RiGithubLine />,
  //   mode: "icon" as const,
  //   target: "_blank",
  // },
  // ...(LinkItemsDev as any[]),
];

export default function Nav() {
  return (
    <div className="before:block before:absolute before:top-0 before:bottom-0 before:-z-[1] before:w-full before:backdrop-blur before:backdrop-saturate-200 px-8 flex justify-between items-center border-b dark:border-b-0 border-[--common-border-color] bg-[--main-nav-bg-color] ">
      <div className={`inline-block logo`}></div>
      <nav
        className={clsx(` inline-flex justify-end items-center gap-3.5 text-lg font-semibold py-[1em] `, ` text-slate-700 dark:text-slate-200 `)}
      >
        <ul className={clsx(`flex space-x-8 items-center`)}>
          {items.map((item) => (
            <li
              key={item.title}
              className={clsx(`hover:text-jj-sky-750 dark:hover:text-sky-400  active:text-opacity-100`)}>
              <RLink {...item} />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
