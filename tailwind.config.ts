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
        // Section 11: Monsoon Indigo + River Teal + Saffron Palette
        surface: {
          page: "#F7F9FC",
          card: "#FFFFFF",
          soft: "#EAF2F5",
        },
        primary: {
          indigo: "#3157A6",
          dark: "#24417D",
        },
        secondary: {
          teal: "#087F7B",
          dark: "#05605D",
        },
        attention: {
          saffron: "#C47A12",
          soft: "#FFF3D6",
        },
        "border-default": "#CBD7E2",
        "text-strong": "#172B4D",
        "text-muted": "#52657A",
        "info-blue": "#2B6EA6",
        "analysis-indigo": "#6558A5",
        "focus-blue": "#1D6FD0",
        navy: {
          DEFAULT: "#203447",
          900: "#203447",
          800: "#2D465A",
          card: "#203447",
          border: "#2D465A",
        },
        slate: {
          DEFAULT: "#52657A",
          700: "#52657A",
          500: "#7D8C98",
          300: "#B0BEC5",
        },
        mist: {
          DEFAULT: "#F7F9FC",
          100: "#F7F9FC",
          200: "#EAF2F5",
          300: "#CBD7E2",
        },
        white: "#FFFFFF",
        teal: {
          DEFAULT: "#087F7B",
          dark: "#05605D",
          light: "#E5F3EC",
        },
        sanjeevani: {
          teal: "#087F7B",
          "teal-dark": "#05605D",
          indigo: "#3157A6",
          "indigo-dark": "#24417D",
          saffron: "#C47A12",
        },
        stable: {
          DEFAULT: "#267A58",
          surface: "#E5F3EC",
          border: "#BCE1D1",
        },
        watch: {
          DEFAULT: "#C47A12",
          surface: "#FFF3D6",
          border: "#F3D8B0",
        },
        critical: {
          DEFAULT: "#B9383E",
          dark: "#982F35",
          surface: "#FBE8E8",
          border: "#F4BEBE",
        },
        information: "#2B6EA6",
        analysis: "#6558A5",
        focus: "#1D6FD0",
        cloud: "#F7F9FC",
        muted: "#52657A",
        pink: {
          DEFAULT: "#087F7B",
          hover: "#05605D",
          light: "#E5F3EC",
        },
        risk: {
          low: "#267A58",
          moderate: "#C47A12",
          high: "#B9383E",
          stable: "#267A58",
          stableSoft: "#E5F3EC",
          watch: "#C47A12",
          watchSoft: "#FFF3D6",
          critical: "#B9383E",
          criticalSoft: "#FBE8E8",
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
