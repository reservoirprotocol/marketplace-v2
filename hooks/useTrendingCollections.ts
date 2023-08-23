import { useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import useSWR, { SWRConfiguration } from 'swr'
import supportedChains, { DefaultChain } from 'utils/chains'

export default function (swrOptions: SWRConfiguration = {}, chainId?: number) {
  const client = useReservoirClient()
  const chain =
    chainId !== undefined
      ? client?.chains.find((chain) => chain.id === chainId)
      : client?.currentChain()

  const { routePrefix } =
    (supportedChains.find((c) => c.id === chain?.id) as any) || DefaultChain

  const { data: topSellingData, ...topSellingSwr } = useSWR<any>(
    routePrefix ? `/api/${routePrefix}/trendingCollections/v1` : null,
    null,
    swrOptions
  )

  return {
    ...topSellingSwr,
    collections: topSellingData?.collections,
    data: {
      collections: topSellingData?.collections,
    },
    isValidating: topSellingSwr.isValidating,
  }
}
