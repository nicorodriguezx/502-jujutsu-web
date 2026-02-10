/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f5fc",
          100: "#d9e5f5",
          200: "#b3cbeb",
          300: "#6694cf",
          400: "#1a6fd6",
          500: "#0D47A1",
          600: "#003366",
          700: "#002952",
          800: "#001f3d",
          900: "#001429",
          950: "#000a14",
        },
        gold: {
          50: "#fdf8e8",
          100: "#faf0d1",
          200: "#f5e1a3",
          300: "#ebc347",
          400: "#D4A017",
          500: "#aa8012",
          600: "#7f600e",
          700: "#554009",
          800: "#2a2005",
        },
      },
      fontFamily: {
        sans: ["Rajdhani", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in-down": "fadeInDown 0.35s ease-out forwards",
        "scale-in": "scaleIn 0.5s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)",
        "soft-lg":
          "0 10px 40px -10px rgba(0,0,0,0.1), 0 2px 10px -2px rgba(0,0,0,0.04)",
        "soft-xl":
          "0 20px 60px -15px rgba(0,0,0,0.12), 0 4px 20px -4px rgba(0,0,0,0.05)",
        "glow-navy": "0 0 25px -5px rgba(0,51,102,0.25)",
        "glow-gold": "0 0 25px -5px rgba(212,160,23,0.25)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
