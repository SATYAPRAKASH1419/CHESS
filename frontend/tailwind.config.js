/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chessLight: '#A7C3D1',
        chessDark: '#6D93A5',
      },
    },
  },
  plugins: [],
}