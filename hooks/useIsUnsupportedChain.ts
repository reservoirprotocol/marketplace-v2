import { reservoirChains } from '@reservoir0x/reservoir-sdk'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

type Chain = Omit<(typeof reservoirChains)['mainnet'], 'websocketUrl'>

const TESTNET_CHAINS: Chain[] = [
  reservoirChains.goerli,
  reservoirChains.sepolia,
  reservoirChains.mumbai,
  reservoirChains.baseGoerli,
  reservoirChains.scrollTestnet,
  reservoirChains.zoraTestnet,
  reservoirChains.baseSepolia,
  reservoirChains.ancient8Testnet,
  reservoirChains.frameTestnet,
  reservoirChains.blastSepolia,
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
  reservoirChains.apexPop,
  reservoirChains.polygonZkEvm,
  reservoirChains.scroll,
  reservoirChains.opBnb,
  reservoirChains.ancient8,
  reservoirChains.astarZkEVM,
  reservoirChains.blast,
]

const MAINNET_DEPLOYMENT_URLS = [
  'https://explorer.reservoir.tools',
  'https://explorer-dev.reservoir.tools',
  'https://explorer-privy.reservoir.tools',
]

const IS_TESTNET_DEPLOYMENT =
  !MAINNET_DEPLOYMENT_URLS.includes(
    process.env.NEXT_PUBLIC_HOST_URL as string,
  ) && process.env.NEXT_PUBLIC_HOST_URL == 'https://testnets.reservoir.tools'

export default () => {
  const [unsupportedChain, setUnsupportedChain] = useState<Chain | undefined>(
    undefined,
  )
  const { chain } = useAccount()

  useEffect(() => {
    setUnsupportedChain(
      (IS_TESTNET_DEPLOYMENT ? MAINNET_CHAINS : TESTNET_CHAINS).find(
        ({ id }) => chain?.id === id,
      ),
    )
  }, [chain])
  return {
    unsupportedChain,
    isTestnetDeployment: !IS_TESTNET_DEPLOYMENT,
  }
}
