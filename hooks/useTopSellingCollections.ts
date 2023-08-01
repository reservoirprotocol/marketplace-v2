import {
  useCollections,
  useReservoirClient,
} from '@reservoir0x/reservoir-kit-ui'
import { paths } from '@reservoir0x/reservoir-sdk'
import useSWR, { SWRConfiguration } from 'swr'
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

  const path = new URL(`${chain?.baseApiUrl}/collections/top-selling/v1`)

  if (options) {
    setParams(path, options)
  }

  const { data: topSellingData, ...topSellingSwr } = useSWR<
    paths['/collections/top-selling/v1']['get']['responses']['200']['schema']
  >(
    path.href ? [path.href, chain?.apiKey, client?.version] : null,
    null,
    swrOptions
  )

  const ids = topSellingData?.collections?.map((collection) => {
    if (collection.id?.includes(':')) {
      return collection.id.split(':')[0] as string
    }
    return collection.id as string
  })

  const { data: collections, isValidating: isValidatingCollections } =
    useCollections(
      ids && ids.length > 0
        ? { contract: ids, includeMintStages: true }
        : false,
      swrOptions
    )

  const collectionsMap = useMemo(() => {
    return collections.reduce((map, collection) => {
      map[collection.id as string] = collection
      return map
    }, {} as Record<string, (typeof collections)[0]>)
  }, [collections])
  return {
    ...topSellingSwr,
    collections: collectionsMap,
    data: topSellingData,
    isValidating: isValidatingCollections || topSellingSwr.isValidating,
  }
}
