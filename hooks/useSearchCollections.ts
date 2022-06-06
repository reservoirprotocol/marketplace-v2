import useSWR from 'swr'
import { InferFetchedType } from 'types/superset'
import { openApiSWRFetcher, searchCollections } from 'utils/fetcher'
import { paramsToQueryString } from 'utils/params'

type SearchCollectionsResponse = InferFetchedType<
  typeof searchCollections.execute
>

export default function useSearchCollections(query: string, limit: number = 6) {
  if (query.length === 0) {
    return
  }

  const params: SearchCollectionsResponse['parameters']['query'] = {
    name: query,
    limit: limit,
  }

  const queryString = paramsToQueryString(params)

  return useSWR(`${searchCollections.path}?${queryString}`, (url) =>
    openApiSWRFetcher<SearchCollectionsResponse['responses']['200']['schema']>(
      url,
      searchCollections.execute
    )
  )
}
