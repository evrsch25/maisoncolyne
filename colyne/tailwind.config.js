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
          50: '#FFFBF6',
          100: '#FFF9F2',
          200: '#FFF6ED',
          300: '#F5EDE5',
          400: '#E5D5CC',
          500: '#D4BDB3',
          600: '#B89D93',
          700: '#9A7D73',
          800: '#7C5E54',
          900: '#5E3F35',
        },
        beige: {
          light: '#FFFBF6',
          DEFAULT: '#FFFBF6',
          dark: '#F5EDE5',
        },
        brown: {
          light: '#D4BDB3',
          DEFAULT: '#B89D93',
          dark: '#9A7D73',
        },
        green: {
          light: '#6B6E5F',
          DEFAULT: '#575A4B',
          dark: '#43463A',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

