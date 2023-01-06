import { constants } from 'ethers'
import { mainnet, goerli } from 'wagmi/chains'
import { useMarketplaceChain } from 'hooks'

export default function () {
  const chain = useMarketplaceChain()
  const ETHChains: number[] = [mainnet.id, goerli.id]

  if (!chain || !chain.nativeCurrency || ETHChains.includes(chain.id)) {
    return {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      address: constants.AddressZero,
      chainId: chain?.id || mainnet.id,
    }
  } else {
    return {
      ...chain.nativeCurrency,
      address: constants.AddressZero,
      chainId: chain.id,
    }
  }
}
