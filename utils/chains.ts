import { Currency } from '@reservoir0x/reservoir-kit-ui'
import wrappedContracts from './wrappedContracts'
import { zeroAddress } from 'viem'
import { arbitrum, mainnet, polygon, optimism, Chain, bsc, avalanche } from 'wagmi/chains'
import usdcContracts from './usdcContracts'

//Chains that are missing from wagmi:
export const zora = {
  id: 7777777,
  name: 'ZORA',
  network: 'zora',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.zora.co'],
      webSocket: ['wss://rpc.zora.co'],
    },
    public: {
      http: ['https://rpc.zora.co'],
      webSocket: ['wss://rpc.zora.co'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'ZORA',
      url: 'https://explorer.zora.energy',
    },
    default: {
      name: 'ZORA',
      url: 'https://explorer.zora.energy',
    },
  },
} as const satisfies Chain

export const base = {
  id: 8453,
  name: 'Base',
  network: 'base',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://developer-access-mainnet.base.org'],
    },
    public: {
      http: ['https://developer-access-mainnet.base.org'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Basescan',
      url: 'https://basescan.org',
    },
    default: {
      name: 'BaseScan',
      url: 'https://basescan.org',
    },
  },
} as const satisfies Chain

export const arbitrumNova = {
  id: 42170,
  name: 'Arbitrum Nova',
  network: 'arbitrum-nova',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    blast: {
      http: ['https://arbitrum-nova.public.blastapi.io'],
      webSocket: ['wss://arbitrum-nova.public.blastapi.io'],
    },
    default: {
      http: ['https://nova.arbitrum.io/rpc'],
    },
    public: {
      http: ['https://nova.arbitrum.io/rpc'],
    },
  },
  blockExplorers: {
    etherscan: { name: 'Arbiscan', url: 'https://nova.arbiscan.io' },
    blockScout: {
      name: 'BlockScout',
      url: 'https://nova-explorer.arbitrum.io/',
    },
    default: { name: 'Arbiscan', url: 'https://nova.arbiscan.io' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 1746963,
    },
  },
} as const satisfies Chain

