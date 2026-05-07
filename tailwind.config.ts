import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        steel: "#1a1f2e",
        "steel-mid": "#252b3b",
        "steel-light": "#2e3548",
        amber: "#f5a623",
        "amber-bright": "#ffbe3d",
        "amber-dim": "#c47d0e",
        concrete: "#8a8f9e",
        "concrete-light": "#b8bcc8",
        snow: "#f0f2f7",
      },
      fontFamily: {
        bebas: ["'Bebas Neue'", "sans-serif"],
        barlow: ["'Barlow'", "sans-serif"],
        condensed: ["'Barlow Condensed'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
