import { Token } from '@reservoir0x/reservoir-kit-ui'
import { useMarketplaceChain } from 'hooks'

interface Props {
  token: Token
}

const Frame: React.FC<Props> = ({ token }) => {
  const marketplaceChain = useMarketplaceChain()

  return (
    <>
      {/* Warpcast NFT Old Spec */}
      <meta
        property="eth:nft:collection"
        content={`Farcaster: ${token.token?.name}`}
      />
      <meta
        property="eth:nft:contract_address"
        content={`${token.token?.contract}`}
      />
      <meta
        property="eth:nft:creator_address"
        content="0xbc698ce1933afb2980d4a5a0f85fea1b02fbb1c9"
      />
      <meta
        property="eth:nft:schema"
        content={token.token?.kind?.toUpperCase()}
      />
      <meta property="eth:nft:media_url" content={token.token?.imageSmall} />
    </>
  )
}
