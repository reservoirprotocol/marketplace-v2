/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    transpilePackages: ['@reservoir0x/reservoir-kit-ui'],
  },
  headers: [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "frame-ancestors 'none'",
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
      ],
    },
  ],
}

export default nextConfig
