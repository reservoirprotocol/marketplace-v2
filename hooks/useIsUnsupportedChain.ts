import { useEffect, useState } from 'react'
import { watchNetwork } from '@wagmi/core'

interface Chain {
  name: string
  chainId: number
}

const UNSUPPORTED_CHAINS: Chain[] = [
  { name: 'Goerli', chainId: 5 },
  { name: 'Sepolia', chainId: 11155111 },
  { name: 'Polygon Mumbai', chainId: 80001 },
  { name: 'BaseGoerli', chainId: 5 },
  { name: 'Scroll Testnet', chainId: 0 },
]

export default () => {
  const [unsupportedChain, setUnsupportedChain] = useState<
    { name: string; chainId: number } | undefined
  >(undefined)
  useEffect(() => {
    const unsubscribeNetworkWatch = watchNetwork((network) => {
      setUnsupportedChain(
        UNSUPPORTED_CHAINS.find(({ chainId }) => network.chain?.id == chainId)
      )
    })

    return unsubscribeNetworkWatch
  }, [])
  return {
    unsupportedChain,
  }
}
