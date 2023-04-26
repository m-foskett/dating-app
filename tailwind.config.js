/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#00CCBB',
        secondary: '#4ecdc4',
        white: '#ffffff',
        grey: '#b3b3b3',
        offgrey: '#F3F3F4',
        offgreen: "#01A296",
        purple: '#3f3cbb',
        midnight: '#121063',
        metal: '#565584',
        tahiti: '#3ab7bf',
        silver: '#ecebff',
        bubblegum: '#ff77e9',
        bermuda: '#78dcca',
      },
    },
  },
  plugins: [],
}
