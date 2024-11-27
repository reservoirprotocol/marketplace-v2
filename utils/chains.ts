import { Currency } from '@reservoir0x/reservoir-kit-ui'
import { reservoirChains, customChains } from '@reservoir0x/reservoir-sdk'
import { zeroAddress } from 'viem'
import {
  arbitrum,
  mainnet,
  polygon,
  optimism,
  Chain,
  bsc,
  avalanche,
  polygonZkEvm,
  zkSync,
  linea,
  zora,
  base,
  arbitrumNova,
  scroll,
  opBNB,
  skaleNebula,
} from 'wagmi/chains'
import usdcContracts from './usdcContracts'

export const ancient8Testnet = {
  id: 2863311531,
  name: 'Ancient8 Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc-testnet.ancient8.gg'],
      webSocket: ['https://rpc-testnet.ancient8.gg'],
    },
    public: {
      http: ['https://rpc-testnet.ancient8.gg'],
      webSocket: ['https://rpc-testnet.ancient8.gg'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'a8scan',
      url: 'https://testnet.a8scan.io/',
    },
    default: {
      name: 'a8scan',
      url: 'https://testnet.a8scan.io/',
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
  paperContractId?: string
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
  ...mainnet,
  // Any url to display the logo of the chain in light mode
  lightIconUrl: '/icons/eth-icon-dark.svg',
  // Any url to display the logo of the chain in dark mode
  darkIconUrl: '/icons/eth-icon-light.svg',
  // The base url of the reservoir api, this is used in the app when
  // directly interacting with the reservoir indexer servers (in the api proxy for example)
  // or when prefetching server side rendered data
  reservoirBaseUrl: reservoirChains.mainnet.baseApiUrl,
  // Used on the client side portions of the marketplace that need an api key added
  // Prevents the api key from being leaked in the clientside requests
  // If you'd like to disable proxying you can just change the proxyApi to the reservoirBaseUrl
  // Doing so will omit the api key unless further changes are made
  proxyApi: '/api/reservoir/ethereum',
  // A prefix used in the asset specific routes on the app (tokens/collections)
  routePrefix: 'ethereum',
  // Coingecko id, used to convert the chain's native prices to usd. Can be found here:
  // https://www.coingecko.com/en/api/documentation#operations-coins-get_coins_list
  coingeckoId: 'ethereum',
  collectionSetId: process.env.NEXT_PUBLIC_ETH_COLLECTION_SET_ID,
  community: process.env.NEXT_PUBLIC_ETH_COMMUNITY,
  wssUrl: 'wss://ws.reservoir.tools',
  listingCurrencies: [
    nativeCurrencyBase,
    {
      ...usdcCurrencyBase,
      contract: usdcContracts[mainnet.id],
    },
  ],
  oracleBidsEnabled: true,
  checkPollingInterval: reservoirChains.mainnet.checkPollingInterval,
  paperContractId: process.env.PAPER_ETHEREUM_CONTRACT_ID,
}

export default [
  DefaultChain,
  {
    ...polygon,
    lightIconUrl: '/icons/polygon-icon-dark.svg',
    darkIconUrl: '/icons/polygon-icon-light.svg',
    reservoirBaseUrl: reservoirChains.polygon.baseApiUrl,
    proxyApi: '/api/reservoir/polygon',
    routePrefix: 'polygon',
    coingeckoId: 'matic-network',
    collectionSetId: process.env.NEXT_PUBLIC_POLYGON_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_POLYGON_COMMUNITY,
    paperContractId: process.env.PAPER_POLYGON_CONTRACT_ID,
    wssUrl: 'wss://ws-polygon.reservoir.tools',
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
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.polygon.checkPollingInterval,
  },
  {
    ...arbitrum,
    name: 'Arbitrum',
    lightIconUrl: '/icons/arbitrum-icon-dark.svg',
    darkIconUrl: '/icons/arbitrum-icon-light.svg',
    reservoirBaseUrl: reservoirChains.arbitrum.baseApiUrl,
    proxyApi: '/api/reservoir/arbitrum',
    routePrefix: 'arbitrum',
    coingeckoId: 'arbitrum-iou',
    collectionSetId: process.env.NEXT_PUBLIC_ARBITRUM_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_ARBITRUM_COMMUNITY,
    wssUrl: 'wss://ws-arbitrum.reservoir.tools',
    listingCurrencies: [
      { ...nativeCurrencyBase, coinGeckoId: 'arbitrum-iou' },
      {
        ...usdcCurrencyBase,
        contract: usdcContracts[arbitrum.id],
      },
    ],
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.arbitrum.checkPollingInterval,
  },
  {
    ...base,
    lightIconUrl: '/icons/base-icon-dark.svg',
    darkIconUrl: '/icons/base-icon-light.svg',
    reservoirBaseUrl: reservoirChains.base.baseApiUrl,
    proxyApi: '/api/reservoir/base',
    routePrefix: 'base',
    coingeckoId: 'ethereum',
    collectionSetId: process.env.NEXT_PUBLIC_BASE_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_BASE_COMMUNITY,
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.base.checkPollingInterval,
  },
  {
    ...optimism,
    name: 'Optimism',
    lightIconUrl: '/icons/optimism-icon-dark.svg',
    darkIconUrl: '/icons/optimism-icon-light.svg',
    reservoirBaseUrl: reservoirChains.optimism.baseApiUrl,
    proxyApi: '/api/reservoir/optimism',
    routePrefix: 'optimism',
    coingeckoId: 'optimism',
    collectionSetId: process.env.NEXT_PUBLIC_OPTIMISM_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_OPTIMISM_COMMUNITY,
    wssUrl: 'wss://ws-optimism.reservoir.tools',
    listingCurrencies: [
      { ...nativeCurrencyBase, coinGeckoId: 'optimism' },
      {
        ...usdcCurrencyBase,
        contract: usdcContracts[optimism.id],
      },
    ],
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.optimism.checkPollingInterval,
  },
  {
    ...zora,
    name: 'Zora',
    lightIconUrl: '/icons/zora-icon-dark.svg',
    darkIconUrl: '/icons/zora-icon-light.svg',
    reservoirBaseUrl: reservoirChains.zora.baseApiUrl,
    proxyApi: '/api/reservoir/zora',
    routePrefix: 'zora',
    coingeckoId: 'ethereum',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.zora.checkPollingInterval,
  },
  {
    ...bsc,
    lightIconUrl: '/icons/bsc-icon-dark.svg',
    darkIconUrl: '/icons/bsc-icon-light.svg',
    reservoirBaseUrl: reservoirChains.bsc.baseApiUrl,
    proxyApi: '/api/reservoir/bsc',
    routePrefix: 'bsc',
    coingeckoId: 'binancecoin',
    collectionSetId: process.env.NEXT_PUBLIC_BSC_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_BSC_COMMUNITY,
    wssUrl: 'wss://ws-bsc.reservoir.tools',
    listingCurrencies: [
      { ...nativeCurrencyBase, coinGeckoId: 'binancecoin' },
      {
        ...usdcCurrencyBase,
        contract: usdcContracts[bsc.id],
      },
    ],
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.bsc.checkPollingInterval,
  },
  {
    ...opBNB,
    lightIconUrl: '/icons/bsc-icon-dark.svg',
    darkIconUrl: '/icons/bsc-icon-light.svg',
    reservoirBaseUrl: reservoirChains.opBnb.baseApiUrl,
    proxyApi: '/api/reservoir/opbnb',
    routePrefix: 'opbnb',
    coingeckoId: 'binancecoin',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.opBnb.checkPollingInterval,
    seaportV15: true,
  },
  {
    ...customChains.ancient8,
    lightIconUrl: '/icons/ancient8-icon-dark.svg',
    darkIconUrl: '/icons/ancient8-icon-light.svg',
    reservoirBaseUrl: reservoirChains.ancient8.baseApiUrl,
    proxyApi: '/api/reservoir/ancient8',
    routePrefix: 'ancient8',
    coingeckoId: 'ethereum',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.ancient8.checkPollingInterval,
    seaportV15: true,
  },
  {
    ...avalanche,
    lightIconUrl: '/icons/avalanche-icon-dark.svg',
    darkIconUrl: '/icons/avalanche-icon-light.svg',
    reservoirBaseUrl: reservoirChains.avalanche.baseApiUrl,
    proxyApi: '/api/reservoir/avalanche',
    routePrefix: 'avalanche',
    coingeckoId: 'avalanche-2',
    collectionSetId: process.env.NEXT_PUBLIC_AVALANCHE_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_AVALANCHE_COMMUNITY,
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.avalanche.checkPollingInterval,
  },
  {
    ...arbitrumNova,
    lightIconUrl: '/icons/arbitrum-nova-icon-dark.svg',
    darkIconUrl: '/icons/arbitrum-nova-icon-light.svg',
    reservoirBaseUrl: reservoirChains.arbitrumNova.baseApiUrl,
    proxyApi: '/api/reservoir/arbitrum-nova',
    routePrefix: 'arbitrum-nova',
    coingeckoId: 'ethereum',
    collectionSetId: process.env.NEXT_PUBLIC_ARBITRUM_NOVA_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_ARBITRUM_NOVA_COMMUNITY,
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.arbitrumNova.checkPollingInterval,
  },
  {
    ...linea,
    lightIconUrl: '/icons/linea-icon-dark.svg',
    darkIconUrl: '/icons/linea-icon-light.svg',
    reservoirBaseUrl: reservoirChains.linea.baseApiUrl,
    proxyApi: '/api/reservoir/linea',
    routePrefix: 'linea',
    coingeckoId: 'ethereum',
    collectionSetId: process.env.NEXT_PUBLIC_LINEA_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_LINEA_COMMUNITY,
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.linea.checkPollingInterval,
    seaportV15: true,
  },
  {
    ...polygonZkEvm,
    lightIconUrl: '/icons/polygon-zkevm-icon-dark.svg',
    darkIconUrl: '/icons/polygon-zkevm-icon-light.svg',
    reservoirBaseUrl: reservoirChains.polygonZkEvm.baseApiUrl,
    proxyApi: '/api/reservoir/polygon-zkevm',
    routePrefix: 'polygon-zkevm',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    collectionSetId: process.env.NEXT_PUBLIC_POLYGON_ZKEVM_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_POLYGON_ZKEVM_COMMUNITY,
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.polygonZkEvm.checkPollingInterval,
    seaportV15: true,
  },
  {
    ...zkSync,
    name: 'zkSync',
    lightIconUrl: '/icons/zksync-icon-dark.svg',
    darkIconUrl: '/icons/zksync-icon-light.svg',
    reservoirBaseUrl: reservoirChains.zkSync.baseApiUrl,
    proxyApi: '/api/reservoir/zksync',
    routePrefix: 'zksync',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    collectionSetId: process.env.NEXT_PUBLIC_ZKSYNC_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_ZKSYNC_COMMUNITY,
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.zkSync.checkPollingInterval,
  },
  {
    ...scroll,
    name: 'Scroll',
    lightIconUrl: '/icons/scroll-testnet-icon-dark.svg',
    darkIconUrl: '/icons/scroll-testnet-icon-light.svg',
    reservoirBaseUrl: reservoirChains.scroll.baseApiUrl,
    proxyApi: '/api/reservoir/scroll',
    routePrefix: 'scroll',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    collectionSetId: process.env.NEXT_PUBLIC_SCROLL_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_SCROLL_COMMUNITY,
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.scroll.checkPollingInterval,
    seaportV15: true,
  },
  {
    ...customChains.apexPop,
    name: 'Apex',
    lightIconUrl: '/icons/apex-pop-icon-light.svg',
    darkIconUrl: '/icons/apex-pop-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.apexPop.baseApiUrl,
    proxyApi: '/api/reservoir/apex',
    routePrefix: 'apex',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    collectionSetId: process.env.NEXT_PUBLIC_APE_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_APEX_COMMUNITY,
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.apexPop.checkPollingInterval,
    seaportV15: true,
  },
  {
    ...customChains.blast,
    name: 'Blast',
    lightIconUrl: '/icons/blast-icon-light.svg',
    darkIconUrl: '/icons/blast-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.blast.baseApiUrl,
    proxyApi: '/api/reservoir/blast',
    routePrefix: 'blast',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    collectionSetId: process.env.NEXT_PUBLIC_BLAST_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_BLAST_COMMUNITY,
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.blast.checkPollingInterval,
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
    seaportV15: true,
  },
  {
    ...customChains.redstone,
    name: 'Redstone',
    lightIconUrl: '/icons/redstone-icon-light.svg',
    darkIconUrl: '/icons/redstone-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.redstone.baseApiUrl,
    proxyApi: '/api/reservoir/redstone',
    routePrefix: 'redstone',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    collectionSetId: process.env.NEXT_PUBLIC_REDSTONE_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_REDSTONE_COMMUNITY,
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.redstone.checkPollingInterval,
    seaportV15: true,
  },
  {
    ...customChains.degen,
    name: 'Degen',
    lightIconUrl: '/icons/degen-icon-light.svg',
    darkIconUrl: '/icons/degen-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.degen.baseApiUrl,
    proxyApi: '/api/reservoir/degen',
    routePrefix: 'degen',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'degen-base',
    collectionSetId: process.env.NEXT_PUBLIC_DEGEN_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_DEGEN_COMMUNITY,
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.degen.checkPollingInterval,
    seaportV15: true,
  },
  {
    ...customChains.xai,
    name: 'Xai',
    lightIconUrl: '/icons/xai-icon-light.svg',
    darkIconUrl: '/icons/xai-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.xai.baseApiUrl,
    proxyApi: '/api/reservoir/xai',
    routePrefix: 'xai',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'xai-blockchain',
    collectionSetId: process.env.NEXT_PUBLIC_XAI_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_XAI_COMMUNITY,
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.xai.checkPollingInterval,
  },
  {
    ...skaleNebula,
    name: 'Nebula',
    lightIconUrl: '/icons/nebula-icon-light.svg',
    darkIconUrl: '/icons/nebula-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.nebula.baseApiUrl,
    proxyApi: '/api/reservoir/nebula',
    routePrefix: 'nebula',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    collectionSetId: process.env.NEXT_PUBLIC_NEBULA_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_NEBULA_COMMUNITY,
    listingCurrencies: [
      {
        contract: '0xab01bad2c86e24d371a13ed6367bdca819589c5d',
        symbol: 'ETH',
        decimals: 18,
      },
      {
        contract: '0xcc205196288b7a26f6d43bbd68aaa98dde97276d',
        symbol: 'USDC',
        decimals: 6,
        coinGeckoId: 'usd-coin',
      },
      {
        contract: '0x7f73b66d4e6e67bcdeaf277b9962addcdabbfc4d',
        symbol: 'SKL',
        decimals: 18,
        coinGeckoId: 'skale',
      },
    ],
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.nebula.checkPollingInterval,
    seaportV15: true,
  },
  {
    ...customChains.cyber,
    name: 'Cyber',
    lightIconUrl: '/icons/cyber-icon-light.svg',
    darkIconUrl: '/icons/cyber-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.cyber.baseApiUrl,
    proxyApi: '/api/reservoir/cyber',
    routePrefix: 'cyber',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'cyberconnect',
    collectionSetId: process.env.NEXT_PUBLIC_CYBER_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_CYBER_COMMUNITY,
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.cyber.checkPollingInterval,
  },
  {
    ...customChains.bitlayer,
    name: 'Bitlayer',
    lightIconUrl: '/icons/bitlayer-icon-light.svg',
    darkIconUrl: '/icons/bitlayer-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.bitlayer.baseApiUrl,
    proxyApi: '/api/reservoir/bitlayer',
    routePrefix: 'bitlayer',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'bitcoin',
    collectionSetId: process.env.NEXT_PUBLIC_BITLAYER_COLLECTION_SET_ID,
    community: process.env.NEXT_PUBLIC_BITLAYER_COMMUNITY,
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.bitlayer.checkPollingInterval,
    seaportV15: true,
  },
  {
    ...customChains.sei,
    name: 'Sei',
    lightIconUrl: '/icons/sei-icon-light.svg',
    darkIconUrl: '/icons/sei-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.sei.baseApiUrl,
    proxyApi: '/api/reservoir/sei',
    routePrefix: 'sei',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'sei-network',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.sei.checkPollingInterval,
  },
  {
    ...customChains.boss,
    name: 'Boss',
    lightIconUrl: '/icons/apex-pop-icon-light.svg',
    darkIconUrl: '/icons/apex-pop-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.boss.baseApiUrl,
    proxyApi: '/api/reservoir/boss',
    routePrefix: 'boss',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.boss.checkPollingInterval,
  },
  {
    ...customChains.b3,
    name: 'B3',
    lightIconUrl: '/icons/b3-icon-light.svg',
    darkIconUrl: '/icons/b3-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.b3.baseApiUrl,
    proxyApi: '/api/reservoir/b3',
    routePrefix: 'b3',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.b3.checkPollingInterval,
  },
  {
    ...customChains.forma,
    name: 'Forma',
    lightIconUrl: '/icons/forma-icon-light.svg',
    darkIconUrl: '/icons/forma-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.forma.baseApiUrl,
    proxyApi: '/api/reservoir/forma',
    routePrefix: 'forma',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'celestia',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.forma.checkPollingInterval,
  },
  {
    ...customChains.apechain,
    name: 'Apechain',
    lightIconUrl: '/icons/apechain-icon-light.svg',
    darkIconUrl: '/icons/apechain-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.apechain.baseApiUrl,
    proxyApi: '/api/reservoir/apechain',
    routePrefix: 'apechain',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'apecoin',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.apechain.checkPollingInterval,
  },
  {
    ...customChains.shape,
    name: 'Shape',
    lightIconUrl: '/icons/shape-icon-light.svg',
    darkIconUrl: '/icons/shape-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.shape.baseApiUrl,
    proxyApi: '/api/reservoir/shape',
    routePrefix: 'shape',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.shape.checkPollingInterval,
  },
  {
    ...customChains.hychain,
    name: 'Hychain',
    lightIconUrl: '/icons/hychain-icon-light.svg',
    darkIconUrl: '/icons/hychain-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.hychain.baseApiUrl,
    proxyApi: '/api/reservoir/hychain',
    routePrefix: 'hychain',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'hytopia',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.hychain.checkPollingInterval,
  },
  {
    ...customChains.flow,
    name: 'Flow',
    lightIconUrl: '/icons/flow-icon-light.svg',
    darkIconUrl: '/icons/flow-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.flow.baseApiUrl,
    proxyApi: '/api/reservoir/flow',
    routePrefix: 'flow',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'flow',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.flow.checkPollingInterval,
  },
  {
    ...customChains.hychain,
    name: 'Hychain',
    lightIconUrl: '/icons/hychain-icon-light.svg',
    darkIconUrl: '/icons/hychain-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.hychain.baseApiUrl,
    proxyApi: '/api/reservoir/hychain',
    routePrefix: 'hychain',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'hytopia',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.hychain.checkPollingInterval,
  },
  {
    ...customChains.zero,
    name: 'Zero',
    lightIconUrl: '/icons/zero-icon-light.svg',
    darkIconUrl: '/icons/zero-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.zero.baseApiUrl,
    proxyApi: '/api/reservoir/zero',
    routePrefix: 'zero',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.zero.checkPollingInterval,
  },
  {
    ...customChains.abstract,
    name: 'Abstract',
    lightIconUrl: '/icons/abstract-icon-light.svg',
    darkIconUrl: '/icons/abstract-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.abstract.baseApiUrl,
    proxyApi: '/api/reservoir/abstract',
    routePrefix: 'abstract',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.abstract.checkPollingInterval,
  },
  {
    ...customChains.game7,
    name: 'game7',
    lightIconUrl: '/icons/game7-icon-light.svg',
    darkIconUrl: '/icons/game7-icon-dark.svg',
    reservoirBaseUrl: reservoirChains.game7.baseApiUrl,
    proxyApi: '/api/reservoir/game7',
    routePrefix: 'game7',
    apiKey: process.env.RESERVOIR_API_KEY,
    coingeckoId: 'ethereum',
    oracleBidsEnabled: true,
    checkPollingInterval: reservoirChains.game7.checkPollingInterval,
  },
] as ReservoirChain[]
