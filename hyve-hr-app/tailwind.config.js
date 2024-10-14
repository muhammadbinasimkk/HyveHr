/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        verdana: ['Verdana', 'sans-serif'],  // If you're still using Verdana
        tahoma: ['Tahoma', 'sans-serif'],    // Adding Tahoma font
      },
    },
  },
  plugins: [],
}
