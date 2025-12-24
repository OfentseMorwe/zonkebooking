/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",
    "./public/*.html",
    "./public/**/*.js",
    "./src/**/*.{html,js,css}",
    "./*.html",
    "./*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#faf6f2",
          100: "#f4ece0", 
          200: "#e8d5bc",
          300: "#d9b892",
          400: "#c8956a",
          500: "#b87a4a",
          600: "#a9663f",
          700: "#8a5a44",
          800: "#6d4532",
          900: "#593829",
        },
        accent: {
          50: "#fdf8f3",
          100: "#f8e9d7",
          200: "#f0d0ae",
          300: "#e6b27e",
          400: "#d99454",
          500: "#d4a574",
          600: "#b87a4a",
          700: "#99603a",
          800: "#7c4d30",
          900: "#654029",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};