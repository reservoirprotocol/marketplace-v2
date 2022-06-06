import { ApiResponse, TypedFetch } from 'openapi-typescript-fetch'
import useSWR from 'swr'
import { InferFetchedType } from 'types/superset'
import { openApiSWRFetcher, searchCollections } from 'utils/fetcher'

type SearchCollectionsResponse = InferFetchedType<
  typeof searchCollections.execute
>

export default function useSearchCollections() {
  const params: SearchCollectionsResponse['parameters']['query'] = {
    name: 't',
    limit: 6,
  }

  const queryString = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join('&')

  return useSWR<ApiResponse<SearchCollectionsResponse['responses']['200']>>(
    `${searchCollections.path}?${queryString}`,
    (url) =>
      openApiSWRFetcher<SearchCollectionsResponse['responses']['200']>(
        url,
        searchCollections.execute
      )
  )
}
