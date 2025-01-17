/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-primary': '#2C3E50',
        'game-secondary': '#E74C3C',
        'game-accent': '#F1C40F'
      }
    },
  },
  plugins: [],
}