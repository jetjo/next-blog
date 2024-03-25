import type { Config } from "tailwindcss";
// import { addDynamicIconSelectors } from "@iconify/tailwind";

const config: Config = {
  darkMode: [
    "selector",
    '[theme="dark"]',
    // "@media (prefers-color-scheme: dark) { &:not(.light *) }",
    // "variant",
    // [
    //   '[data-mode="dark"]',
    //   "@media (prefers-color-scheme: dark) { &:not(.light *) }",
    //   "&:is(.dark *)",
    // ],
  ],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    // Iconify plugin
    // addDynamicIconSelectors({ prefix: "ri" }),
  ],
};
export default config;
