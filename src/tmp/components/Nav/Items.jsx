// @ts-check
import * as React from 'react';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconContext } from "react-icons";
import Link from "next/link";
// import RLink from "@/components/NavItem/RLink";
import {
RiSettings2Line,
RiLoginBoxLine,
RiDashboard3Line
} from "react-icons/ri";
// import ThemeSelectorLink from "./client/ThemeSelectorLink";
// import ThemeSelectorIcon from "./client/ThemeSelectorIcon";

const items = [
  {
    title: "Setting",
    href: "/setting",
    Icon: () => <RiSettings2Line />,
    mode: 'icon'
  },
  {
    title: "Auth",
    href: "/client",
    Icon: () => <RiLoginBoxLine />,
    mode: 'icon'
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    Icon: () => <RiDashboard3Line />,
    mode: 'icon'
  },
  {
    title: "Dashboard",
    href: "/dashboard/page-views",
    Icon: () => <RiDashboard3Line />,
    mode: 'icon'
  },
  {
    title: "Dashboard",
    href: "/dashboard/visitors",
    Icon: () => <RiDashboard3Line />,
    mode: 'icon'
  },
  {
    title: "Login",
    href: "/login",
    Icon: () => <RiLoginBoxLine />,
    mode: 'icon'
  },
//   {
//     title: "Toggle Color Theme",
//     href: "javascript:void(0)",
//     Icon: ThemeSelectorIcon,
//     mode: "icon" as const,
//     Link: ThemeSelectorLink, //.bind(null, CLink),
//   },
];

export default items;
