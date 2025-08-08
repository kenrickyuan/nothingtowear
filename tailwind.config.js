module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    colors: {
      white: "#FFFFFF",
      black: "#000000",
      lightGrey: "#E3E3E3",
      lighterGrey: "#F3F3F3",
      grey: "#787878",
      green: "#06aa6d",
      deleteRed: "#fb3d4c",
      // Additional gradient colors
      purple: {
        50: "#faf5ff",
        100: "#f3e8ff",
        200: "#e9d5ff",
      },
    },
    extend: {
      transitionProperty: {
        maxHeight: "max-height",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
