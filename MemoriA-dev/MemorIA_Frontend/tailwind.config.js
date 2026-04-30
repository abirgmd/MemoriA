/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}'
  ],
  theme: {
    extend: {
      colors: {
        memoria: {
          primary: '#541A75',
          slate: '#7E7F9A',
          mint: '#C0E0DE',
          success: '#00635D',
          danger: '#CB1527'
        }
      }
    }
  },
  plugins: []
};

