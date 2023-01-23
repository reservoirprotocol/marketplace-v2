import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'
import { getCssText } from '../stitches.config'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <style
            id="stitches"
            dangerouslySetInnerHTML={{ __html: getCssText() }}
          />
        </Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="nft, ethereum, protocol" />
        <link
          rel="shortcut icon"
          type="image/svg"
          href="/favicon.png"
        />
        <title>Fellowship / Marketplace</title>
        <meta
          name="description"
          content="Fellowship champions the future of photography. We present a new way to discover, collect and learn about photography by exhibiting NFTs from marquee estates, living artists and emerging talent."
        />
        <meta name="keywords" content="NFT, API, Protocol" />
        {/* Twitter */}
        {/* The optimal size is 1200 x 630 (1.91:1 ratio). */}
        {/* <meta name="twitter:image" content="Reservoir Market | Open Source NFT Marketplace" /> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Fellowship | Marketplace"
        />
        <meta
          name="twitter:description"
          content="favicon.png"
        />
        <meta name="twitter:site" content="@fellowshiptrust" />

        {/* OG - https://ogp.me/ */}
        {/* https://www.opengraph.xyz/ */}
        <meta
          name="og:title"
          content="Fellowship | Marketplace"
        />
        <meta property="og:type" content="website" />
        <meta property="og:determiner" content="the" />
        <meta property="og:locale" content="en" />
        <meta
          property="og:description"
          content="Fellowship champions the future of photography. We present a new way to discover, collect and learn about photography by exhibiting NFTs from marquee estates, living artists and emerging talent."
        />
        {/* The optimal size is 1200 x 630 (1.91:1 ratio). */}
        {/* <meta property="og:image" content={OG_IMAGE} /> */}
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="640" />
        <meta property="og:image:alt" content="Fellowship Market Banner" />

        {/* Reservoir Meta Tags: https://docs.reservoir.tools/docs/reservoir-meta-tags */}
        <meta property="reservoir:title" content="Fellowship Marketplace" />
        <meta property="reservoir:icon" content="/reservoir-source-icon.png" />
        <meta
          property="reservoir:token-url-mainnet"
          content="/collection/ethereum/${contract}/${tokenId}"
        />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
