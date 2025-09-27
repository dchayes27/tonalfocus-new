const remotePatterns = [];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (supabaseUrl) {
  try {
    const { protocol, hostname } = new URL(supabaseUrl);

    if (protocol && hostname) {
      remotePatterns.push({
        protocol: protocol.replace(':', ''),
        hostname,
      });
    }
  } catch (error) {
    console.warn('Invalid NEXT_PUBLIC_SUPABASE_URL provided:', error);
  }
}

const deviceSizes = [320, 480, 640, 768, 896, 1024, 1280, 1536];
const imageSizes = [32, 48, 64, 96, 128, 256, 384, 512];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns,
    deviceSizes,
    imageSizes,
  },
};

module.exports = nextConfig;
