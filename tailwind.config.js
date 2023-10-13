/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  variants: {
    extend: {
      margin: ["first", "responsive"], // Добавляем новую вариацию для отступов
    },
  },
}

