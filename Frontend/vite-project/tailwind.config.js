/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // ✅ Needed for manual toggle
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 15s linear infinite',
      },
    }
    
  },
  plugins: [require("tailwind-scrollbar-hide")],
}
