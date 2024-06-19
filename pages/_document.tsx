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

        {/* Meta tags */}
        <meta name="keywords" content="nft, ethereum, protocol" />
        <meta name="keywords" content="NFT, API, Protocol" />

        {/* Favicon */}
        <link
          rel="shortcut icon"
          type="image/svg"
          href="https://marketplace.reservoir.tools/reservoir.svg"
        />

        {/* Reservoir meta tags */}
        <meta property="reservoir:title" content="Reservoir NFT Explorer" />
        <meta property="reservoir:icon" content="/reservoir-source-icon.png" />
        <meta
          property="reservoir:token-url-goerli"
          content="/goerli/asset/${contract}:${tokenId}"
        />
        <meta
          property="reservoir:token-url-sepolia"
          content="/sepolia/asset/${contract}:${tokenId}"
        />
        <meta
          property="reservoir:token-url-mumbai"
          content="/mumbai/asset/${contract}:${tokenId}"
        />
        <meta
          property="reservoir:token-url-base-goerli"
          content="/base-goerli/asset/${contract}:${tokenId}"
        />
        <meta
          property="reservoir:token-url-scroll-alpha"
          content="/scroll-alpha/asset/${contract}:${tokenId}"
        />
        <meta
          property="reservoir:zora-testnet"
          content="/zora-testnet/asset/${contract}:${tokenId}"
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
