export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  extend: {
    fontFamily: {
      cormorant: ["Cormorant", "serif"],
      tempting: ["Tempting", "cursive"],
    },
      colors: {
        softPurple: "#cbb2fe",
        softPink: "#f8c8dc",
        softYellow: "#ffeebc",
        softBg: "#fdfcff",
      },
      borderRadius: {
        soft: "1.25rem",
      },
    },
  },
  plugins: [require("daisyui")],
};
