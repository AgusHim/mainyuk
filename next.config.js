/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      BASE_API: process.env.BASE_API,
      AUTH_SECRET: process.env.AUTH_SECRET
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '*.cdninstagram.com',
            port: '',
          },
        ],
      },
}

module.exports = nextConfig
