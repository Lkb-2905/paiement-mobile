/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#0B1220',
          700: '#141C2F',
          500: '#1E2A44',
          300: '#3A4B72',
          100: '#E8EEFB',
        },
        accent: {
          500: '#F5B400',
          400: '#FFCA2C',
        },
        success: '#22C55E',
        danger: '#EF4444',
        muted: '#94A3B8',
      },
    },
  },
  plugins: [],
};
