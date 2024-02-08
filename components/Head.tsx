import { FC } from 'react'
import NextHead from 'next/head'
import { Token } from '@reservoir0x/reservoir-kit-ui'

type Props = {
  ogImage?: string
  title?: string
  description?: string
  token?: Token
}

/**
 * Renders the <head> section of the HTML page, including meta tags, title, and favicon.
 * @param ogImage - The URL of the Open Graph image to be displayed in social media shares.
 * @param title - The title of the page.
 * @param description - The description of the page.
 */
export const Head: FC<Props> = ({
  ogImage = 'https://explorer.reservoir.tools/og-image.png',
  title = 'Reservoir | Multi-Chain NF`T Explorer',
  description = 'Reservoir Multi-Chain NFT Explorer is an open source NFT explorer built with Reservoir.',
  token,
}) => {
  return (
    <NextHead>
      {/* CONFIGURABLE: You'll probably want to configure this all to have custom meta tags and title to fit your application */}
      {/* CONFIGURABLE: There are also keywords in pages/_document.ts that you can also configure to fit your application */}

      {/* Title */}
      <title>{title}</title>

      {/* Meta tags */}
      <meta name="description" content={description} />

      {/* Extra Metatas */}
      <>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={token?.token?.imageSmall} />
        <meta property="fc:frame:button:1" content="Mint" />
        <meta property="fc:frame:button:1:action" content="mint" />
        <meta
          property="fc:frame:button:1:target"
          content="eip155:7777777:0x2e92b5094c531257a9f427def7c05b412b9056bb:18"
        />
        <meta property="eth:nft:collection" content="taboo9" />
        <meta property="eth:nft:status" content="live" />
        <meta property="eth:nft:mint_count" content="1" />
        <meta
          property="eth:nft:creator_address"
          content="0xf90665f14eefda57144441743816f4740cc89722"
        />
        <meta
          property="eth:nft:contract_address"
          content="0x2e92b5094c531257a9f427def7c05b412b9056bb"
        />
        <meta property="eth:nft:schema" content="ERC1155" />
        <meta property="eth:nft:endtime" content="1709944871000" />
        <meta property="og:image" content={token?.token?.imageSmall} />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:button:1" content="View on Reservoir" />
        <meta property="fc:frame:button:1:action" content="post_redirect" />
        <meta
          property="fc:frame:post_url"
          content="https://explorer.reservoir.tools/"
        />
        <meta property="fc:frame:image" content={token?.token?.imageSmall} />
      </>
    </NextHead>
  )
}
