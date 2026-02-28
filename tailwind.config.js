/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: '#0C0A08',
        surface: '#141210',
        'surface-raised': '#1A1714',
        'input-bg': '#100E0C',
        border: '#1F1C18',
        'border-hover': '#2E2820',
        primary: '#F97316',
        'primary-dark': '#EA580C',
        'primary-light': '#FB923C',
        heading: '#FDF8F4',
        body: '#C4B8AC',
        muted: '#7A6E65',
        disabled: '#3D3530',
        danger: '#F43F5E',
        success: '#34D399',
        warning: '#FBBF24',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'btn': '10px',
        'modal': '20px',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
    },
  },
  plugins: [],
}
