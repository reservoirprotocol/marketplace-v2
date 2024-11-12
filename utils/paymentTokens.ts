import { Address, zeroAddress } from 'viem'

export type PaymentToken = {
  chainId: number
  address: Address
  symbol: string
  decimals: number
  name?: string
}

export const chainPaymentTokensMap = {
  // Mainnet
  1: [
    {
      chainId: 1,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    {
      chainId: 8453,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Base ETH',
      decimals: 18,
    },
    {
      chainId: 10,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Optimism ETH',
      decimals: 18,
    },
    {
      chainId: 1,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 6,
    },
    {
      chainId: 1,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
  ],

  // Optimism
  10: [
    {
      chainId: 1,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    {
      chainId: 8453,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Base ETH',
      decimals: 18,
    },
    {
      chainId: 10,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Optimism ETH',
      decimals: 18,
    },
    {
      chainId: 42161,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Arbitrum ETH',
      decimals: 18,
    },
    {
      chainId: 7777777,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Zora ETH',
      decimals: 18,
    },
    {
      chainId: 10,
      address: '0x4200000000000000000000000000000000000006',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
    {
      chainId: 10,
      address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 6,
    },
  ],

  // Polygon
  137: [
    {
      chainId: 137,
      address: zeroAddress,
      symbol: 'MATIC',
      name: 'MATIC',
      decimals: 18,
    },
    {
      chainId: 137,
      address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
    {
      chainId: 137,
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 6,
    },
  ],

  // Arbitrum
  42161: [
    {
      chainId: 1,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    {
      chainId: 8453,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Base ETH',
      decimals: 18,
    },
    {
      chainId: 42161,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Arbitrum ETH',
      decimals: 18,
    },
    {
      chainId: 10,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Optimism ETH',
      decimals: 18,
    },
    {
      chainId: 7777777,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Zora ETH',
      decimals: 18,
    },
    {
      chainId: 42161,
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
    {
      chainId: 42161,
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 6,
    },
  ],

  // Arbitrum Nova
  42170: [
    {
      chainId: 1,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    {
      chainId: 8453,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Base ETH',
      decimals: 18,
    },
    {
      chainId: 42170,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Arbitrum Nova ETH',
      decimals: 18,
    },
    {
      chainId: 42170,
      address: '0x722e8bdd2ce80a4422e880164f2079488e115365',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
    {
      chainId: 42170,
      address: '0x750ba8b76187092B0D1E87E28daaf484d1b5273b',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 6,
    },
  ],

  // Avalanche
  43114: [
    {
      chainId: 43114,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Avalanche ETH',
      decimals: 18,
    },
    {
      chainId: 43114,
      address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
    {
      chainId: 43114,
      address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 6,
    },
  ],

  // Sepolia
  11155111: [
    {
      chainId: 11155111,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Sepolia ETH',
      decimals: 18,
    },
    {
      chainId: 11155111,
      address: '0x7b79995e5f793a07bc00c21412e50ecae098e7f9',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
  ],

  // Base Sepolia
  84532: [
    {
      chainId: 84532,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Base Sepolia ETH',
      decimals: 18,
    },
  ],

  // Base
  8453: [
    {
      chainId: 1,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    {
      chainId: 8453,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Base ETH',
      decimals: 18,
    },
    {
      chainId: 10,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Optimism ETH',
      decimals: 18,
    },
    {
      chainId: 42161,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Arbitrum ETH',
      decimals: 18,
    },
    {
      chainId: 7777777,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Zora ETH',
      decimals: 18,
    },
    {
      chainId: 8453,
      address: '0x4200000000000000000000000000000000000006',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
    {
      chainId: 8453,
      address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 6,
    },
  ],

  // Scroll Testnet
  534353: [
    {
      chainId: 534353,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Scroll Testnet ETH',
      decimals: 18,
    },
    {
      chainId: 534353,
      address: '0xa1EA0B2354F5A344110af2b6AD68e75545009a03',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
    {
      chainId: 534353,
      address: '0xA0D71B9877f44C744546D649147E3F1e70a93760',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 6,
    },
  ],

  // Scroll
  534352: [
    {
      chainId: 534352,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Scroll ETH',
      decimals: 18,
    },
    {
      chainId: 534352,
      address: '0x5300000000000000000000000000000000000004',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
  ],

  // Linea
  59144: [
    {
      chainId: 59144,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    {
      chainId: 59144,
      address: '0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
    {
      chainId: 59144,
      address: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 6,
    },
  ],

  // Bsc
  56: [
    {
      chainId: 56,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'BSC ETH',
      decimals: 18,
    },
    {
      chainId: 56,
      address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
      symbol: 'WBNB',
      name: 'WBNB',
      decimals: 18,
    },
    {
      chainId: 56,
      address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 6,
    },
  ],

  // Zora
  7777777: [
    {
      chainId: 1,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    {
      chainId: 8453,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Base ETH',
      decimals: 18,
    },
    {
      chainId: 7777777,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Zora ETH',
      decimals: 18,
    },
    {
      chainId: 10,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Optimism ETH',
      decimals: 18,
    },
    {
      chainId: 42161,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Arbitrum ETH',
      decimals: 18,
    },
    {
      chainId: 7777777,
      address: '0x4200000000000000000000000000000000000006',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
  ],

  // Zora Testnet
  999: [
    {
      chainId: 999,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Zora Testnet ETH',
      decimals: 18,
    },
    {
      chainId: 999,
      address: '0x8a5027ea12f45a13deb6CB96A07913c6e192BE84',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
  ],

  // zkSync
  324: [
    {
      chainId: 324,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'zkSync ETH',
      decimals: 18,
    },
    {
      chainId: 324,
      address: '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
    {
      chainId: 1,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    {
      chainId: 10,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Optimism ETH',
      decimals: 18,
    },
    {
      chainId: 8453,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Base ETH',
      decimals: 18,
    },
    {
      chainId: 42161,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Arbitrum ETH',
      decimals: 18,
    },
  ],

  // polygonZkEvm
  1101: [
    {
      chainId: 1101,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Polygon zkEVM ETH',
      decimals: 18,
    },
    {
      chainId: 1101,
      address: '0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
  ],

  // Ancient8 Testnet
  2863311531: [
    {
      chainId: 2863311531,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Ancient8 Testnet ETH',
      decimals: 18,
    },
    {
      chainId: 2863311531,
      address: '0x4200000000000000000000000000000000000006',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
    {
      chainId: 1,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    {
      chainId: 8453,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Base ETH',
      decimals: 18,
    },
    {
      chainId: 10,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Optimism ETH',
      decimals: 18,
    },
    {
      chainId: 7777777,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Zora ETH',
      decimals: 18,
    },
  ],

  // Blast
  81457: [
    {
      chainId: 81457,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Blast ETH',
      decimals: 18,
    },
    {
      chainId: 81457,
      address: '0x4300000000000000000000000000000000000004',
      symbol: 'WETH',
      name: 'Blast WETH',
      decimals: 18,
    },
    {
      chainId: 1,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    {
      chainId: 8453,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Base ETH',
      decimals: 18,
    },
    {
      chainId: 10,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Optimism ETH',
      decimals: 18,
    },
    {
      chainId: 7777777,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Zora ETH',
      decimals: 18,
    },
  ],

  // Sei Testnet
  713715: [
    {
      chainId: 713715,
      address: zeroAddress,
      symbol: 'SEI',
      name: 'SEI',
      decimals: 18,
    },
    {
      chainId: 713715,
      address: '0x48a9b22b80f566e88f0f1dcc90ea15a8a3bae8a4',
      symbol: 'WSEI',
      name: 'WSEI',
      decimals: 18,
    },
  ],

  // xai
  660279: [
    {
      chainId: 660279,
      address: zeroAddress,
      symbol: 'XAI',
      name: 'Xai',
      decimals: 18,
    },
    {
      chainId: 660279,
      address: '0x3fb787101dc6be47cfe18aeee15404dcc842e6af',
      symbol: 'WXAI',
      name: 'WXAI',
      decimals: 18,
    },
  ],

  // nebula
  1482601649: [
    {
      chainId: 1482601649,
      address: '0xab01bad2c86e24d371a13ed6367bdca819589c5d',
      symbol: 'ETH',
      name: 'Europa ETH',
      decimals: 18,
    },
    {
      chainId: 1482601649,
      address: '0xcc205196288b7a26f6d43bbd68aaa98dde97276d',
      symbol: 'USDC',
      name: 'Europa USDC',
      decimals: 6,
    },
    {
      chainId: 1482601649,
      address: '0x7f73b66d4e6e67bcdeaf277b9962addcdabbfc4d',
      symbol: 'SKL',
      name: 'Europa SKL',
      decimals: 18,
    },
  ],

  // cyber
  7560: [
    {
      chainId: 7560,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Cyber ETH',
      decimals: 18,
    },
    {
      chainId: 7560,
      address: '0x4200000000000000000000000000000000000006',
      symbol: 'WETH',
      name: 'Cyber WETH',
      decimals: 18,
    },
  ],

  // bitlayer
  200901: [
    {
      chainId: 200901,
      address: zeroAddress,
      symbol: 'BTC',
      name: 'Bitcoin',
      decimals: 18,
    },
    {
      chainId: 200901,
      address: '0xff204e2681a6fa0e2c3fade68a1b28fb90e4fc5f',
      symbol: 'WBTC',
      name: 'Wrapped BTC',
      decimals: 18,
    },
  ],

  // sei
  1329: [
    {
      chainId: 1329,
      address: zeroAddress,
      symbol: 'SEI',
      name: 'Sei',
      decimals: 18,
    },
  ],

  // b3 testnet
  1993: [
    {
      chainId: 1993,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Ether',
      decimals: 18,
    },
  ],

  // flow previewnet
  646: [
    {
      chainId: 646,
      address: zeroAddress,
      symbol: 'FLOW',
      name: 'Flow',
      decimals: 18,
    },
  ],

  // Cloud
  70805: [
    {
      chainId: 70805,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    {
      chainId: 70805,
      address: '0x48a9b22b80f566e88f0f1dcc90ea15a8a3bae8a4',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
  ],

  // Game7 Testnet
  13746: [
    {
      chainId: 13746,
      address: zeroAddress,
      symbol: 'TG7T',
      name: 'TG7T',
      decimals: 18,
    },
    {
      chainId: 13746,
      address: '0x6b885d96916d18cd78e44b42c6489ca6f8794565',
      symbol: 'WTG7T',
      name: 'WTG7T',
      decimals: 18,
    },
  ],

  // forma sketchpad
  984123: [
    {
      chainId: 984123,
      address: zeroAddress,
      symbol: 'TIA',
      name: 'TIA',
      decimals: 18,
    },
    {
      chainId: 984123,
      address: '0xd5eace1274dbf70960714f513db207433615a263',
      symbol: 'WTIA',
      name: 'WTIA',
      decimals: 18,
    },
  ],

  // Curtis
  33111: [
    {
      chainId: 33111,
      address: zeroAddress,
      symbol: 'APE',
      name: 'APE',
      decimals: 18,
    },
    {
      chainId: 33111,
      address: '0x8643a49363e80c7a15790703b915d1b0b6b71d56',
      symbol: 'WAPE',
      name: 'WAPE',
      decimals: 18,
    },
  ],

  // Shape Sepolia
  11011: [
    {
      chainId: 11011,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    {
      chainId: 11011,
      address: '0x48a9b22b80f566e88f0f1dcc90ea15a8a3bae8a4',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
  ],

  // Abstract Testnet
  11124: [
    {
      chainId: 11124,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    {
      chainId: 11124,
      address: '0x9edcde0257f2386ce177c3a7fcdd97787f0d841d',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
  ],

  // Minato
  1946: [
    {
      chainId: 1946,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    {
      chainId: 1946,
      address: '0x4200000000000000000000000000000000000006',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
  ],

  // Hychain Testnet
  29112: [
    {
      chainId: 29112,
      address: zeroAddress,
      symbol: 'TOPIA',
      name: 'Hychain',
      decimals: 18,
    },
    {
      chainId: 29112,
      address: '0x2549584be33491340eee6762992055cda05b2581',
      symbol: 'WTOPIA',
      name: 'Wrapped TOPIA',
      decimals: 18,
    },
  ],

  // Apex
  70700: [
    {
      chainId: 70700,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Apex ETH',
      decimals: 18,
    },
    {
      chainId: 70701,
      address: '0x77684A04145a5924eFCE0D92A7c4a2A2E8C359de',
      symbol: 'WETH',
      name: 'Apex WETH',
      decimals: 18,
    },
    {
      chainId: 1,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    {
      chainId: 10,
      address: zeroAddress,
      symbol: 'Optimism ETH',
      name: 'Optimism ETH',
      decimals: 18,
    },
    {
      chainId: 42161,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Arbitrum ETH',
      decimals: 18,
    },
    {
      chainId: 7777777,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Zora ETH',
      decimals: 18,
    },
    {
      chainId: 8453,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Base ETH',
      decimals: 18,
    },
    {
      chainId: 42170,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Arbitrum Nova ETH',
      decimals: 18,
    },
    {
      chainId: 70701,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Boss ETH',
      decimals: 18,
    },
    {
      chainId: 81457,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Blast ETH',
      decimals: 18,
    },
  ],

  // Boss
  70701: [
    {
      chainId: 70701,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Boss ETH',
      decimals: 18,
    },
    {
      chainId: 70701,
      address: '0x48a9b22b80f566e88f0f1dcc90ea15a8a3bae8a4',
      symbol: 'WETH',
      name: 'Boss WETH',
      decimals: 18,
    },
    {
      chainId: 1,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    {
      chainId: 10,
      address: zeroAddress,
      symbol: 'Optimism ETH',
      name: 'Optimism ETH',
      decimals: 18,
    },
    {
      chainId: 42161,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Arbitrum ETH',
      decimals: 18,
    },
    {
      chainId: 7777777,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Zora ETH',
      decimals: 18,
    },
    {
      chainId: 8453,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Base ETH',
      decimals: 18,
    },
    {
      chainId: 42170,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Arbitrum Nova ETH',
      decimals: 18,
    },
    {
      chainId: 70700,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Apex ETH',
      decimals: 18,
    },
    {
      chainId: 81457,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Blast ETH',
      decimals: 18,
    },
  ],

  // Zero Testnet
  43210: [
    {
      chainId: 43210,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    {
      chainId: 43210,
      address: '0xee6b04fcd07a54d78a7a23f353f2b4a0bfb4a78c',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
  ],

  // Anime Testnet
  6900: [
    {
      chainId: 6900,
      address: zeroAddress,
      symbol: 'ANIME',
      name: 'ANIME',
      decimals: 18,
    },
    {
      chainId: 6900,
      address: '0x8f3e2785985aa4005c63f97f7cc89ce91a948267',
      symbol: 'WANIME',
      name: 'WANIME',
      decimals: 18,
    },
  ],
} as Record<number, PaymentToken[]>
