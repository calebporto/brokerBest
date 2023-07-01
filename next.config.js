/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co'
      },
    ],
  },
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'no-referrer-when-downgrade',
          }
        ],
      },
      {
        source: '/entrar',
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'no-referrer-when-downgrade',
          }
        ],
      },
    ]
  }
}

module.exports = nextConfig
