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

  // Goerli
  5: [
    {
      chainId: 5,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Goerli ETH',
      decimals: 18,
    },
    {
      chainId: 11155111,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Sepolia ETH',
      decimals: 18,
    },
    {
      chainId: 5,
      address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
    {
      chainId: 5,
      address: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 6,
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

  // Mumbai
  80001: [
    {
      chainId: 80001,
      address: zeroAddress,
      symbol: 'MATIC',
      name: 'MATIC',
      decimals: 18,
    },
    {
      chainId: 80001,
      address: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
      symbol: 'WMATIC',
      name: 'WMATIC',
      decimals: 18,
    },
    {
      chainId: 80001,
      address: '0x0fa8781a83e46826621b3bc094ea2a0212e71b23',
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
      chainId: 5,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Goerli ETH',
      decimals: 18,
    },
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

  // Base Goerli
  84531: [
    {
      chainId: 5,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Goerli ETH',
      decimals: 18,
    },
    {
      chainId: 84531,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Base Goerli ETH',
      decimals: 18,
    },
    {
      chainId: 84531,
      address: '0x4200000000000000000000000000000000000006',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18,
    },
    {
      chainId: 84531,
      address: '0xf175520c52418dfe19c8098071a252da48cd1c19',
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
      chainId: 5,
      address: zeroAddress,
      symbol: 'ETH',
      name: 'Goerli ETH',
      decimals: 18,
    },
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
} as Record<number, PaymentToken[]>
