/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{html,js}",
    "./public/**/*.{html,js}",
    "./index.html",
    "./detail.html",
  ],
  theme: {
    extend: {
      container: {
        padding: "1.5rem",
        center: true,
      },
      fontSize: {
        home: "14px",
        details: "16px",
      },
      fontFamily: {
        NunitoSans: ["Nunito Sans", "sans-serif"],
      },
      colors: {
        dark: {
          100: "hsl(209, 23%, 22%)",
          200: "hsl(207, 26%, 17%)",
        },
        light: {
          100: "hsl(0, 0%, 96%)",
          200: "hsl(0, 0%, 52%)",
          300: "hsl(200, 15%, 8%)",
        },
      },
    },
  },
  plugins: [],
};
