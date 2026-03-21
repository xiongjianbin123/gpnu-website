/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003087',
        accent: '#C8102E',
      },
      fontFamily: {
        sans: ['Microsoft YaHei', 'SimHei', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
