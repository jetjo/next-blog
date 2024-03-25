// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconContext } from "react-icons";
import Link from "next/link";
import RLink from "@/components/NavItem/RLink";
import {
  RiHome2Line,
  RiArticleLine,
  RiScreenshotLine,
  RiChat1Line,
  RiGithubLine,
  RiUserHeartLine,
} from "react-icons/ri";
import ThemeSelectorLink from "./client/ThemeSelectorLink";
import ThemeSelectorIcon from "./client/ThemeSelectorIcon";
import cStyle from "./CLink.module.css";

const CLink = ({ children, href, target, ...props }: any) => (
  <Link href={href} target={target || "_self"} {...props}>
    <h2 className={`hover:scale-110 ${cStyle.h2}`}>{children}</h2>
  </Link>
);

const items = [
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
  {
    title: "Contact",
    href: "/contact",
    Icon: () => <RiChat1Line />,
    mode: "icon" as const,
  },
  {
    title: "Github",
    href: "https://github.com/jetjo",
    Icon: () => <RiGithubLine />,
    mode: "icon" as const,
    target: "_blank",
  },
  {
    title: "Toggle Color Theme",
    href: "javascript:void(0)",
    Icon: ThemeSelectorIcon,
    mode: "icon" as const,
    Link: ThemeSelectorLink, //.bind(null, CLink),
  },
];

items.map((item) => (item.Link ||= CLink));

export default function Nav() {
  return (
    <div className="flex justify-between p-8">
      <div className={`inline-block logo`}></div>
      <nav
        className={`inline-flex justify-end gap-3.5 text-gray-700 dark:text-sky-600 hover:text-indigo-700 hover:dark:text-sky-400`}
      >
        {items.map((item) => (
          <RLink key={item.title} {...item} />
        ))}
      </nav>
    </div>
  );
}
