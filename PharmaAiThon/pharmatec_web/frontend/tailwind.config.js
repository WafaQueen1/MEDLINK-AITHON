/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-dark': '#0A0A0B',
        'tech-turquoise': '#2DD4BF',
        'royal-green': '#064E3B',
        'tech-gray': '#F1F5F9',
        'royal-light': '#F8FAFC',
      },
      boxShadow: {
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
        'turquoise': '0 0 20px rgba(45, 212, 191, 0.3)',
      },
      backdropBlur: {
        'md': '12px',
      }
    },
  },
  plugins: [],
}
