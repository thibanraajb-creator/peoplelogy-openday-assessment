/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          primary: '#00ADA9',
          light: '#E6FAF9',
          dark: '#008a87',
        },
        navy: {
          DEFAULT: '#1B3A5C',
          dark: '#122840',
          light: '#254d7a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
