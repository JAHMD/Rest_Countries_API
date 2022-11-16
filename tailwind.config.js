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
          text: "hsl(228, 34%, 80%)",
          100: "hsl(229, 27%, 20%)",
          200: "hsl(232, 19%, 15%)",
          300: "hsl(228, 34%, 100%)",
        },
        light: {
          text: "hsl(229, 12%, 30%)",
          100: "hsl(0, 0%, 100%)",
          200: "hsl(228, 50%, 96%)",
          300: "hsl(229, 12%, 20%)",
        },
      },
    },
  },
  plugins: [],
};
