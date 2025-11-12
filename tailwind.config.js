export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  extend: {
    
      borderRadius: {
        soft: "1.25rem",
      },
    },
  },
  plugins: [require("daisyui")],
};
