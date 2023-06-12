import { mainnet, goerli } from 'wagmi/chains'
import { useMarketplaceChain } from 'hooks'
import { zeroAddress } from 'viem'

export default function () {
  const chain = useMarketplaceChain()
  const ETHChains: number[] = [mainnet.id, goerli.id]

  if (!chain || !chain.nativeCurrency || ETHChains.includes(chain.id)) {
    return {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      address: zeroAddress,
      chainId: chain?.id || mainnet.id,
    }
  } else {
    return {
      ...chain.nativeCurrency,
      address: zeroAddress,
      chainId: chain.id,
    }
  }
}
