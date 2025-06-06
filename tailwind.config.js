// tailwind.config.js
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"], // Asegura que Tailwind escanea los archivos en la carpeta src
    theme: {
      extend: {
        colors: {
          primary: "#D5D1B0",
          secondary: "#ECBE97",
          accent: "#F37A7E",
          background: "#FDF3E8",
          footer: "#5B7870",
        },
        fontFamily: {
          cookflow: ["Mate SC", "serif"], // Asegura que la fuente personalizada se aplica
        },
      },
    },
    plugins: [],
  };




  