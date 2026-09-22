/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'sn-green': {
          DEFAULT: '#00853F',
          50: '#e6f7ef',
          100: '#c2edd8',
          600: '#00853F',
          700: '#006c33',
          800: '#025227',
          900: '#013b1c',
        },
        'sn-yellow': {
          DEFAULT: '#FDEF42',
          400: '#FDEF42',
          500: '#e5d729',
          600: '#b8ac12',
        },
        'sn-red': {
          DEFAULT: '#E31B23',
          500: '#E31B23',
          600: '#c4141b',
          700: '#9e0f15',
        },
        'sn-dark': '#0f172a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
