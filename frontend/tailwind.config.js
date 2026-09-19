/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#635BFF',
        secondary: '#10B981',
        accent: '#8B5CF6',
      },
    },
  },
  plugins: [],
}
