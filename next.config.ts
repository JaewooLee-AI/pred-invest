import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse'],
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
}

export default nextConfig
