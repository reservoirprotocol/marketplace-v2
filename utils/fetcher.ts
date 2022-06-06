import { paths } from '@reservoir0x/client-sdk'
import { ApiResponse, Fetcher, TypedFetch } from 'openapi-typescript-fetch'

export const fetcher = Fetcher.for<paths>()

fetcher.configure({
  baseUrl: process.env.NEXT_PUBLIC_RESERVOIR_API_BASE,
})

// create fetch operations
export const searchCollections = {
  execute: fetcher.path('/search/collections/v1').method('get').create(),
  path: `/search/collections/v1`,
}

export const openApiSWRFetcher = async <T>(
  url: string,
  fetcher: TypedFetch<any>
) => {
  const query = new URLSearchParams(url.substring(url.indexOf('?')))

  const res = (await fetcher(Object.fromEntries(query))) as ApiResponse<T>
  return res
}
// fetch
// searchCollections({
//   name: 'B',
// }).then((data) => {
//   console.log(data)
// })
