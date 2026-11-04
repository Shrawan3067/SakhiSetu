/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#174C3C',
          deep: '#103A30',
          sage: '#A8BDA8',
          bg: '#FAF9F5',
          surface: '#FFFFFF',
          text: '#202923',
          muted: '#727B74',
          terracotta: '#C77B59',
          'terracotta-dark': '#B06544',
          'sage-light': '#EBF1EB',
          'border': '#E5E4DE',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Noto Sans Devanagari', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
      },
      borderRadius: {
        'card': '14px',
        'btn': '8px',
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(23, 76, 60, 0.06), 0 4px 16px -4px rgba(23, 76, 60, 0.08)',
        'elevated': '0 8px 24px -6px rgba(23, 76, 60, 0.12), 0 16px 32px -8px rgba(23, 76, 60, 0.08)',
      },
    },
  },
  plugins: [],
}
