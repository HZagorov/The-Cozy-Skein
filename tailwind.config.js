/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cozy: {
          cream: '#FAF7F2',
          sand: '#F4EFE6',
          clay: '#E3D5C8',
          terracotta: '#C86446',
          'terracotta-dark': '#A84C30',
          'terracotta-light': '#FDF4F1',
          sage: '#718579',
          'sage-dark': '#55695D',
          'sage-light': '#F0F4F2',
          mustard: '#DE9B35',
          wool: '#3E3431',
          charcoal: '#241E1C',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(62, 52, 49, 0.08)',
        warm: '0 10px 30px -4px rgba(200, 100, 70, 0.12)',
      },
    },
  },
  plugins: [],
};
