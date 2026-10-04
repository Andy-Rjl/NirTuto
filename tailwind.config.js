

/** @type {import('tailwindcss').Config} */
export default {
  // CETTE LIGNE EST ESSENTIELLE
  darkMode: 'class', 
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Vous pouvez ajouter vos couleurs personnalisées ici si besoin
    },
  },
  plugins: [],
}