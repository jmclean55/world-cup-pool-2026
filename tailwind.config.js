/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        wc: {
          gold: '#C9A84C',
          green: '#006341',
          dark: '#0D1117',
          card: '#161B22',
          border: '#30363D',
        },
      },
    },
  },
  plugins: [],
}
