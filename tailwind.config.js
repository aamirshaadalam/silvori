/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layout/**/*.liquid',
    './templates/**/*.liquid',
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
    './assets/**/*.js',
  ],
  theme: {
    extend: {
      aspectRatio: {
        '3/4': '3 / 4',
      },
    },
  },
  plugins: [],
};
