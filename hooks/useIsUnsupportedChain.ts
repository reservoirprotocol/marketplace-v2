import { reservoirChains } from '@reservoir0x/reservoir-sdk'
import { useEffect, useState } from 'react'
import { useNetwork } from 'wagmi'

type Chain = Omit<(typeof reservoirChains)['mainnet'], 'websocketUrl'>

const TESTNET_CHAINS: Chain[] = [
  reservoirChains.goerli,
  reservoirChains.sepolia,
  reservoirChains.mumbai,
  reservoirChains.baseGoerli,
  reservoirChains.scrollTestnet,
  reservoirChains.zoraTestnet,
]

const MAINNET_CHAINS: Chain[] = [
  reservoirChains.mainnet,
  reservoirChains.polygon,
  reservoirChains.arbitrum,
  reservoirChains.optimism,
  reservoirChains.zora,
  reservoirChains.bsc,
  reservoirChains.avalanche,
  reservoirChains.base,
  reservoirChains.linea,
  reservoirChains.zkSync,
  reservoirChains.polygonZkEvm,
  reservoirChains.scroll,
]

const MAINNET_DEPLOYMENT_URLS = [
  'explorer.reservoir.tools',
  'explorer-dev.reservoir.tools',
]

const IS_TESTNET_DEPLOYMENT =
  !MAINNET_DEPLOYMENT_URLS.includes(
    process.env.NEXT_PUBLIC_HOST_URL as string
  ) && process.env.NEXT_PUBLIC_HOST_URL === 'testnets.reservoir.tools'

export default () => {
  const [unsupportedChain, setUnsupportedChain] = useState<Chain | undefined>(
    undefined
  )
  const { chain } = useNetwork()

  useEffect(() => {
    setUnsupportedChain(
      (IS_TESTNET_DEPLOYMENT ? TESTNET_CHAINS : MAINNET_CHAINS).find(
        ({ id }) => chain?.id === id
      )
    )
  }, [chain])
  return {
    unsupportedChain,
  }
}
