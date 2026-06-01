/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        steel: '#cbd5e1',
        titanium: '#94a3b8',
        lead: '#475569',
        darkbg: '#0f172a', // adding a darker background color for the dark mode aesthetic
        metalaccent: '#3b82f6', // industrial blue accent
      }
    },
  },
  plugins: [],
}
