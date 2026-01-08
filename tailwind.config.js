/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        financial: {
          primary: "#0f172a", // Slate 900
          secondary: "#334155", // Slate 700
          accent: "#10b981", // Emerald 500
          bg: "#f8fafc", // Slate 50
          surface: "#ffffff", // White
        },
      },
    },
  },
  plugins: [],
};
