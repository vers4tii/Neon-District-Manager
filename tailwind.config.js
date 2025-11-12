/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#050a30",
        building: "#301934",
        neon: "#c42b9a",
        energy: "#14fff7",
      },
      fontFamily: {
        mono: ["Share Tech Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
