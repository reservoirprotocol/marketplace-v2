import { useEffect, useState } from 'react'
import { watchNetwork } from '@wagmi/core'
import chains from 'utils/chains'
import { Chain } from 'wagmi'

export default () => {
  const [chain, setChain] = useState<Chain | undefined>(undefined)
  useEffect(() => {
    const unsubscribeNetworkWatch = watchNetwork((network) => {
      setChain(network?.chain)
    })

    return unsubscribeNetworkWatch
  }, [])
  return {
    isTestnetChain: !chains.map(({ id }) => id).includes(chain?.id as number),
    name: chain?.testnet,
  }
}
