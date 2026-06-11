export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        shimmerSharp: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" },
        },
      },
      animation: {
        shimmerSharp: "shimmerSharp 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}