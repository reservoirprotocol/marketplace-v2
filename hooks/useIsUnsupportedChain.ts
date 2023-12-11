import { useEffect, useState } from 'react'
import { useNetwork } from 'wagmi'

interface Chain {
  name: string
  chainId: number
}

const TESTNET_CHAINS: Chain[] = [
  { name: 'Goerli', chainId: 5 },
  { name: 'Sepolia', chainId: 11155111 },
  { name: 'Polygon Mumbai', chainId: 80001 },
  { name: 'BaseGoerli', chainId: 84531 },
  { name: 'Scroll Testnet', chainId: 534352 },
  { name: 'Zora Testnet', chainId: 999999999 },
]

export default () => {
  const [unsupportedChain, setUnsupportedChain] = useState<
    { name: string; chainId: number } | undefined
  >(undefined)
  const { chain } = useNetwork()

  useEffect(() => {
    setUnsupportedChain(
      TESTNET_CHAINS.find(({ chainId }) => chain?.id === chainId)
    )
  }, [chain])
  return {
    unsupportedChain,
  }
}
