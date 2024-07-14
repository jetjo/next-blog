"use client";

import clsx from "clsx";
import { useLayoutEffect } from "react";
import { setupTheme, toggleThemeMode } from "@/utils/client/darkTheme";

import { RiComputerLine, RiMoonLine, RiSunLine } from "react-icons/ri";
import { useTheme } from "@/hooks/useTheme";

export const h2PosBoxStyle = 'fixed bg-gray-100 shadow dark:bg-gray-700 rounded-full '
export const h2Style = 'p-3 overflow-hidden flex justify-center items-center '

export default function ThemeSelectorLink({ className, title }: any) {
  useLayoutEffect(() => {
    setupTheme();
  }, [])
  // console.log({ className });
  const theme = useTheme();
  return (
    <a
      theme-switcher=""
      className={clsx(className, h2Style, ' right-5 bottom-3', h2PosBoxStyle, ` text-slate-700 dark:text-slate-200 `, `hover:text-jj-sky-750 dark:hover:text-sky-400  active:text-opacity-100`)}
      title={title}
      href=""
      onClick={(e: any) => {
        e.preventDefault();
        toggleThemeMode()
      }}
    >
      {
        theme?.mode === "dark" ? <RiMoonLine />
          : theme?.mode === "light" ? <RiSunLine />
            : <RiComputerLine />
      }
    </a>
  );
}
