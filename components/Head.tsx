import { FC } from 'react'
import NextHead from 'next/head'

type Props = {
  ogImage?: string
  title?: string
  description?: string
}

/**
 * Renders the <head> section of the HTML page, including meta tags, title, and favicon.
 * @param ogImage - The URL of the Open Graph image to be displayed in social media shares.
 * @param title - The title of the page.
 * @param description - The description of the page.
 */
export const Head: FC<Props> = ({
  ogImage = 'https://marketplace.reservoir.tools/og-image.png',
  title = 'Reservoir Market | Open Source NFT Marketplace',
  description = 'Reservoir Market is an open source NFT marketplace built with Reservoir.',
}) => {
  return (
    <NextHead>
      {/* CONFIGURABLE: You'll probably want to configure this all to have custom meta tags and title to fit your application */}

      {/* Meta tags */}
      <meta name="keywords" content="nft, ethereum, protocol" />
      <meta name="description" content={description} />
      <meta name="keywords" content="NFT, API, Protocol" />

      {/* Favicon */}
      <link
        rel="shortcut icon"
        type="image/svg"
        href="https://marketplace.reservoir.tools/reservoir.svg"
      />

      {/* Title */}
      <title>{title}</title>

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@reservoir0x" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:determiner" content="the" />
      <meta property="og:locale" content="en" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Reservoir Market Banner" />

      {/* Reservoir meta tags */}
      <meta property="reservoir:title" content="Reservoir Market" />
      <meta
        property="reservoir:icon"
        content="public/reservoir-source-icon.png"
      />
      <meta
        property="reservoir:token-url-mainnet"
        content="/collection/ethereum/${contract}/${tokenId}"
      />
      <meta
        property="reservoir:token-url-goerli"
        content="/collection/goerli/${contract}/${tokenId}"
      />
      <meta
        property="reservoir:token-url-polygon"
        content="/collection/polygon/${contract}/${tokenId}"
      />
    </NextHead>
  )
}
