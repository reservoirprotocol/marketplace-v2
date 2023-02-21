import { paths, setParams } from '@nftearth/reservoir-sdk'
import { SWRInfiniteConfiguration } from 'swr/infinite'
import {DefaultChain} from "utils/chains";
import useInfiniteApi from "./useInfiniteApi";
import {useReservoirClient} from "@nftearth/reservoir-kit-ui";

type CollectionResponse =
  paths['/collections/v5']['get']['responses']['200']['schema']

type CollectionsQuery = paths['/collections/v5']['get']['parameters']['query']

export default function (
  chain:  typeof DefaultChain,
  options?: CollectionsQuery | false,
  swrOptions: SWRInfiniteConfiguration = {}
) {
  const client = useReservoirClient();
  const reservoirChain = client?.chains.find(
    (chain) => chain.id === chain.id
  )

  const response = useInfiniteApi<CollectionResponse>(
    (pageIndex, previousPageData) => {
      if (!options) {
        return null
      }

      const url = new URL(`${chain?.proxyApi}/collections/v5`)
      let query: CollectionsQuery = { ...options }

      if (previousPageData && !previousPageData.continuation) {
        return null
      } else if (previousPageData && pageIndex > 0) {
        query.continuation = previousPageData.continuation
      }

      if (
        query.normalizeRoyalties === undefined &&
        client?.normalizeRoyalties !== undefined
      ) {
        query.normalizeRoyalties = client.normalizeRoyalties
      }

      setParams(url, query)
      return [url.href, reservoirChain?.apiKey, client?.version]
    },
    {
      revalidateOnMount: true,
      revalidateFirstPage: false,
      ...swrOptions,
    }
  )

  const collections =
    response.data?.flatMap((page) => page?.collections || []) ?? []

  return {
    ...response,
    data: collections,
  }
}
