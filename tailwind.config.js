/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17201c',
        moss: {
          50: '#f2f8f4',
          100: '#e1f0e5',
          200: '#c5e1cc',
          300: '#9bc8a8',
          400: '#6dab7d',
          500: '#478e5d',
          600: '#357348',
          700: '#2c5b3b',
          800: '#274932',
          900: '#213d2b',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 24, 40, 0.04), 0 12px 32px rgba(16, 24, 40, 0.06)',
      },
    },
  },
  plugins: [],
}
