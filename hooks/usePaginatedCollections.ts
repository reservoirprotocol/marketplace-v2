import { useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import { paths, setParams } from '@reservoir0x/reservoir-sdk'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'

type CollectionResponse =
  paths['/collections/v5']['get']['responses']['200']['schema']

type CollectionsQuery = paths['/collections/v5']['get']['parameters']['query']

export default function (
  options?: CollectionsQuery | false,
  swrOptions: SWRInfiniteConfiguration = {}
) {
  const client = useReservoirClient()

  const { data, mutate, error, isValidating, size, setSize } =
    useSWRInfinite<CollectionResponse>(
      (pageIndex, previousPageData) => {
        if (!options) {
          return null
        }

        const url = new URL(`${client?.apiBase}/collections/v5`)
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
        return url.href
      },
      (resource: string) => {
        const headers: HeadersInit = {
          'x-rkui-version': client?.version || '',
        }
        if (client?.apiKey) {
          headers['x-api-key'] = client?.apiKey
        }
        if (client?.version) {
          headers['x-rkc-version'] = client?.version
        }
        return fetch(resource, {
          headers,
        })
          .then((res) => res.json())
          .catch((e) => {
            throw e
          })
      },
      {
        revalidateOnMount: true,
        revalidateFirstPage: false,
        ...swrOptions,
      }
    )

  const collections = data?.flatMap((page) => page?.collections || []) ?? []
  const hasNextPage = Boolean(data?.[size - 1]?.continuation)
  const isFetchingInitialData = !data && !error
  const isFetchingPage =
    isFetchingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined')
  const fetchNextPage = () => {
    if (!isFetchingPage && hasNextPage) {
      setSize((size) => size + 1)
    }
  }

  return {
    response: data,
    data: collections,
    hasNextPage,
    isFetchingInitialData,
    isFetchingPage,
    fetchNextPage,
    setSize,
    mutate,
    error,
    isValidating,
  }
}
