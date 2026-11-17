import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#070707",
        panel: "#101010",
        ivory: "#f4efe4",
        mute: "#cbbfaa",
        gold: {
          DEFAULT: "#d4bc86",
          deep: "#c6a15b",
        },
        paper: {
          DEFAULT: "#f3eee6",
          deep: "#e5dccb",
        },
        soot: "#161311",
        stone: "#6e675f",
        clay: {
          DEFAULT: "#9c4221",
          deep: "#7a3016",
        },
        brand: {
          black: "#111111",
          charcoal: "#242424",
          gold: "#C5A15B",
          mist: "#F5F5F3",
          line: "#EEEEEE",
          text: "#171717",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial Narrow", "Impact", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
