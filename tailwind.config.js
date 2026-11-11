/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sukoon: {
          deep: '#030712', // black #030712
          midnight: '#0f172a',
          electric: '#2563eb', // electric blue #2563eb
          glow: '#38bdf8', // electric/sky blue #38bdf8
          pure: '#ffffff', // white #ffffff
          card: 'rgba(15, 23, 42, 0.7)',
          border: 'rgba(56, 189, 248, 0.2)',
          subtle: 'rgba(255, 255, 255, 0.7)',
        },
      },
      fontFamily: {
        arabic: ['Amiri', 'Traditional Arabic', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 35px -5px rgba(37, 99, 235, 0.35)',
        'glow-lg': '0 0 65px -10px rgba(56, 189, 248, 0.45)',
        'glow-ambient': '0 0 100px -20px rgba(37, 99, 235, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'ripple-out': 'rippleOut 1s cubic-bezier(0, 0.2, 0.8, 1) forwards',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        rippleOut: {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
