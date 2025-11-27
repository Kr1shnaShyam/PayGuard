// tailwind.config.cjs
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        neutral: colors.neutral,
        slate: colors.slate,
        zinc: colors.zinc
      }
    }
  },
  plugins: []
};
