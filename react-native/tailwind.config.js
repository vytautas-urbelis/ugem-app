/** @type {import('tailwindcss').Config} */

const colors = require("./colors");

module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", // Correctly reference the files in the app directory
    "./components/**/*.{js,jsx,ts,tsx}", // Include a common components directory
    "./App.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      // colors: {
      //   // Create a custom color that uses a CSS custom value
      //   primary: "rgb(var(--color-primary) / <alpha-value>)",
      //   primarytext: "rgb(var(--color-primarytext) / <alpha-value>)",
      //   secondary: "rgb(var(--color-secondary) / <alpha-value>)",
      //   background: "rgb(var(--color-background) / <alpha-value>)",
      //   tablebackground: "rgb(var(--color-tablebackground) / <alpha-value>)",
      //   blackbackground: "rgb(var(--color-blackbackground) / <alpha-value>)",
      //   normaltext: "rgb(var(--color-normaltext) / <alpha-value>)",
      //   secondtext: "rgb(var(--color-secondtext) / <alpha-value>)",
      //   linktext: "rgb(var(--color-linktext) / <alpha-value>)",
      //   whitetext: "rgb(var(--color-whitetext) / <alpha-value>)",
      //   whitesecondtext: "rgb(var(--color-whitesecondtext) / <alpha-value>)",
      //   activeborder: "rgb(var(--color-activeborder) / <alpha-value>)",
      //   pasiveborder: "rgb(var(--color-pasiveborder) / <alpha-value>)",
      // },
    },
  },
  plugins: [
    // Set a default value on the `:root` element
    ({ addBase }) => addBase({ ":root": { "--color-primary": "20, 184, 166" } }), // Teal 500
    ({ addBase }) => addBase({ ":root": { "--color-primarytext": "20, 184, 166" } }), // Teal 500
    ({ addBase }) => addBase({ ":root": { "--color-secondary": "94, 234, 212" } }), // Teal 300
    ({ addBase }) => addBase({ ":root": { "--color-background": "249, 249, 249" } }), //
    ({ addBase }) => addBase({ ":root": { "--color-tablebackground": "255 255 255" } }), //
    ({ addBase }) => addBase({ ":root": { "--color-blackbackground": "4, 47, 46" } }), // Teal 950
    ({ addBase }) => addBase({ ":root": { "--color-normaltext": "17, 94, 89" } }), // Teal 800
    ({ addBase }) => addBase({ ":root": { "--color-secondtext": "13, 148, 136" } }), // Teal 600
    ({ addBase }) => addBase({ ":root": { "--color-linktext": "13, 148, 136" } }), // Teal 600
    ({ addBase }) => addBase({ ":root": { "--color-whitetext": "240, 253, 250" } }), // Teal 50
    ({ addBase }) => addBase({ ":root": { "--color-whitesecondtext": "110, 231, 183" } }), // Teal 300
    ({ addBase }) => addBase({ ":root": { "--color-activeborder": "13, 148, 136" } }), // Teal 600
    ({ addBase }) => addBase({ ":root": { "--color-pasiveborder": "94, 234, 212" } }), // Teal 300


  ],
};
