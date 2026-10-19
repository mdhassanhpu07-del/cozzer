import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cozzer: {
          obsidian: "#171717",
          charcoal: "#242424",
          dark: "#1A1918",
          bronze: {
            DEFAULT: "#9B7B50",
            light: "#B8996F",
            dark: "#7D623C",
            muted: "#C4AC8D",
          },
          ivory: {
            DEFAULT: "#F5F1E8",
            light: "#FDFCF9",
            warm: "#FAF7F2",
            sand: "#EAE4D8",
          },
          border: {
            subtle: "rgba(155, 123, 80, 0.2)",
            light: "#E5DFD3",
            dark: "#2E2D2B",
          },
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-cinzel)", "var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(23, 23, 23, 0.08)",
        "luxury-lg": "0 20px 40px -15px rgba(23, 23, 23, 0.12)",
        bronze: "0 4px 20px -2px rgba(155, 123, 80, 0.25)",
      },
      letterSpacing: {
        widestx2: "0.25em",
        brand: "0.2em",
      },
    },
  },
  plugins: [],
};
export default config;