export const linea = {
  id: 59144,
  name: 'Linea',
  network: 'linea',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.linea.build'],
    },
    public: {
      http: ['https://rpc.linea.build'],
    },
    infura: {
      http: ['https://linea-mainnet.infura.io/v3'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Linea Explorer',
      url: 'https://explorer.linea.build',
    },
    default: {
      name: 'Linea Explorer',
      url: 'https://explorer.linea.build',
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
  listingCurrencies?: Currency[]
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
  ...mainnet,
  // Any url to display the logo of the chain in light mode
  lightIconUrl: '/icons/eth-icon-dark.svg',
  // Any url to display the logo of the chain in dark mode
  darkIconUrl: '/icons/eth-icon-light.svg',
  // The base url of the reservoir api, this is used in the app when
  // directly interacting with the reservoir indexer servers (in the api proxy for example)
  // or when prefetching server side rendered data
  reservoirBaseUrl: 'https://api.reservoir.tools',
  // Used on the client side portions of the marketplace that need an api key added
  // Prevents the api key from being leaked in the clientside requests
  // If you'd like to disable proxying you can just change the proxyApi to the reservoirBaseUrl
  // Doing so will omit the api key unless further changes are made
  proxyApi: '/api/reservoir/ethereum',
  // A prefix used in the asset specific routes on the app (tokens/collections)
  routePrefix: 'ethereum',
  // Reservoir API key which you can generate at https://reservoir.tools/
  // This is a protected key and displays as 'undefined' on the browser
  // DO NOT add NEXT_PUBLIC to the key or you'll risk leaking it on the browser
  apiKey: process.env.RESERVOIR_API_KEY,
  // Coingecko id, used to convert the chain's native prices to usd. Can be found here:
  // https://www.coingecko.com/en/api/documentation#operations-coins-get_coins_list
  coingeckoId: 'ethereum',
  collectionSetId: process.env.NEXT_PUBLIC_ETH_COLLECTION_SET_ID,
  community: process.env.NEXT_PUBLIC_ETH_COMMUNITY,
  listingCurrencies: [
    nativeCurrencyBase,
    {
      ...usdcCurrencyBase,
      contract: usdcContracts[mainnet.id],
    },
  ],
}

export default [
  DefaultChain,
  {
    ...polygon,
    lightIconUrl: '/icons/polygon-icon-dark.svg',
    darkIconUrl: '/icons/polygon-icon-light.svg',
    reservoirBaseUrl: 'https://api-polygon.reservoir.tools',
    proxyApi: '/api/reservoir/polygon',
    routePrefix: 'polygon',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'matic-network',
    collectionSetId: process.env.NEXT_PUBLIC_POLYGON_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_POLYGON_COMMUNITY,
    listingCurrencies: [
      {
        ...nativeCurrencyBase,
        symbol: 'MATIC',
        coinGeckoId: 'matic-network',
      },
      {
        ...usdcCurrencyBase,
        contract: usdcContracts[polygon.id],
      },
      {
        contract: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
        symbol: 'WETH',
        decimals: 18,
        coinGeckoId: 'weth',
      },
    ],
  },
  {
    ...arbitrum,
    name: 'Arbitrum',
    lightIconUrl: '/icons/arbitrum-icon-dark.svg',
    darkIconUrl: '/icons/arbitrum-icon-light.svg',
    reservoirBaseUrl: 'https://api-arbitrum.reservoir.tools',
    proxyApi: '/api/reservoir/arbitrum',
    routePrefix: 'arbitrum',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'arbitrum-iou',
    collectionSetId: process.env.NEXT_PUBLIC_ARBITRUM_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_ARBITRUM_COMMUNITY,
    listingCurrencies: [
      { ...nativeCurrencyBase, coinGeckoId: 'arbitrum-iou' },
      {
        ...usdcCurrencyBase,
        contract: usdcContracts[arbitrum.id],
      },
    ],
  },
  {
    ...arbitrumNova,
    lightIconUrl: '/icons/arbitrum-nova-icon-dark.svg',
    darkIconUrl: '/icons/arbitrum-nova-icon-light.svg',
    reservoirBaseUrl: 'https://api-arbitrum-nova.reservoir.tools',
    proxyApi: '/api/reservoir/arbitrum-nova',
    routePrefix: 'arbitrum-nova',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    collectionSetId: process.env.NEXT_PUBLIC_ARBITRUM_NOVA_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_ARBITRUM_NOVA_COMMUNITY,
  },
  {
    ...optimism,
    name: 'Optimism',
    lightIconUrl: '/icons/optimism-icon-dark.svg',
    darkIconUrl: '/icons/optimism-icon-light.svg',
    reservoirBaseUrl: 'https://api-optimism.reservoir.tools',
    proxyApi: '/api/reservoir/optimism',
    routePrefix: 'optimism',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'optimism',
    collectionSetId: process.env.NEXT_PUBLIC_OPTIMISM_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_OPTIMISM_COMMUNITY,
    listingCurrencies: [
      { ...nativeCurrencyBase, coinGeckoId: 'optimism' },
      {
        ...usdcCurrencyBase,
        contract: usdcContracts[optimism.id],
      },
    ],
  },
  {
    ...zora,
    name: 'Zora',
    lightIconUrl: '/icons/zora-icon-dark.svg',
    darkIconUrl: '/icons/zora-icon-light.svg',
    reservoirBaseUrl: 'https://api-zora.reservoir.tools',
    proxyApi: '/api/reservoir/zora',
    routePrefix: 'zora',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
  },
  {
    ...bsc,
    lightIconUrl: '/icons/bsc-icon-dark.svg',
    darkIconUrl: '/icons/bsc-icon-light.svg',
    reservoirBaseUrl: 'https://api-bsc.reservoir.tools',
    proxyApi: '/api/reservoir/bsc',
    routePrefix: 'bsc',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'binancecoin',
    collectionSetId: process.env.NEXT_PUBLIC_BSC_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_BSC_COMMUNITY,
    listingCurrencies: [
      { ...nativeCurrencyBase, coinGeckoId: 'binancecoin' },
      {
        ...usdcCurrencyBase,
        contract: usdcContracts[bsc.id],
      },
    ],
  },
  {
    ...avalanche,
    lightIconUrl: '/icons/avalanche-icon-dark.svg',
    darkIconUrl: '/icons/avalanche-icon-light.svg',
    reservoirBaseUrl: 'https://api-avalanche.reservoir.tools',
    proxyApi: '/api/reservoir/avalanche',
    routePrefix: 'avalanche',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'avalanche-2',
    collectionSetId: process.env.NEXT_PUBLIC_AVALANCHE_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_AVALANCHE_COMMUNITY,
  },
  {
    ...base,
    lightIconUrl: '/icons/base-icon-dark.svg',
    darkIconUrl: '/icons/base-icon-light.svg',
    reservoirBaseUrl: 'https://api-base.reservoir.tools',
    proxyApi: '/api/reservoir/base',
    routePrefix: 'base',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    collectionSetId: process.env.NEXT_PUBLIC_BASE_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_BASE_COMMUNITY,
  },
  {
    ...linea,
    lightIconUrl: '/icons/linea-icon-dark.svg',
    darkIconUrl: '/icons/linea-icon-light.svg',
    reservoirBaseUrl: 'https://api-linea.reservoir.tools',
    proxyApi: '/api/reservoir/linea',
    routePrefix: 'linea',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    collectionSetId: process.env.NEXT_PUBLIC_LINEA_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_LINEA_COMMUNITY,
  },
] as ReservoirChain[]
