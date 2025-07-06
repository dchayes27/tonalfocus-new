/**
 * @file next.config.js
 * @description Configuration file for Next.js.
 * This file allows customization of Next.js behavior, such as enabling strict mode,
 * configuring image optimization, setting up redirects, and more.
 * @see {@link https://nextjs.org/docs/api-reference/next.config.js/introduction}
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * React Strict Mode.
   * @see {@link https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode}
   * When true, React Strict Mode is enabled for the application.
   * This helps highlight potential problems in an application by running checks and warnings
   * in development mode. It does not affect the production build.
   */
  reactStrictMode: true,

  /**
   * Next.js Image Optimization Configuration.
   * @see {@link https://nextjs.org/docs/api-reference/next/image#remote-patterns}
   * This section configures the built-in Image Optimization API.
   * `remotePatterns` is used to specify a list of URL patterns from which Next.js
   * can optimize images. This is a security measure to prevent arbitrary image URLs
   * from being processed.
   */
  images: {
    remotePatterns: [
      {
        // Configuration for allowing images from a Supabase storage bucket.
        protocol: 'https', // The protocol of the remote image URLs (http or https).
        hostname: 'kuloobkorumijihuairs.supabase.co', // The hostname of the Supabase storage.
        // port: '', // Optionally, specify a port if non-standard.
        // pathname: '/bucket-name/**', // Optionally, specify a path prefix if images are in a specific path.
      },
      // Example for adding another allowed image source:
      // {
      //   protocol: 'https',
      //   hostname: 'images.unsplash.com',
      // },
    ],
  },
  // Other Next.js configurations can be added here as needed.
  // For example:
  // env: {
  //   MY_CUSTOM_ENV_VARIABLE: 'value',
  // },
  // async redirects() {
  //   return [
  //     {
  //       source: '/old-path',
  //       destination: '/new-path',
  //       permanent: true,
  //     },
  //   ];
  // },
};

module.exports = nextConfig;