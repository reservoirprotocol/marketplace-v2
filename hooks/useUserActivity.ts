import useSWR from 'swr'
const PAGE_SIZE = 20
import { omitBy, isNil } from 'lodash'

import useSWRInfinite from 'swr/infinite'

const api = async (url: any, data: any = {}) => {
  let response = await fetch(
    `${process.env.NEXT_PUBLIC_RESERVOIR_API_BASE}/${url}`,
    {
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_RESERVOIR_API_KEY,
        ...(data && data.headers),
      },
      ...data,
    }
  )
  let json = await response.json()

  return json
}

export default function useUserCollections(
  address: string,
  types?: string,
  options = {}
) {
  const getKey = (
    pageIndex: number,
    previousPageData: any,
    address: any,
    pageSize: number
  ) => {
    if (previousPageData && previousPageData.activities.length < PAGE_SIZE)
      return null

    let params = new URLSearchParams(
      omitBy(
        {
          limit: pageSize,
          continuation: previousPageData?.continuation,
          users: address,
          types,
        },
        isNil
      )
    )

    return address
      ? `users/activity/v2?${params.toString()}${
          !types
            ? '&types=sale&types=ask&types=bid&types=transfer&types=mint'
            : ''
        }`
      : null
  }

  const { data, error, isValidating, size, setSize } = useSWRInfinite(
    (...args) => getKey(...args, address, PAGE_SIZE),
    api,
    options
  )

  return {
    data:
      data && data.length
        ? data.reduce(
            (activities, page) => activities.concat(page.activities),
            []
          )
        : [],

    error,
    setSize,
    isFinished: data && data[size - 1]?.activities.length < PAGE_SIZE,
    isLoading: !data || data[size - 1] === undefined,
    size,
    isValidating,
  }
}
