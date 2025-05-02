/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      's3.us-west-2.amazonaws.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com',
      'secure.notion-static.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.notion-static.com',
      },
    ],
  },
}

module.exports = nextConfig 