/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sukoon: {
          deep: '#030407',
          midnight: '#071426',
          electric: '#168BFF',
          glow: '#39A9FF',
          pure: '#FFFFFF',
          card: 'rgba(7, 20, 38, 0.65)',
          border: 'rgba(57, 169, 255, 0.18)',
          subtle: 'rgba(255, 255, 255, 0.65)',
        },
      },
      fontFamily: {
        arabic: ['Amiri', 'Traditional Arabic', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 35px -5px rgba(22, 139, 255, 0.35)',
        'glow-lg': '0 0 65px -10px rgba(57, 169, 255, 0.45)',
        'glow-ambient': '0 0 100px -20px rgba(22, 139, 255, 0.25)',
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
