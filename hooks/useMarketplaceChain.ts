import supportedChains, { DefaultChain } from 'utils/chains'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { ChainContext } from 'context/ChainContextProvider'

export default () => {
  const { chain } = useContext(ChainContext)
  const router = useRouter()

  //Detect route chain first
  const routePrefix = router.query.chain
  const routeChain = supportedChains.find(
    (chain) => chain.routePrefix === routePrefix
  )
  if (routeChain) {
    return routeChain
  }

  //Fallback to supported wallet chain
  const supportedChain = supportedChains.find(
    (supportedChain) => supportedChain.id === chain?.id
  )

  return supportedChain || DefaultChain
}
