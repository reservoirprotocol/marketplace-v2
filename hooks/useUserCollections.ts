import { omitBy, isNil } from 'lodash'
import api from '../utils/api'

import useSWRInfinite from 'swr/infinite'
const PAGE_SIZE = 20

export default function useUserCollections(address: string) {
  const getKey = (
    pageIndex: number,
    previousPageData: any,
    address: any,
    pageSize: number
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
      ? `users/${address}/collections/v2?${params.toString()}`
      : null
  }

  const { data, error, isValidating, size, setSize } = useSWRInfinite(
    (...args) => getKey(...args, address, PAGE_SIZE),
    api
  )

  return {
    data:
      data && data.length
        ? data.reduce(
            (collections, page) => collections.concat(page.collections),
            []
          )
        : [],

    error,
    setSize,
    isFinished: data && data[size - 1]?.collections.length < PAGE_SIZE,
    isLoading: !data || data[size - 1] === undefined,
    size,
    isValidating,
  }
}
