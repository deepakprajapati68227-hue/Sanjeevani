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
        ink: {
          DEFAULT: "#17212B",
          950: "#17212B",
        },
        navy: {
          DEFAULT: "#203447",
          900: "#203447",
          800: "#2D465A",
          card: "#203447",
          border: "#2D465A",
        },
        slate: {
          DEFAULT: "#526575",
          700: "#526575",
          500: "#7D8C98",
          300: "#B0BEC5",
        },
        mist: {
          DEFAULT: "#F4F7F8",
          100: "#F4F7F8",
          200: "#E7EDF0",
          300: "#D5DFE5",
        },
        white: "#FFFFFF",
        teal: {
          DEFAULT: "#147D78",
          dark: "#0E625E",
          light: "#199A94",
        },
        sanjeevani: {
          teal: "#147D78",
          "teal-dark": "#0E625E",
        },
        stable: {
          DEFAULT: "#2E8B68",
          surface: "#EAF5F0",
          border: "#BCE1D1",
        },
        watch: {
          DEFAULT: "#B7791F",
          surface: "#FBF3E8",
          border: "#F3D8B0",
        },
        critical: {
          DEFAULT: "#C43D3D",
          dark: "#982F35",
          surface: "#FCEBEB",
          border: "#F4BEBE",
        },
        information: "#2F6F9F",
        analysis: "#635B8F",
        focus: "#1E6FA8",
        // Backward-compatible semantic mappings
        cloud: "#F4F7F8",
        muted: "#7D8C98",
        pink: {
          DEFAULT: "#147D78",
          hover: "#0E625E",
          light: "#EAF5F0",
        },
        risk: {
          low: "#2E8B68",
          moderate: "#B7791F",
          high: "#C43D3D",
        },
      },
      fontFamily: {
        heading: ["var(--font-sora)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "6px",
        btn: "6px",
        bubble: "12px",
      },
      transitionDuration: {
        fast: "120ms",
        standard: "200ms",
        emphasis: "350ms",
      },
      keyframes: {
        softFade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        softFade: "softFade 0.2s ease-out forwards",
        slideInRight: "slideInRight 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};
export default config;
