import { useRouter } from 'next/router'
import { useState, createContext, FC, useEffect, useCallback } from 'react'
import supportedChains, { DefaultChain } from 'utils/chains'

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
  const [lastSelectedChain, setLastSelectedChain] = useState<number>(DefaultChain.id)
  const router = useRouter()
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const selectedChainId =
      localStorage.getItem('reservoir.lastChainId') || DefaultChain.id
    const selectedChain = supportedChains.find(
      (chain) => chain.id === +selectedChainId
    )
    const id = selectedChain?.id || DefaultChain.id
    setLastSelectedChain(id)
    localStorage.setItem('reservoir.lastChainId', `${id}`)
  }, [])

  const switchCurrentChain = useCallback(
    (chainId: string | number) => {
      if (chainId === lastSelectedChain) {
        return
      }

      const routePrefix = router.query.chain
      const routeChain = supportedChains.find(
        (chain) => chain.routePrefix === routePrefix
      )

      setLastSelectedChain(+chainId)
      if (routePrefix && routeChain?.id !== +chainId) {
        router.push('/')
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('reservoir.lastChainId', `${chainId}`)
      }
    },
    [setLastSelectedChain, router]
  )

  let currentChain = DefaultChain
  if (lastSelectedChain && supportedChainsMap[lastSelectedChain]) {
    currentChain = supportedChainsMap[lastSelectedChain]
  }

  return (
    <ChainContext.Provider value={{ chain: currentChain, switchCurrentChain }}>
      {children}
    </ChainContext.Provider>
  )
}

export default ChainContextProvider
