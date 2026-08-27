/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Instrument Sans", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
};
