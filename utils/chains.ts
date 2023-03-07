// import { constants } from 'ethers'
import { optimism, arbitrum } from 'wagmi/chains'
import {Chain} from "@wagmi/chains";

//CONFIGURABLE: The default export controls the supported chains for the marketplace. Removing
// or adding chains will result in adding more or less chains to the marketplace.
// They are an extension of the wagmi chain objects

export interface MarketChain extends Chain {
  iconUrl: string;
  reservoirBaseUrl?: string,
  proxyApi: string;
  routePrefix: string;
  apiKey?: string;
}

export const DefaultChain: MarketChain = {
  ...optimism,
  // Any url to display the logo of the chain
  iconUrl: `/icons/currency/0x4200000000000000000000000000000000000042.png`,
  // The base url of the reservoir api, this is used in the app when
  // directly interacting with the reservoir indexer servers (in the api proxy for example)
  // or when prefetching server side rendered data
  reservoirBaseUrl: process.env.OPTIMISM_RESERVOIR_API_BASE,
  // Used on the client side portions of the marketplace that need an api key added
  // Prevents the api key from being leaked in the clientside requests
  // If you'd like to disable proxying you can just change the proxyApi to the reservoirBaseUrl
  // Doing so will omit the api key unless further changes are made
  proxyApi: '/api/nftearth/optimism',
  // A prefix used in the asset specific routes on the app (tokens/collections)
  routePrefix: 'optimism',
  // Reservoir API key which you can generate at https://reservoir.tools/
  // This is a protected key and displays as 'undefined' on the browser
  // DO NOT add NEXT_PUBLIC to the key or you'll risk leaking it on the browser
  apiKey: process.env.OPTIMISM_RESERVOIR_API_KEY
}

export default [
  DefaultChain,
  {
    ...arbitrum,
    iconUrl: `/icons/currency/0x6c0c4816098e13cacfc7ed68da3e89d0066e8893.png`,
    reservoirBaseUrl: process.env.ARBITRUM_RESERVOIR_API_BASE,
    proxyApi: '/api/nftearth/arbitrum',
    routePrefix: 'arbitrum',
    apiKey: process.env.ARBITRUM_RESERVOIR_API_KEY,
  }
] as MarketChain[]
