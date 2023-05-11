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
          href="https://ipfs.thirdwebcdn.com/ipfs/QmQTajuAUULwo1yagUzXCt8nv2gCu4tZRZRTM6YUo4vsQX/Add%20a%20heading%20(1200%20%C3%97%201200%20px).svg"
        />

        {/* aura meta tags */}
        <meta property="reservoir:title" content="Aura NFT Exchange" />
        <meta property="reservoir:icon" content="/aura-source-icon.png" />
        <meta
          property="reservoir:token-url-mainnet"
          content="https://hub.auraexchange.org/collection/ethereum/${contract}/${tokenId}"
        />
        <meta
          property="reservoir:token-url-goerli"
          content="https://hub.auraexchange.org/collection/goerli/${contract}/${tokenId}"
        />
        <meta
          property="reservoir:token-url-polygon"
          content="https://hub.auraexchange.org/collection/polygon/${contract}/${tokenId}"
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
