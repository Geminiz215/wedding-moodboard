/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        'dusty-pink': '#E7B8C4',
        'dusty-pink-soft': 'rgba(231, 184, 196, 0.28)',
        'mauve': '#C98AA3',
        'mauve-deep': '#A8647F',
        'sage': '#6B6F52',
        'sage-soft': 'rgba(107, 111, 82, 0.14)',
        'sage-deep': '#4A4E38',
        'ivory': '#F7EEE8',
        'soft-white': '#FFF9F5',
        'ivory-elevated': '#FFF9F5',
        'ivory-warm': '#F1E4DC',
        'gold': '#D8C37B',
        'champagne-gold': '#D8C37B',
        'gold-muted': 'rgba(216, 195, 123, 0.48)',
        'burgundy': '#784653',
        'ink': '#493237',
        'ink-muted': '#784653',
        'muted-rose': '#9A7078',
      },
      fontFamily: {
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Montserrat"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        script: ['"Allura"', 'cursive'],
      },
      boxShadow: {
        'stationery': '0 6px 24px -10px rgba(73, 50, 55, 0.09), 0 16px 40px -18px rgba(73, 50, 55, 0.06)',
        'arch': '0 10px 32px -10px rgba(73, 50, 55, 0.12), 0 22px 54px -20px rgba(107, 111, 82, 0.1)',
        'dock': '0 10px 30px -5px rgba(73, 50, 55, 0.18)',
      },
    },
  },
};
