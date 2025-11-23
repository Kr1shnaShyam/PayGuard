// tailwind.config.cjs
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // restore the neutral palette so your classes like bg-neutral-900 work
        neutral: colors.neutral,
        // add any other palettes you commonly use
        slate: colors.slate,
        zinc: colors.zinc
      }
    },
  },
  plugins: [],
}
