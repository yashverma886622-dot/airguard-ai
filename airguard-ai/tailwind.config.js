/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#10201d',
        mist: '#e8f2ef',
        sea: '#0f766e',
        sun: '#eab308',
        ember: '#dc2626',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 118, 110, 0.14)',
      },
      animation: {
        'fade-up': 'fadeUp 450ms ease both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
