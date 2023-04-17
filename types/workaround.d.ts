//TO-DO: using .generate graphql later when enough field
export type Token = {
  id: string
  tokenID: any
  tokenURI?: string | null
  owner?: {
    id: string
  }
  collection: {
    id: string
    name: string
    totalTokens: number
    // TO-DO: update later
    floorAskPrice?: any
    banner?: any
    description?: any
    openseaVerificationStatus?: any
    image?: any
  }
  ownership?: any
  topBid?: any
  kind?: any
  attributes?: any
  name?: any
  image?: any
  isInCart?: any
  kind?: any
  market?: any
  isFlagged?: any
  rarityRank?: any
  lastSale?: any
}

export type Collection = {
  id: string
  name: string
  totalTokens: number
  // TO-DO: update later
  floorAskPrice?: any
  banner?: any
  description?: any
  openseaVerificationStatus?: any
  twitterUsername?: any
  image?: any
  discordUrl?: any
  externalUrl?: any
  royalties?: any

  volume?: any
  volumeChange?: any
  topBidValue?: any
  floorAskPrice?: any
}
