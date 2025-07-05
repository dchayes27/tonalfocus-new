/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kuloobkorumijihuairs.supabase.co',
      },
      // Add other hostnames here if needed in the future
      // Example:
      // {
      //   protocol: 'https',
      //   hostname: 'another-image-cdn.com',
      // },
    ],
  },
};

module.exports = nextConfig;