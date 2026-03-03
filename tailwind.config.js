/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        surface: '#18181b',
        primary: 'var(--color-primary)',
        alert: 'var(--color-alert)',
        border: '#27272a',
      },
      fontFamily: {
        mono: ['Consolas', 'Monaco', 'monospace'],
      },
      letterSpacing: {
        widest: '.25em',
      }
    },
  },
  plugins: [],
}