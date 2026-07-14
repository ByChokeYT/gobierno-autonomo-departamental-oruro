/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Lineamiento de diseño: Tema negro puro (#000000) con acentos dorados/ámbar. Sin rojo.
        primary: "#000000",
        accent: "#d97706", // Amber 600
        gold: {
          light: "#f59e0b", // Amber 500
          DEFAULT: "#d97706", // Amber 600
          dark: "#b45309" // Amber 700
        }
      }
    },
  },
  plugins: [],
}
