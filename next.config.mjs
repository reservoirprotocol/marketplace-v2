/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    transpilePackages: ['@nftearth/reservoir-kit-ui'],
    largePageDataBytes: 800 * 1000,
  },
  env: {
    OPTIMISM_RESERVOIR_API_BASE: process.env.OPTIMISM_RESERVOIR_API_BASE,
    NEXT_PUBLIC_ALCHEMY_ID: process.env.NEXT_PUBLIC_ALCHEMY_ID
  }
}

export default nextConfig
