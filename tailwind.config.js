/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "white-color": "#fff",
        "black-color": "#000",
        "primary-color": "#4169E1",
        "secondary-color": "#2E4BA0",
        "tertiary-color": "#1B2C5F",
        "quartenary-color": "#1B2C5F",
        "primary-accent-color": "#777777",
        "secondary-accent-color": "#5C5C5C",
        "tertiary-accent-color": "#E4E4E4",
        "card-bg": "#F8F8F8",
        "onboard-bg": " #ECF0FC",
        "border-color": "#D7D7D7",
        "screen-bg": "#F6F6F6",
        "high-priority": "#F35555",
        "medium-priority": "#FF6026",
        "low-priority": "#9DD382",
        "form-text-color": "#B9B9B9",
        "tomato-red": "#F35555",
        orange: "#FFA500",
      },
    },
  },
  plugins: [],
};
