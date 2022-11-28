const PAGE_SIZE = 20
import { omitBy, isNil, isEmpty } from 'lodash'
import api from '../utils/api'

import useSWRInfinite from 'swr/infinite'

export default function useUserTopBids(address: string, collection: string) {
  const getKey = (
    pageIndex: number,
    previousPageData: any,
    address: any,
    collection: string,
    pageSize: number
  ) => {
    if (previousPageData && previousPageData.length < PAGE_SIZE) return null

    let params = new URLSearchParams(
      omitBy(
        {
          //sortBy: "acquiredAt",
          sortDirection: 'desc',
          continuation: previousPageData?.continuation,
          collection,
          // includeTopBid: true,
          limit: pageSize,
        } as any,
        isNil
      )
    )

    return address
      ? `orders/users/${address}/top-bids/v1?${params.toString()}`
      : null
  }

  const { data, error, isValidating, size, setSize, mutate } = useSWRInfinite(
    (...args) => getKey(...args, address, collection, PAGE_SIZE),
    api
  )

  return {
    data:
      data && data.length
        ? data.reduce((topBids, page) => topBids.concat(page.topBids), [])
        : [],

    error,
    mutate,
    setSize,
    isFinished: data && data[size - 1]?.topBids.length < PAGE_SIZE,
    isLoading: !data || data[size - 1] === undefined,
    size,
    isValidating,
  }
}
