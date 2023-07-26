import {
  useCollections,
  useReservoirClient,
} from '@reservoir0x/reservoir-kit-ui'
import { paths } from '@reservoir0x/reservoir-sdk'
import useSWR, { SWRConfiguration } from 'swr'
import supportedChains from 'utils/chains'
import { setParams } from '@reservoir0x/reservoir-sdk'
import { useMemo } from 'react'

type CollectionsTopSellingQuery =
  paths['/collections/top-selling/v1']['get']['parameters']['query']

export default function (
  options?: CollectionsTopSellingQuery | false,
  swrOptions: SWRConfiguration = {},
  chainId?: number
) {
  const client = useReservoirClient()
  const chain =
    chainId !== undefined
      ? client?.chains.find((chain) => chain.id === chainId)
      : client?.currentChain()
  console.log(chain)

  const { routePrefix } = supportedChains.find((c) => c.id === chain?.id) as any

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
