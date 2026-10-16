/** @type {import('tailwindcss').Config} */
// Brand tokens retained through the explicit @config import in index.css.
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          900: '#111827',
        },
        // Dan Mercede brand copper (logo pack). Single accent on the otherwise
        // monochrome page: primary CTA, section markers, link hovers.
        copper: {
          light: '#FFC08B',
          DEFAULT: '#E68249',
          dark: '#B95122',
          deep: '#993F17',
        },
      },
    },
  },
  plugins: [],
};
