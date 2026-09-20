/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'westeros-gold': '#D4AF37',
        'stark-grey': '#6B7280',
        'lannister-red': '#DC2626',
        'targaryen-black': '#1F2937',
        'night-black': '#0F172A',
      },
      fontFamily: {
        'cinzel': ['Cinzel', 'serif'],
        'medieval': ['MedievalSharp', 'cursive'],
      },
    },
  },
  plugins: [],
}
