/**
 * Tailwind configuration — extended with the custom keyframes and animations
 * referenced throughout App.jsx.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "SF Pro Display",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
