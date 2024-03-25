"use client";

import { useContext } from "react";
import { RiComputerLine, RiMoonLine, RiSunLine } from "react-icons/ri";
import { ThemeContext } from "./ThemeSelectorLink";

export default function ThemeSelectorIcon() {
  const theme = useContext(ThemeContext);
  // alert("theme: " + theme.theme);
  return theme.theme === "dark" ? (
    <RiSunLine />
  ) : theme.theme === "light" ? (
    <RiMoonLine />
  ) : (
    <RiComputerLine />
  );
}
