import {
  goerli,
  sepolia,
  polygonMumbai,
  baseGoerli,
  scrollTestnet,
  zoraTestnet,
  baseSepolia,
  Chain,
} from 'wagmi/chains'
import { Currency } from '@reservoir0x/reservoir-kit-ui'
import { reservoirChains, customChains } from '@reservoir0x/reservoir-sdk'
import { zeroAddress } from 'viem'
import usdcContracts from './usdcContracts'
import wrappedContracts from './wrappedContracts'

//CONFIGURABLE: The default export controls the supported chains for the marketplace. Removing
// or adding chains will result in adding more or less chains to the marketplace.
// They are an extension of the wagmi chain objects

export type ReservoirChain = Chain & {
  lightIconUrl: string
  darkIconUrl: string
  reservoirBaseUrl: string
  proxyApi?: string
  routePrefix: string
  apiKey?: string
  coingeckoId?: string
  collectionSetId?: string
  community?: string
  wssUrl?: string
  listingCurrencies?: Currency[]
  oracleBidsEnabled?: boolean
  checkPollingInterval?: number
}

const nativeCurrencyBase = {
  contract: zeroAddress,
  symbol: 'ETH',
  decimals: 18,
  coinGeckoId: 'ethereum',
}

const usdcCurrencyBase = {
  contract: '',
  symbol: 'USDC',
  decimals: 6,
  coinGeckoId: 'usd-coin',
}

export const DefaultChain: ReservoirChain = {
  ...sepolia,
  // Any url to display the logo of the chain in light mode
  lightIconUrl: '/icons/goerli-icon-dark.svg',
  // Any url to display the logo of the chain in dark mode
  darkIconUrl: '/icons/goerli-icon-light.svg',
  // The base url of the reservoir api, this is used in the app when
  // directly interacting with the reservoir indexer servers (in the api proxy for example)
  // or when prefetching server side rendered data
  reservoirBaseUrl: reservoirChains.sepolia.baseApiUrl,
  // Used on the client side portions of the marketplace that need an api key added
  // Prevents the api key from being leaked in the clientside requests
  // If you'd like to disable proxying you can just change the proxyApi to the reservoirBaseUrl
  // Doing so will omit the api key unless further changes are made
  proxyApi: '/api/reservoir/sepolia',
  // A prefix used in the asset specific routes on the app (tokens/collections)
  routePrefix: 'sepolia',
  // Coingecko id, used to convert the chain's native prices to usd. Can be found here:
  // https://www.coingecko.com/en/api/documentation#operations-coins-get_coins_list
  coingeckoId: 'ethereum',
  collectionSetId: process.env.NEXT_PUBLIC_SEPOLIA_COLLECTION_SET_ID,
  community: process.env.NEXT_PUBLIC_SEPOLIA_COMMUNITY,
  wssUrl: 'wss://ws-sepolia.reservoir.tools',
  checkPollingInterval: reservoirChains.sepolia.checkPollingInterval,
}

