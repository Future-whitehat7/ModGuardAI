/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '"Inter Tight"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: '#FAFAFA',
        ice: '#0A0A0A',
        frost: '#4D515A',
        accent: '#1F5BFF',
        pearl: '#F6F6F3',
      },
    },
  },
  plugins: [],
};
