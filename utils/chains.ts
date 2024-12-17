import {
  sepolia,
  polygonAmoy,
  zoraTestnet,
  baseSepolia,
  Chain,
  berachainTestnet,
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
  seaportV15?: boolean
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
    seaportV15: true,
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
    seaportV15: true,
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
    seaportV15: true,
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
    seaportV15: true,
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
    seaportV15: true,
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
    seaportV15: true,
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
    seaportV15: true,
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
  {
    ...customChains.b3Testnet,
    name: 'B3 Testnet',
    lightIconUrl: '/icons/b3-testnet-icon-light.svg',
    darkIconUrl: '/icons/b3-testnet-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.b3Testnet.baseApiUrl,
    proxyApi: '/api/reservoir/b3-testnet',
    routePrefix: 'b3-testnet',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.b3Testnet.checkPollingInterval,
  },
  {
    ...customChains.flowPreviewnet,
    name: 'Flow Previewnet',
    lightIconUrl: '/icons/flow-previewnet-icon-light.svg',
    darkIconUrl: '/icons/flow-previewnet-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.flowPreviewnet.baseApiUrl,
    proxyApi: '/api/reservoir/flow-previewnet',
    routePrefix: 'flow-previewnet',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'flow',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.flowPreviewnet.checkPollingInterval,
  },
  {
    ...customChains.cloud,
    name: 'Cloud',
    lightIconUrl: '/icons/cloud-icon-light.svg',
    darkIconUrl: '/icons/cloud-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.cloud.baseApiUrl,
    proxyApi: '/api/reservoir/cloud',
    routePrefix: 'cloud',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.cloud.checkPollingInterval,
  },
  {
    ...customChains.game7Testnet,
    name: 'Game7 Testnet',
    lightIconUrl: '/icons/game7-testnet-icon-light.svg',
    darkIconUrl: '/icons/game7-testnet-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.game7Testnet.baseApiUrl,
    proxyApi: '/api/reservoir/game7-testnet',
    routePrefix: 'game7-testnet',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'game7',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.game7Testnet.checkPollingInterval,
  },
  {
    ...customChains.formaSketchpad,
    name: 'Forma Sketchpad',
    lightIconUrl: '/icons/forma-icon-light.svg',
    darkIconUrl: '/icons/forma-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.formaSketchpad.baseApiUrl,
    proxyApi: '/api/reservoir/forma-sketchpad',
    routePrefix: 'forma-sketchpad',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'celestia',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.formaSketchpad.checkPollingInterval,
  },
  {
    ...customChains.curtis,
    name: 'Curtis',
    lightIconUrl: '/icons/apechain-icon-light.svg',
    darkIconUrl: '/icons/apechain-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.curtis.baseApiUrl,
    proxyApi: '/api/reservoir/curtis',
    routePrefix: 'curtis',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'apecoin',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.curtis.checkPollingInterval,
  },
  {
    ...customChains.shapeSepolia,
    name: 'Shape Sepolia',
    lightIconUrl: '/icons/shape-icon-light.svg',
    darkIconUrl: '/icons/shape-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.shapeSepolia.baseApiUrl,
    proxyApi: '/api/reservoir/shape-sepolia',
    routePrefix: 'shapeSepolia',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.shapeSepolia.checkPollingInterval,
  },
  {
    ...customChains.abstractTestnet,
    name: 'Abstract Testnet',
    lightIconUrl: '/icons/abstract-testnet-icon-light.svg',
    darkIconUrl: '/icons/abstract-testnet-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.abstractTestnet.baseApiUrl,
    proxyApi: '/api/reservoir/abstract-testnet',
    routePrefix: 'abstractTestnet',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.abstractTestnet.checkPollingInterval,
  },
  {
    ...customChains.minato,
    name: 'Minato',
    lightIconUrl: '/icons/minato-icon-light.svg',
    darkIconUrl: '/icons/minato-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.minato.baseApiUrl,
    proxyApi: '/api/reservoir/minato',
    routePrefix: 'minato',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.minato.checkPollingInterval,
  },
  {
    ...customChains.hychainTestnet,
    name: 'Hychain Testnet',
    lightIconUrl: '/icons/hychain-icon-light.svg',
    darkIconUrl: '/icons/hychain-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.hychainTestnet.baseApiUrl,
    proxyApi: '/api/reservoir/hychain-testnet',
    routePrefix: 'hychainTestnet',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'hytopia',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.hychainTestnet.checkPollingInterval,
  },
  {
    ...customChains.zeroTestnet,
    name: 'Zero Testnet',
    lightIconUrl: '/icons/zero-icon-light.svg',
    darkIconUrl: '/icons/zero-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.zeroTestnet.baseApiUrl,
    proxyApi: '/api/reservoir/zero-testnet',
    routePrefix: 'zeroTestnet',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.zeroTestnet.checkPollingInterval,
  },
  {
    ...customChains.animeTestnet,
    name: 'Anime Testnet',
    lightIconUrl: '/icons/anime-icon-light.svg',
    darkIconUrl: '/icons/anime-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.animeTestnet.baseApiUrl,
    proxyApi: '/api/reservoir/anime-testnet',
    routePrefix: 'animeTestnet',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.animeTestnet.checkPollingInterval,
  },
  {
    ...customChains.monadDevnet,
    name: 'Monad Devnet',
    lightIconUrl: '/icons/monad-icon-light.svg',
    darkIconUrl: '/icons/monad-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.monadDevnet.baseApiUrl,
    proxyApi: '/api/reservoir/monad-devnet',
    routePrefix: 'monadDevnet',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'monad',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.monadDevnet.checkPollingInterval,
  },
  {
    id: 4654,
    name: 'Creator Testnet',
    network: 'creator-testnet',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://rpc.creator.xyz'] },
      public: { http: ['https://rpc.creator.xyz'] },
    },
    blockExplorers: {
      default: {
        name: 'Creator Testnet Explorer',
        url: 'https://explorer.creator.xyz',
      },
    },
    lightIconUrl: '/icons/creator-testnet-icon-light.svg',
    darkIconUrl: '/icons/creator-testnet-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.creatorTestnet.baseApiUrl,
    proxyApi: '/api/reservoir/creator-testnet',
    routePrefix: 'creator-testnet',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    checkPollingInterval: reservoirChains.creatorTestnet.checkPollingInterval,
    seaportV15: true,
  },
] as ReservoirChain[]
