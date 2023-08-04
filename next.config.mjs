import { withSentryConfig } from '@sentry/nextjs'
import * as tsImport from 'ts-import'
import path from 'path'

const importFallback = async (relativePath) => {
  const cwd = process.cwd()
  const cachePath = path.join(cwd, `.cache`, `ts-import`, cwd.replace('C:', ''))
  let url = ''
  let file = relativePath.replace('.ts', '.mjs')
  if (process.platform === `win32`) {
    url = `${cachePath}/${file}`
  } else {
    url = `${cachePath}/${file}`
  }
  return import(url)
}

const loadTS = (filePath) => {
  try {
    return tsImport.load(filePath)
  } catch (e) {
    return importFallback(filePath)
  }
}

const { DefaultChain: defaultChain } = await loadTS('./utils/chains.ts')

const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: 'javascript-nextjs',
  silent: true,
}

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  sentry: {
    hideSourceMaps: false,
  },
  experimental: {
    transpilePackages: ['@reservoir0x/reservoir-kit-ui'],
  },
  async rewrites() {
    return [
      {
        source: '/:chain/asset/:assetId/buy',
        destination: '/:chain/asset/:assetId',
      },
      {
        source: '/:chain/collection/:contract/sweep',
        destination: '/:chain/collection/:contract',
      },
      {
        source: '/:chain/collection/:contract/mint',
        destination: '/:chain/collection/:contract',
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: `/${defaultChain.routePrefix}`,
        permanent: false,
      },

      {
        source: '/collection/:chain/:collection',
        destination: '/:chain/collection/:collection',
        permanent: true,
      },
      {
        source: '/collection/:chain/:collection/:tokenId',
        destination: '/:chain/asset/:collection%3A:tokenId',
        permanent: true,
      },
      {
        source: '/collection-rankings',
        destination: `/${defaultChain.routePrefix}/collection-rankings`,
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
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
    ]
  },
}

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions)
