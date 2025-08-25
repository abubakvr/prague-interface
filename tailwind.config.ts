import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        sidebar: {
          light: {
            bg: "#1e40af", // blue-800
            hover: "#1d4ed8", // blue-700
            active: "#1e3a8a", // blue-900
            border: "#3b82f6", // blue-500
            text: "#ffffff",
            textSecondary: "#dbeafe", // blue-100
          },
          dark: {
            bg: "#0f172a", // slate-900
            hover: "#1e293b", // slate-800
            active: "#020617", // slate-950
            border: "#475569", // slate-600
            text: "#f8fafc", // slate-50
            textSecondary: "#94a3b8", // slate-400
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
