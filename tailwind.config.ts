import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cream: "#FAF7F2",
        "cream-dark": "#F0EAE0",
        charcoal: "#2C2C2C",
        terracotta: "#B5866B",
        "terracotta-light": "#C9A08A",
        parchment: "#D4C5B0",
        beige: "#E8DDD0",
        sage: "#7A9E7E",
        ink: "#1A1A1A",
        "dark-bg": "#1C1917",
        "dark-surface": "#292524",
        "dark-border": "#44403C",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-lora)", "serif"],
        accent: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "fade-in-delay": "fadeIn 0.6s ease-out 0.3s forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: "var(--font-lora), serif",
            color: "#2C2C2C",
            lineHeight: "1.9",
            fontSize: "1.1rem",
            "h1, h2, h3": {
              fontFamily: "var(--font-playfair), serif",
            },
            a: { color: "#B5866B" },
            blockquote: {
              borderLeftColor: "#B5866B",
              fontStyle: "italic",
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "1.25rem",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
