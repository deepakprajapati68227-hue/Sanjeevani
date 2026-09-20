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
        ink: "#0B1220",
        navy: {
          DEFAULT: "#12233A",
          dark: "#0B1220",
          light: "#1E344D",
          card: "#162940",
          border: "#2C4663",
        },
        slate: {
          DEFAULT: "#1E344D",
          light: "#2A4766",
          dark: "#142436",
          card: "#182C44",
          border: "#28435E",
        },
        cloud: "#F5F7FA",
        muted: "#94A3B8",
        teal: {
          DEFAULT: "#16B8A6",
          light: "#2DD4BF",
          dark: "#0F766E",
        },
        amber: {
          DEFAULT: "#F5B942",
          light: "#FCD34D",
          dark: "#D97706",
        },
        coral: "#F16B6F",
        critical: "#E5484D",
        violet: "#8B7CF6",
        // Backward-compatible tokens
        pink: {
          DEFAULT: "#EC1E63",
          hover: "#D81555",
          light: "#FDF2F5",
        },
        risk: {
          low: "#16B8A6",
          moderate: "#F5B942",
          high: "#E5484D",
        },
        surface: {
          gray: "#F5F5F7",
          dark: "#0B1220",
          cardDark: "#162940",
        }
      },
      fontFamily: {
        heading: ["var(--font-sora)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "6px",
        btn: "6px",
        bubble: "18px",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(229, 72, 77, 0.7)" },
          "50%": { transform: "scale(1.08)", boxShadow: "0 0 16px 4px rgba(229, 72, 77, 0.3)" },
        },
        softPulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        }
      },
      animation: {
        pulseGlow: "pulseGlow 2.5s infinite ease-in-out",
        softPulse: "softPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        slideInRight: "slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }
    },
  },
  plugins: [],
};
export default config;
