/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#e8590c",
        primaryDark: "#a63e07",
        primaryLight: "#e86e2c",
        secondary: "#fcc418",
        secondaryDark: "#ba8e06",
        secondaryLight: "#f5d05d",
        dark: "#212529",
        white: "#fffefc",
        grey: "#ebebeb",
        gold: "#f2cd72",
        silver: "#cccccc",
        bronze: "#d89173",
      },
    },
  },
  plugins: [],
};
