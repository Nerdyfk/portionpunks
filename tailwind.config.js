/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#07080c",
          900: "#0c0e14",
          850: "#12141c",
          800: "#181b25",
          700: "#242833",
          600: "#323845",
        },
        smoke: {
          900: "#161820",
          800: "#222632",
          700: "#323846",
          500: "#6b7280",
          400: "#9aa0ad",
          200: "#d8d4c8",
          100: "#ece7dc",
        },
        gold: {
          100: "#f3e6c8",
          300: "#e4c99a",
          400: "#d4af77",
          500: "#c49a55",
          700: "#8a6a32",
        },
        neon: {
          green: "#3ee08a",
          darkgreen: "#1f9a5a",
          glow: "rgba(212, 175, 119, 0.35)",
          pink: "#e85a9b",
        },
      },
      fontFamily: {
        pixel: ["var(--font-pixel)", "Courier New", "monospace"],
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["Outfit", "system-ui", "sans-serif"],
      },
      animation: {
        "smoke-slow": "smokeSlow 28s ease-in-out infinite alternate",
        "smoke-fast": "smokeFast 18s ease-in-out infinite alternate-reverse",
        "leaf-float-1": "leafFloat1 14s ease-in-out infinite",
        "leaf-float-2": "leafFloat2 20s ease-in-out infinite",
        "character-float": "characterFloat 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "scanline": "scanline 8s linear infinite",
      },
      keyframes: {
        smokeSlow: {
          "0%": { transform: "translate(0%, 0%) scale(1) rotate(0deg)", opacity: "0.45" },
          "50%": { transform: "translate(-3%, 4%) scale(1.08) rotate(1.5deg)", opacity: "0.65" },
          "100%": { transform: "translate(4%, -2%) scale(1.03) rotate(-1deg)", opacity: "0.5" },
        },
        smokeFast: {
          "0%": { transform: "translate(0%, 0%) scale(1) rotate(0deg)", opacity: "0.35" },
          "50%": { transform: "translate(4%, -3%) scale(1.06) rotate(-2deg)", opacity: "0.55" },
          "100%": { transform: "translate(-2%, 3%) scale(0.98) rotate(1deg)", opacity: "0.4" },
        },
        leafFloat1: {
          "0%": { transform: "translate(0, 0) rotate(0deg)", opacity: "0.2" },
          "33%": { transform: "translate(40px, -60px) rotate(45deg)", opacity: "0.8" },
          "66%": { transform: "translate(-20px, -120px) rotate(90deg)", opacity: "0.6" },
          "100%": { transform: "translate(0, -180px) rotate(135deg)", opacity: "0" },
        },
        leafFloat2: {
          "0%": { transform: "translate(0, 0) rotate(0deg)", opacity: "0.3" },
          "50%": { transform: "translate(-50px, -90px) rotate(-60deg)", opacity: "0.7" },
          "100%": { transform: "translate(30px, -200px) rotate(-120deg)", opacity: "0" },
        },
        characterFloat: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(0, 255, 102, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(0, 255, 102, 0.7)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
      },
      boxShadow: {
        "pixel-green": "0 12px 40px rgba(62, 224, 138, 0.18)",
        "pixel-black": "0 16px 40px rgba(0, 0, 0, 0.45)",
        "neon-glow": "0 0 40px rgba(212, 175, 119, 0.28)",
        "neon-glow-lg": "0 0 60px rgba(212, 175, 119, 0.38)",
        gold: "0 18px 50px rgba(212, 175, 119, 0.16)",
      },
    },
  },
  plugins: [],
};
