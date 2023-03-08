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
    ARBITRUM_RESERVOIR_API_BASE: process.env.ARBITRUM_RESERVOIR_API_BASE,
    NEXT_PUBLIC_ALCHEMY_OPTIMISM_ID: process.env.NEXT_PUBLIC_ALCHEMY_OPTIMISM_ID,
    NEXT_PUBLIC_ALCHEMY_ARBITRUM_ID: process.env.NEXT_PUBLIC_ALCHEMY_ARBITRUM_ID,
    NEXT_PUBLIC_HOST_URL: process.env.NEXT_PUBLIC_HOST_URL,
    NEXT_PUBLIC_FEE_RECIPIENT: process.env.NEXT_PUBLIC_FEE_RECIPIENT,
    NEXT_PUBLIC_FEE_BPS: process.env.NEXT_PUBLIC_FEE_BPS,
    LAUNCHPAD_SIGNER_ADDRESS: process.env.LAUNCHPAD_SIGNER_ADDRESS
  }
}

export default nextConfig
