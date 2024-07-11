import { mainnet, sepolia, skaleNebula } from 'wagmi/chains'
import { useMarketplaceChain } from 'hooks'
import { zeroAddress } from 'viem'

export default function () {
  const chain = useMarketplaceChain()
  const ETHChains: number[] = [mainnet.id, sepolia.id]

  if (!chain || !chain.nativeCurrency || ETHChains.includes(chain.id)) {
    return {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      address: zeroAddress,
      chainId: chain?.id || mainnet.id,
    }
  } else if (chain.id === skaleNebula.id) {
    return {
      name: 'Europa ETH',
      symbol: 'ETH',
      decimals: 18,
      address: '0xab01bad2c86e24d371a13ed6367bdca819589c5d',
      chainId: 1482601649,
    }
  } else {
    return {
      ...chain.nativeCurrency,
      address: zeroAddress,
      chainId: chain.id,
    }
  }
}
