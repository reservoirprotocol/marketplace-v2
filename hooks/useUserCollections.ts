import useMarketplaceChain from 'hooks/useMarketplaceChain'
import { omitBy, isNil } from 'lodash'

import useSWRInfinite from 'swr/infinite'
import fetcher from 'utils/fetcher'
const PAGE_SIZE = 20

export default function useUserCollections(address: string) {
  const { reservoirBaseUrl } = useMarketplaceChain()
  const getKey = (
    pageIndex: number,
    previousPageData: any,
    address: any,
    pageSize: number,
    baseUrl: string
  ) => {
    if (previousPageData && previousPageData.length < PAGE_SIZE) return null

    let params = new URLSearchParams(
      omitBy(
        {
          offset: pageIndex * pageSize,
          includeTopBid: true,
          limit: pageSize,
        } as any,
        isNil
      )
    )

    return address
      ? `${baseUrl}/users/${address}/collections/v2?${params.toString()}`
      : null
  }

  const { data, error, isValidating, size, setSize } = useSWRInfinite(
    (...args) => getKey(...args, address, PAGE_SIZE, reservoirBaseUrl),
    fetcher
  )

  return {
    data:
      data && data.length
        ? data.reduce(
            (collections, page) => collections.concat(page.data.collections),
            []
          )
        : [],

    error,
    setSize,
    isFinished: data && data[size - 1]?.data.collections.length < PAGE_SIZE,
    isLoading: !data || data[size - 1] === undefined,
    size,
    isValidating,
  }
}
