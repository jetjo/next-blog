import type { Config } from "tailwindcss";
import TWForms from '@tailwindcss/forms';
// import { addDynamicIconSelectors } from "@iconify/tailwind";
const defaultTheme = require('tailwindcss/defaultTheme')

const config: Config = {
  darkMode: [
    "selector",
    '[theme="dark"]'
  ],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'jj-sky-750': '#0097e3'
      },
      fontFamily: {
        sans: ['Optimistic Display', 'var(--font-inter)', 'var(--font-noto-sans-sc)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-robot-mono)', ...defaultTheme.fontFamily.mono],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    TWForms,
    // Iconify plugin
    // addDynamicIconSelectors({ prefix: "ri" }),
  ],
};
export default config;
