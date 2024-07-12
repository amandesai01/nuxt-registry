export default {
  content: ['./app/**/*.vue'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Raleway', 'sans-serif'],
        secondary: ['Mulish', 'sans-serif'],
      },
    },
  },
  daisyui: {
    themes: ["forest"],
  },
  plugins: [
    // eslint-disable-next-line global-require
    require('daisyui'),
  ],
};
