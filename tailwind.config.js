/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      textShadow: { // custom key for plugin usage
        glow: '0 0 8px #facc15, 0 0 12px #facc15',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-glow': {
          textShadow: '0 0 8px #facc15, 0 0 12px #facc15',
        },
        '.text-glow-hover:hover': {
          textShadow: '0 0 8px #facc15, 0 0 12px #facc15',
        },
      });
    },
  ],
};
