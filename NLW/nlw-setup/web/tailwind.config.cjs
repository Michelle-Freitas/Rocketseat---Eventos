/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.tsx', /*informar os arquivos que terão estilização ->
    todos dentro de src que termine com .tsx*/
    './index.html' //tbm quero no index então informar
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090A'
      }
    },
    gridTemplateRows: {
      7: 'repeat(7, minmax(0, 1fr))'
    }
  },
  plugins: [],
}
