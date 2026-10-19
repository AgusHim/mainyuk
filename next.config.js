/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BASE_URL: process.env.BASE_URL,
    BASE_API: process.env.BASE_API,
    AUTH_SECRET: process.env.AUTH_SECRET,
    WEBSOCKET_HOST: process.env.WEBSOCKET_HOST,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
