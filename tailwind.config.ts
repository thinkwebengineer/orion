import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        gold: {
          DEFAULT: "#FFD700",
          light: "#FFE44D",
          dark: "#B8960C",
        },
        amber: {
          warm: "#D97706",
          light: "#F59E0B",
        },
        "card-bg": "#1a1a2e",
      },
    },
  },
  plugins: [],
};
export default config;
