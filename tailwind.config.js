/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.jsx',
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#4BE584',
        'forest-green': '#2B6147',
        'dark-green': '#058031',
        'light-gray-bg': '#F5F5F5',
      },
      fontFamily: {
        sans: ['Bai Jamjuree', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
