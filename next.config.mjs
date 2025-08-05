/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5224',
        pathname: '/uploads/students/**',
      },
      {
        protocol: 'http',
        hostname: 'kgf-hm-api.nexcorealliance.com',
        pathname: '/uploads/students/**',
      },
      {
        protocol: 'https',
        hostname: 'kgf-hm-api.nexcorealliance.com',
        pathname: '/uploads/students/**',
      },
    ],
  },
};

export default nextConfig;
