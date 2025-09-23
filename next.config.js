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

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns,
  },
};

module.exports = nextConfig;
