/** @type {import('tailwindcss').Config} */
export default {
  content: [ //determina os arq q vão ter classes do tailwind
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", //tds arq dentro de src com essas extensões
  ],
  theme: {
    extend: { //extender as props do tailwind, podemos colocar cores, fontes que não são pré definidas por ele
      fontFamily:{ //https://tailwindcss.com/docs/font-family#customizing-your-theme
        sans: ['Inter', 'sans-serif'] //vamos susbstituir o sans 
      }
    },
  },
  plugins: [],
}

