/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/student',          // ensures all routes start with /student
  assetPrefix: '/student/',      // ensures JS/CSS assets load correctly
  trailingSlash: true,           // helps when serving from a subdirectory

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
