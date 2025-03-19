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
        primary: {
          teal: '#5F8375', // Dusty teal green reminiscent of 90s electronics
          beige: '#D9D3C3', // "Electronics beige" from old PCs and cameras
          charcoal: '#2E2E2E', // Soft black/dark charcoal
          mauve: '#8B6F88' // Dusty mauve/purple from 90s accent colors
        },
        secondary: {
          gray: '#767676', // Soft graphite gray
          sepia: '#A67B5B', // Muted brown with orange hint
          offWhite: '#F4F4F2' // Near-white with warmth
        }
      },
      fontFamily: {
        'sans': ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
        'pixel': ['var(--font-pixel)', 'monospace'],
        'ms-serif': ['var(--font-ms-serif)', 'serif'],
      },
    },
  },
  plugins: [],
}