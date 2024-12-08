import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["var(--font-montserrat)"],
        bemboExtraBold: ["var(--font-bembo-extra-bold)"],
      },
      colors: {
        primary: {
          dark: "#1a1b26",
          light: "#24283b",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
