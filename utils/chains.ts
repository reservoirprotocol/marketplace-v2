import {
  goerli,
  sepolia,
  polygonMumbai,
  baseGoerli,
  scrollTestnet,
  Chain,
} from 'wagmi/chains'
import { Currency } from '@reservoir0x/reservoir-kit-ui'
import wrappedContracts from './wrappedContracts'
import { zeroAddress } from 'viem'
import usdcContracts from './usdcContracts'

//Chains that are missing from wagmi:
export const zoraTestnet = {
  id: 999,
  name: 'Zora Testnet',
  network: 'zora-testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://testnet.rpc.zora.co'],
    },
    public: {
      http: ['https://testnet.rpc.zora.co'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Zora Testnet explorer',
      url: 'https://testnet.explorer.zora.co',
    },
    default: {
      name: 'Zora Testnet explorer',
      url: 'https://testnet.explorer.zora.co',
    },
  },
} as const satisfies Chain

//CONFIGURABLE: The default export controls the supported chains for the marketplace. Removing
// or adding chains will result in adding more or less chains to the marketplace.
// They are an extension of the wagmi chain objects

export type ReservoirChain = Chain & {
  lightIconUrl: string
  darkIconUrl: string
  reservoirBaseUrl: string
  proxyApi: string
  routePrefix: string
  apiKey?: string
  coingeckoId?: string
  collectionSetId?: string
  community?: string
  wssUrl?: string
  listingCurrencies?: Currency[]
  oracleBidsEnabled?: boolean
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
  reservoirBaseUrl: 'https://api-sepolia.reservoir.tools',
  // Used on the client side portions of the marketplace that need an api key added
  // Prevents the api key from being leaked in the clientside requests
  // If you'd like to disable proxying you can just change the proxyApi to the reservoirBaseUrl
  // Doing so will omit the api key unless further changes are made
  proxyApi: '/api/reservoir/sepolia',
  // A prefix used in the asset specific routes on the app (tokens/collections)
  routePrefix: 'sepolia',
  // Reservoir API key which you can generate at https://reservoir.tools/
  // This is a protected key and displays as 'undefined' on the browser
  // DO NOT add NEXT_PUBLIC to the key or you'll risk leaking it on the browser
  apiKey: process.env.RESERVOIR_API_KEY,
  // Coingecko id, used to convert the chain's native prices to usd. Can be found here:
  // https://www.coingecko.com/en/api/documentation#operations-coins-get_coins_list
  coingeckoId: 'ethereum',
  collectionSetId: process.env.NEXT_PUBLIC_SEPOLIA_COLLECTION_SET_ID,
  community: process.env.NEXT_PUBLIC_SEPOLIA_COMMUNITY,
  wssUrl: 'wss://ws-sepolia.reservoir.tools',
}

export default [
  DefaultChain,
  {
    ...goerli,
    lightIconUrl: '/icons/goerli-icon-dark.svg',
    darkIconUrl: '/icons/goerli-icon-light.svg',
    reservoirBaseUrl: 'https://api-goerli.reservoir.tools',
    proxyApi: '/api/reservoir/goerli',
    routePrefix: 'goerli',
    apiKey: process.env.RESERVOIR_API_KEY,
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
  },
  {
    ...polygonMumbai,
    lightIconUrl: '/icons/polygon-icon-dark.svg',
    darkIconUrl: '/icons/polygon-icon-light.svg',
    reservoirBaseUrl: 'https://api-mumbai.reservoir.tools',
    proxyApi: '/api/reservoir/mumbai',
    routePrefix: 'mumbai',
    apiKey: process.env.RESERVOIR_API_KEY,
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
  },
  {
    ...baseGoerli,
    lightIconUrl: '/icons/base-goerli-icon-dark.svg',
    darkIconUrl: '/icons/base-goerli-icon-light.svg',
    reservoirBaseUrl: 'https://api-base-goerli.reservoir.tools',
    proxyApi: '/api/reservoir/base-goerli',
    routePrefix: 'base-goerli',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    collectionSetId: process.env.NEXT_PUBLIC_BASE_GOERLI_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_BASE_GOERLI_COMMUNITY,
  },
  {
    ...scrollTestnet,
    lightIconUrl: '/icons/scroll-testnet-icon-dark.svg',
    darkIconUrl: '/icons/scroll-testnet-icon-light.svg',
    reservoirBaseUrl: 'https://api-scroll-alpha.reservoir.tools',
    proxyApi: '/api/reservoir/scroll-alpha',
    routePrefix: 'scroll-alpha',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    collectionSetId: process.env.NEXT_PUBLIC_SCROLL_ALPHA_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_SCROLL_ALPHA_COMMUNITY,
    name: 'Scroll Alpha',
  },
  {
    ...zoraTestnet,
    lightIconUrl: '/icons/zora-testnet-icon-dark.svg',
    darkIconUrl: '/icons/zora-testnet-icon-light.svg',
    reservoirBaseUrl: 'https://api-zora-testnet.reservoir.tools',
    proxyApi: '/api/reservoir/zora-testnet',
    routePrefix: 'zora-testnet',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    collectionSetId: process.env.NEXT_PUBLIC_ZORA_TESTNET_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_ZORA_TESTNET_COMMUNITY,
  },
] as ReservoirChain[]