export default [
  DefaultChain,
  {
    ...goerli,
    lightIconUrl: '/icons/goerli-icon-dark.svg',
    darkIconUrl: '/icons/goerli-icon-light.svg',
    reservoirBaseUrl: reservoirChains.goerli.baseApiUrl,
    proxyApi: '/api/reservoir/goerli',
    routePrefix: 'goerli',
    coingeckoId: 'goerli-eth',
    collectionSetId: process.env.NEXT_PUBLIC_GOERLI_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_GOERLI_COMMUNITY,
    listingCurrencies: [
      nativeCurrencyBase,
      {
        ...usdcCurrencyBase,
        contract: usdcContracts[goerli.id],
      },
      {
        symbol: 'WETH',
        contract: wrappedContracts[goerli.id],
        decimals: 18,
        coinGeckoId: 'weth',
      },
    ],
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.goerli.checkPollingInterval,
  },
  {
    ...polygonMumbai,
    lightIconUrl: '/icons/polygon-icon-dark.svg',
    darkIconUrl: '/icons/polygon-icon-light.svg',
    reservoirBaseUrl: reservoirChains.mumbai.baseApiUrl,
    proxyApi: '/api/reservoir/mumbai',
    routePrefix: 'mumbai',
    coingeckoId: 'matic-network',
    collectionSetId: process.env.NEXT_PUBLIC_MUMBAI_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_MUMBAI_COMMUNITY,
    wssUrl: 'wss://ws-mumbai.reservoir.tools',
    listingCurrencies: [
      { ...nativeCurrencyBase, coinGeckoId: 'matic-network' },
      {
        ...usdcCurrencyBase,
        contract: usdcContracts[polygonMumbai.id],
      },
    ],
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.mumbai.checkPollingInterval,
  },
  {
    ...baseGoerli,
    lightIconUrl: '/icons/base-goerli-icon-dark.svg',
    darkIconUrl: '/icons/base-goerli-icon-light.svg',
    reservoirBaseUrl: reservoirChains.baseGoerli.baseApiUrl,
    proxyApi: '/api/reservoir/base-goerli',
    routePrefix: 'base-goerli',
    coingeckoId: 'ethereum',
    collectionSetId: process.env.NEXT_PUBLIC_BASE_GOERLI_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_BASE_GOERLI_COMMUNITY,
    checkPollingInterval: reservoirChains.baseGoerli.checkPollingInterval,
  },
  {
    ...baseSepolia,
    lightIconUrl: '/icons/base-goerli-icon-dark.svg',
    darkIconUrl: '/icons/base-goerli-icon-light.svg',
    reservoirBaseUrl: reservoirChains.baseSepolia.baseApiUrl,
    proxyApi: '/api/reservoir/base-sepolia',
    routePrefix: 'base-sepolia',
    coingeckoId: 'ethereum',
    checkPollingInterval: reservoirChains.baseSepolia.checkPollingInterval,
  },
  {
    ...scrollTestnet,
    lightIconUrl: '/icons/scroll-testnet-icon-dark.svg',
    darkIconUrl: '/icons/scroll-testnet-icon-light.svg',
    reservoirBaseUrl: reservoirChains.scrollTestnet.baseApiUrl,
    proxyApi: '/api/reservoir/scroll-alpha',
    routePrefix: 'scroll-alpha',
    coingeckoId: 'ethereum',
    collectionSetId: process.env.NEXT_PUBLIC_SCROLL_ALPHA_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_SCROLL_ALPHA_COMMUNITY,
    name: 'Scroll Alpha',
    checkPollingInterval: reservoirChains.scrollTestnet.checkPollingInterval,
  },
  {
    ...zoraTestnet,
    lightIconUrl: '/icons/zora-testnet-icon-dark.svg',
    darkIconUrl: '/icons/zora-testnet-icon-light.svg',
    reservoirBaseUrl: reservoirChains.zoraTestnet.baseApiUrl,
    proxyApi: '/api/reservoir/zora-testnet',
    routePrefix: 'zora-testnet',
    coingeckoId: 'ethereum',
    collectionSetId: process.env.NEXT_PUBLIC_ZORA_TESTNET_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_ZORA_TESTNET_COMMUNITY,
    checkPollingInterval: reservoirChains.zoraTestnet.checkPollingInterval,
  },
  {
    ...customChains.frameTestnet,
    lightIconUrl: '/icons/frame-testnet-icon-dark.svg',
    darkIconUrl: '/icons/frame-testnet-icon-light.svg',
    reservoirBaseUrl: reservoirChains.frameTestnet.baseApiUrl,
    proxyApi: '/api/reservoir/frametestnet',
    routePrefix: 'frame-testnet',
    coingeckoId: 'ethereum',
    collectionSetId: process.env.NEXT_PUBLIC_FRAME_TESTNET_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_FRAME_TESTNET_COMMUNITY,
    checkPollingInterval: reservoirChains.frameTestnet.checkPollingInterval,
  },
  {
    ...customChains.ancient8Testnet,
    lightIconUrl: '/icons/ancient8-icon-dark.svg',
    darkIconUrl: '/icons/ancient8-icon-light.svg',
    reservoirBaseUrl: reservoirChains.ancient8Testnet.baseApiUrl,
    proxyApi: '/api/reservoir/ancient8-testnet',
    routePrefix: 'ancient8-testnet',
    coingeckoId: 'ethereum',
    checkPollingInterval: reservoirChains.ancient8Testnet.checkPollingInterval,
  },
] as ReservoirChain[]
