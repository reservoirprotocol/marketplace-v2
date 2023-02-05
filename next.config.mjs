/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    transpilePackages: ['@nftearth/reservoir-kit-ui'],
    largePageDataBytes: 800 * 1000,
  },
  env: {
    OPTIMISM_RESERVOIR_API_BASE: process.env.OPTIMISM_RESERVOIR_API_BASE
  }
}

export default nextConfig
