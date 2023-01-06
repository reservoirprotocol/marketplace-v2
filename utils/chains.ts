import { constants } from 'ethers'
import { goerli, mainnet, polygon } from 'wagmi/chains'

export const DefaultChain = {
  ...mainnet,
  iconUrl: `https://api.reservoir.tools/redirect/currency/${constants.AddressZero}/icon/v1`,
  iconBackground: '#fff',
  reservoirBaseUrl: 'https://api.reservoir.tools',
  routePrefix: 'ethereum',
}

export default [
  DefaultChain,
  {
    ...polygon,
    iconUrl: `https://api-polygon.reservoir.tools/redirect/currency/${constants.AddressZero}/icon/v1`,
    reservoirBaseUrl: 'https://api-polygon.reservoir.tools',
    routePrefix: 'polygon',
  },
  {
    ...goerli,
    iconUrl: `https://api-goerli.reservoir.tools/redirect/currency/${constants.AddressZero}/icon/v1`,
    iconBackground: '#fff',
    reservoirBaseUrl: 'https://api-goerli.reservoir.tools',
    routePrefix: 'goerli',
  },
]
