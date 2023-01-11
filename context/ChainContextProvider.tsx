import { useState, createContext, FC, useEffect, useCallback } from 'react'
import supportedChains, { DefaultChain } from 'utils/chains'
import { useNetwork, useSwitchNetwork } from 'wagmi'

const supportedChainsMap = supportedChains.reduce((map, chain) => {
  map[chain.id] = chain
  return map
}, {} as Record<string, typeof supportedChains[0]>)

export const ChainContext = createContext<{
  chain: typeof DefaultChain
  switchCurrentChain: (chainId: string | number) => void
}>({
  chain: DefaultChain,
  switchCurrentChain: () => {},
})

const ChainContextProvider: FC<any> = ({ children }) => {
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
        setLastSelectedChain(+chainId)
        if (typeof window !== 'undefined') {
          localStorage.setItem('reservoir.lastChainId', `${chainId}`)
        }
      }
    },
    [chain, switchNetwork, setLastSelectedChain]
  )

  let currentChain = DefaultChain
  if (chain && supportedChainsMap[chain.id]) {
    currentChain = supportedChainsMap[chain.id]
  } else if (lastSelectedChain && supportedChainsMap[lastSelectedChain]) {
    currentChain = supportedChainsMap[lastSelectedChain]
  }

  return (
    <ChainContext.Provider value={{ chain: currentChain, switchCurrentChain }}>
      {children}
    </ChainContext.Provider>
  )
}

export default ChainContextProvider
