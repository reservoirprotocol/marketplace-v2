import { Currency } from '@reservoir0x/reservoir-kit-ui'
import { reservoirChains } from '@reservoir0x/reservoir-sdk'
import wrappedContracts from './wrappedContracts'
import { zeroAddress } from 'viem'
import { Chain, goerli, sepolia } from 'wagmi/chains'
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
  ...goerli,
  // Any url to display the logo of the chain in light mode
  lightIconUrl: '/icons/goerli-icon-dark.svg',
  // Any url to display the logo of the chain in dark mode
  darkIconUrl: '/icons/goerli-icon-light.svg',
  // The base url of the reservoir api, this is used in the app when
  // directly interacting with the reservoir indexer servers (in the api proxy for example)
  // or when prefetching server side rendered data
  reservoirBaseUrl: 'https://api-goerli.dev.reservoir.tools',
  // Used on the client side portions of the marketplace that need an api key added
  // Prevents the api key from being leaked in the clientside requests
  // If you'd like to disable proxying you can just change the proxyApi to the reservoirBaseUrl
  // Doing so will omit the api key unless further changes are made
  proxyApi: '',
  // A prefix used in the asset specific routes on the app (tokens/collections)
  routePrefix: 'goerli',
  // Coingecko id, used to convert the chain's native prices to usd. Can be found here:
  // https://www.coingecko.com/en/api/documentation#operations-coins-get_coins_list
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
}

export default [
  {
    ...sepolia,
    // Any url to display the logo of the chain in light mode
    lightIconUrl: '/icons/goerli-icon-dark.svg',
    // Any url to display the logo of the chain in dark mode
    darkIconUrl: '/icons/goerli-icon-light.svg',
    // The base url of the reservoir api, this is used in the app when
    // directly interacting with the reservoir indexer servers (in the api proxy for example)
    // or when prefetching server side rendered data
    reservoirBaseUrl: 'https://api-sepolia.dev.reservoir.tools',
    // Used on the client side portions of the marketplace that need an api key added
    // Prevents the api key from being leaked in the clientside requests
    // If you'd like to disable proxying you can just change the proxyApi to the reservoirBaseUrl
    // Doing so will omit the api key unless further changes are made
    proxyApi: '',
    // A prefix used in the asset specific routes on the app (tokens/collections)
    routePrefix: 'sepolia',
    // Coingecko id, used to convert the chain's native prices to usd. Can be found here:
    // https://www.coingecko.com/en/api/documentation#operations-coins-get_coins_list
    coingeckoId: 'ethereum',
    collectionSetId: process.env.NEXT_PUBLIC_SEPOLIA_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_SEPOLIA_COMMUNITY,
    listingCurrencies: [
      nativeCurrencyBase,
      {
        symbol: 'WETH',
        contract: wrappedContracts[sepolia.id],
        decimals: 18,
        coinGeckoId: 'weth',
      },
      {
        symbol: 'MTA',
        contract: '0x570E40a09f77F0A098DC7A7bA803Adf1D04Dd8ec',
        decimals: 18,
      },
    ],
    checkPollingInterval: reservoirChains.sepolia.checkPollingInterval,
  },
  DefaultChain,
] as ReservoirChain[]
