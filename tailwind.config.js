/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C5A059',
          hover: '#B59049',
        },
        'noir-bg': '#0B0C10',
        'noir-card': '#16161D',
      }
    },
  },
  plugins: [],
}