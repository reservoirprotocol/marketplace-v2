import {
  sepolia,
  polygonAmoy,
  scrollTestnet,
  zoraTestnet,
  baseSepolia,
  berachainTestnet,
  Chain,
} from 'wagmi/chains'
import { Currency } from '@reservoir0x/reservoir-kit-ui'
import { reservoirChains, customChains } from '@reservoir0x/reservoir-sdk'
import { zeroAddress } from 'viem'
import usdcContracts from './usdcContracts'

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
    ...polygonAmoy,
    lightIconUrl: '/icons/polygon-icon-dark.svg',
    darkIconUrl: '/icons/polygon-icon-light.svg',
    reservoirBaseUrl: reservoirChains.polygonAmoy.baseApiUrl,
    proxyApi: '/api/reservoir/polygon-amoy',
    routePrefix: 'polygon-amoy',
    coingeckoId: 'matic-network',
    wssUrl: 'wss://ws-amoy.reservoir.tools',
    listingCurrencies: [
      { ...nativeCurrencyBase, symbol: 'MATIC', coinGeckoId: 'matic-network' },
    ],
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.polygonAmoy.checkPollingInterval,
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
  {
    ...customChains.blastSepolia,
    lightIconUrl: '/icons/blast-sepolia-icon-light.svg',
    darkIconUrl: '/icons/blast-sepolia-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.blastSepolia.baseApiUrl,
    proxyApi: '/api/reservoir/blast-sepolia',
    routePrefix: 'blast-sepolia',
    coingeckoId: 'ethereum',
    checkPollingInterval: reservoirChains.blastSepolia.checkPollingInterval,
  },
  {
    ...customChains.apexPopTestnet,
    lightIconUrl: '/icons/apex-pop-icon-light.svg',
    darkIconUrl: '/icons/apex-pop-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.apexPopTestnet.baseApiUrl,
    proxyApi: '/api/reservoir/apex-pop-testnet',
    routePrefix: 'apex-pop-testnet',
    coingeckoId: 'ethereum',
    checkPollingInterval: reservoirChains.apexPop.checkPollingInterval,
  },
  {
    ...customChains.astarZkEVM,
    name: 'Astar ZkEVM',
    lightIconUrl: '/icons/astar-zkevm-icon-light.svg',
    darkIconUrl: '/icons/astar-zkevm-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.astarZkEVM.baseApiUrl,
    proxyApi: '/api/reservoir/astar-zkevm',
    routePrefix: 'astar-zkevm',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    collectionSetId: process.env.NEXT_PUBLIC_ASTAR_ZKEVM_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_ASTAR_ZKEVM_COMMUNITY,
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.astarZkEVM.checkPollingInterval,
  },
  {
    ...customChains.garnet,
    name: 'Garnet',
    lightIconUrl: '/icons/redstone-icon-light.svg',
    darkIconUrl: '/icons/redstone-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.garnet.baseApiUrl,
    proxyApi: '/api/reservoir/garnet',
    routePrefix: 'garnet',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.garnet.checkPollingInterval,
  },
  {
    ...berachainTestnet,
    name: 'Berachain Testnet',
    lightIconUrl: '/icons/berachain-testnet-icon-light.svg',
    darkIconUrl: '/icons/berachain-testnet-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.berachainTestnet.baseApiUrl,
    proxyApi: '/api/reservoir/berachain-testnet',
    routePrefix: 'berachain-testnet',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.berachainTestnet.checkPollingInterval,
  },
  {
    ...customChains.seiTestnet,
    name: 'Sei Testnet',
    lightIconUrl: '/icons/sei-testnet-icon-light.svg',
    darkIconUrl: '/icons/sei-testnet-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.seiTestnet.baseApiUrl,
    proxyApi: '/api/reservoir/sei-testnet',
    routePrefix: 'sei-testnet',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'sei-network',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.seiTestnet.checkPollingInterval,
  },
] as ReservoirChain[]
