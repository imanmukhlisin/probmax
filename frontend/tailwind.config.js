/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#E3F2FD', // 50
          DEFAULT: '#64B5F6', // 400
          dark: '#1E88E5', // 600
        },
        secondary: {
          light: '#F3E5F5', // 50
          DEFAULT: '#BA68C8', // 300
          dark: '#7B1FA2', // 700
        },
        accent: {
          green: '#81C784',
          yellow: '#FFD54F',
          red: '#E57373',
          teal: '#4DB6AC'
        },
        background: '#F0F4F8'
      }
    },
  },
  plugins: [],
}
