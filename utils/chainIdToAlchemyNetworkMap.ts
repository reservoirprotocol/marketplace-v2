// https://github.com/alchemyplatform/alchemy-sdk-js/blob/master/src/util/const.ts#L42
export const chainIdToAlchemyNetworkMap: Record<number, string | undefined> = {
  1: 'eth-mainnet',
  5: 'eth-goerli',
  10: 'opt-mainnet',
  8453: 'base-mainnet',
  84532: 'base-sepolia',
  42161: 'arb-mainnet',
  11155111: 'eth-sepolia',
}
