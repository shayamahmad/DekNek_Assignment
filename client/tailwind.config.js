/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        display: ["Outfit", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      colors: {
        surface: {
          DEFAULT: "#12151c",
          raised: "#181c27",
          overlay: "#1e2433",
        },
      },
      boxShadow: {
        glow: "0 0 60px -12px rgba(99, 102, 241, 0.35)",
        card: "0 4px 24px -4px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255,255,255,0.04)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.45s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
