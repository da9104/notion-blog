/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      's3.us-west-2.amazonaws.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com',
      'secure.notion-static.com',
      'icn1.alicdn.com',
      'images.unsplash.com'
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
      {
        protocol: 'https',
        hostname: 'icn1.alicdn.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {    //media.giphy.com
        protocol: 'https',
        hostname: 'media.giphy.com',
      },
    ],
  },
  serverExternalPackages: ['@notionhq/client']
}

module.exports = nextConfig 