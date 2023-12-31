/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'scontent-cgk1-2.cdninstagram.com',
            port: '',
          },
        ],
      },
}

module.exports = nextConfig
