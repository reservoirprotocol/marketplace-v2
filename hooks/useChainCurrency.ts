import { constants } from 'ethers'
import { useNetwork } from 'wagmi'
import { mainnet, goerli } from 'wagmi/chains'

export default function () {
  const { chain: activeChain, chains } = useNetwork()

  let chain = chains.find((chain) => activeChain?.id === chain.id)

  if (!chain && chains.length > 0) {
    chain = chains[0]
  } else {
    chain = activeChain
  }

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
