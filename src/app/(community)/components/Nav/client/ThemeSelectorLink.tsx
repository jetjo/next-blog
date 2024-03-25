"use client";

import { createContext, useEffect, useState } from "react";
import Link from "next/link";
import cStyle from "../CLink.module.css";

export const ThemeContext = createContext({ theme: "normal" });

const THEMES = ["normal", "light", "dark"];

function toggleTheme(curTheme = "normal", init = false) {
  const _curIndex = !init
    ? THEMES.indexOf(curTheme)
    : THEMES.indexOf(curTheme) - 1;
  const curIndex = _curIndex < 0 ? THEMES.length - 1 : _curIndex;
  const themeIdx = (curIndex + 1) % THEMES.length;
  const theme = THEMES[themeIdx];
  document.documentElement.setAttribute("theme", theme);
  document.documentElement.classList.remove(...THEMES);
  const nextTheme =
    theme != "normal"
      ? theme
      : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  document.documentElement.style.colorScheme = nextTheme;
  document.documentElement.classList.add(nextTheme);
  localStorage.setItem("theme", theme);
  return theme;
}

export default function ThemeSelectorLink({ children }: any) {
  const [theme, setTheme] = useState({ theme: "normal" });
  useEffect(() => {
    const theme = localStorage.theme || "normal";
    setTheme({ theme: toggleTheme(theme, true) });
  }, []);
  return (
    <Link
      href=""
      title="Toggle Color Theme"
      onClick={(e: any) => {
        e.preventDefault();
        const theme = toggleTheme(localStorage.theme);
        setTheme({ theme });
      }}
    >
      <h2 className={`hover:scale-110 ${cStyle.h2}`}>
        <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
      </h2>
    </Link>
  );
}
