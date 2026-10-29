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
        'sage': '#61664C',
        'sage-soft': 'rgba(97, 102, 76, 0.12)',
        'sage-deep': '#464A35',
        'ivory': '#FAF6F0',
        'ivory-elevated': '#FFFDFB',
        'ivory-warm': '#F3ECE4',
        'gold': '#D4BA72',
        'gold-muted': 'rgba(212, 186, 114, 0.45)',
        'ink': '#3A272B',
        'ink-muted': '#644950',
        'muted-rose': '#9A7078',
      },
      fontFamily: {
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Montserrat"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        script: ['"Allura"', 'cursive'],
      },
      boxShadow: {
        'stationery': '0 4px 20px -8px rgba(58, 39, 43, 0.08), 0 12px 36px -16px rgba(58, 39, 43, 0.05)',
        'arch': '0 6px 24px -10px rgba(58, 39, 43, 0.1), 0 18px 48px -18px rgba(97, 102, 76, 0.08)',
        'dock': '0 10px 30px -5px rgba(58, 39, 43, 0.18)',
      }
    },
  },
};
