import { useCallback, useEffect, useState } from 'react'
import supportedChains, { DefaultChain } from 'utils/chains'
import { useNetwork, useSwitchNetwork } from 'wagmi'

const supportedChainsMap = supportedChains.reduce((map, chain) => {
  map[chain.id] = chain
  return map
}, {} as Record<string, typeof supportedChains[0]>)

const setLocalStorageChain = (chainId: string | number) => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem('reservoir.lastChainId', `${chainId}`)
}

export default (): [
  typeof DefaultChain,
  (chainId: string | number) => void
] => {
  const { switchNetwork } = useSwitchNetwork()
  const { chain } = useNetwork()
  const [lastSelectedChain, setLastSelectedChain] = useState(DefaultChain.id)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (!chain) {
      const selectedChainId =
        localStorage.getItem('reservoir.lastChainId') || DefaultChain.id
      const selectedChain = supportedChains.find(
        (chain) => chain.id === +selectedChainId
      )
      const id = selectedChain?.id || DefaultChain.id
      setLastSelectedChain(id)
      localStorage.setItem('reservoir.lastChainId', `${id}`)
    } else {
      localStorage.setItem('reservoir.lastChainId', `${chain.id}`)
    }
  }, [chain])

  const switchCurrentChain = useCallback(
    (chainId: string | number) => {
      if (chain && switchNetwork) {
        switchNetwork(+chainId)
      } else {
        setLocalStorageChain(chainId)
        setLastSelectedChain(+chainId)
      }
    },
    [chain, switchNetwork]
  )

  let currentChain = DefaultChain

  if (chain && supportedChainsMap[chain.id]) {
    currentChain = supportedChainsMap[chain.id]
  } else if (lastSelectedChain && supportedChainsMap[lastSelectedChain]) {
    currentChain = supportedChainsMap[lastSelectedChain]
  }

  return [currentChain, switchCurrentChain]
}
