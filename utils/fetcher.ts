import { paths } from '@reservoir0x/reservoir-kit-client'
import { ApiResponse, Fetcher, TypedFetch } from 'openapi-typescript-fetch'

export const fetcher = Fetcher.for<paths>()

fetcher.configure({
  baseUrl: process.env.NEXT_PUBLIC_RESERVOIR_API_BASE,
})

export const searchCollections = {
  execute: fetcher.path('/search/collections/v1').method('get').create(),
  path: '/search/collections/v1',
}

export const openApiSWRFetcher = async <T>(
  url: string,
  fetcher: TypedFetch<any>
) => {
  const query = new URLSearchParams(url.substring(url.indexOf('?')))
  return (await fetcher(Object.fromEntries(query))) as ApiResponse<T>
}
