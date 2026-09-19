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
        navy: {
          DEFAULT: "#0A1128",
          dark: "#050B1B",
          light: "#141F40",
          card: "#101B3B",
        },
        pink: {
          DEFAULT: "#EC1E63",
          hover: "#D81555",
          light: "#FDF2F5",
        },
        risk: {
          low: "#2E7D32",
          moderate: "#F9A825",
          high: "#D32F2F",
        },
        surface: {
          gray: "#F5F5F7",
          dark: "#1A1A2E",
          cardDark: "#111827",
        }
      },
      fontFamily: {
        heading: ["var(--font-sora)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "4px",
        btn: "8px",
        bubble: "20px",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(211, 47, 47, 0.7)" },
          "50%": { transform: "scale(1.15)", boxShadow: "0 0 20px 8px rgba(211, 47, 47, 0.4)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        }
      },
      animation: {
        pulseGlow: "pulseGlow 2s infinite ease-in-out",
        slideInRight: "slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }
    },
  },
  plugins: [],
};
export default config;
