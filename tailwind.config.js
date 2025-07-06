/**
 * @file tailwind.config.js
 * @description Configuration file for Tailwind CSS.
 * This file is used to customize various aspects of Tailwind CSS, including the content paths,
 * theme (colors, fonts, spacing, etc.), and plugins.
 * @see {@link https://tailwindcss.com/docs/configuration}
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  /**
   * `content` array specifies the files Tailwind CSS should scan to find utility classes.
   * This ensures that only the CSS that is actually used in your project is generated,
   * keeping the final CSS bundle size optimized.
   * It includes paths to pages, components, and app directory files using various extensions.
   */
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // For projects using the 'pages' directory.
    './src/components/**/*.{js,ts,jsx,tsx,mdx}', // All components.
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // For projects using the 'app' directory (Next.js 13+).
  ],

  /**
   * `theme` object is where you define your project's design system.
   * You can customize or extend Tailwind's default theme here.
   * @see {@link https://tailwindcss.com/docs/theme}
   */
  theme: {
    /**
     * `extend` allows you to add new values to the default theme or override existing ones
     * without losing the default Tailwind utility classes.
     */
    extend: {
      /**
       * `colors` defines the custom color palette for the project.
       * These colors can then be used with Tailwind's color utility classes (e.g., `bg-primary-teal`, `text-secondary-gray`).
       * The naming convention (e.g., `primary`, `secondary`) helps organize the palette.
       * Descriptions indicate the intended aesthetic (e.g., 90s electronics).
       */
      colors: {
        primary: {
          teal: '#5F8375',     // A dusty, muted teal green, reminiscent of 90s electronics or aged copper.
          beige: '#D9D3C3',    // Classic "electronics beige," like old computer casings or vintage camera bodies.
          charcoal: '#2E2E2E', // A soft, deep black or very dark charcoal, for strong contrasts and text.
          mauve: '#8B6F88'     // A dusty mauve or muted purple, often used as an accent color in 90s design.
        },
        secondary: {
          gray: '#767676',     // A neutral, soft graphite gray for secondary text or UI elements.
          sepia: '#A67B5B',    // A muted brown with an orange/yellow hint, evoking a sepia photographic tone.
          offWhite: '#F4F4F2'  // A very light, near-white color with a slight warmth, for backgrounds.
        }
      },
      /**
       * `fontFamily` defines custom font stacks.
       * These can then be applied using font utility classes (e.g., `font-sans`, `font-pixel`).
       * They are defined using CSS variables (e.g., `var(--font-inter)`) which are expected
       * to be set up elsewhere in the project (typically in a global CSS file or layout component
       * using `next/font`).
       */
      fontFamily: {
        'sans': ['var(--font-inter)', 'ui-sans-serif', 'system-ui'], // Default sans-serif font stack.
        'pixel': ['var(--font-pixel)', 'monospace'],                 // Monospace font, potentially for a retro/pixelated look.
        'ms-serif': ['var(--font-ms-serif)', 'serif'],               // A specific serif font, possibly for headings or display text.
      },
      // Other theme extensions like spacing, breakpoints, etc., can be added here.
      // Example:
      // spacing: {
      //   '128': '32rem',
      // }
    },
  },

  /**
   * `plugins` array allows you to register Tailwind CSS plugins.
   * Plugins can add new utility classes, components, or variants.
   * @see {@link https://tailwindcss.com/docs/plugins}
   * Example: require('@tailwindcss/typography'), require('@tailwindcss/forms')
   */
  plugins: [
    // Add any Tailwind CSS plugins here.
    // For example, to add official plugins:
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/aspect-ratio'),
  ],
}