import { useState } from 'react'
import { useSWRConfig } from 'swr'
import useSWRInfinite from 'swr/infinite'
import { SWRInfiniteConfiguration } from 'swr/infinite'

type SWRInfiniteParams = Parameters<typeof useSWRInfinite>

export default function <ResponseType>(
  getKey: SWRInfiniteParams['0'],
  options: SWRInfiniteConfiguration,
  limit?: number
) {
  const { mutate: globalMutate } = useSWRConfig()
  const [keys, setKeys] = useState<string[]>([])
  const response = useSWRInfinite<ResponseType>(
    (pageIndex, previousPageData) => {
      const params = getKey(pageIndex, previousPageData)
      const key = params && params[0] ? params[0] : null
      if (key && !keys.includes(key)) {
        setKeys([...keys, key])
      }
      return params
    },
    null,
    options
  )

  const { size, error, setSize, mutate } = response
  const data = response.data as any
  let hasNextPage: boolean
  if (limit !== undefined) {
    hasNextPage =
      size === 0 || Boolean(data?.[size - 1]?.collections?.length === limit)
  } else {
    hasNextPage = size === 0 || Boolean(data?.[size - 1]?.continuation)
  }
  const isFetchingInitialData = !data && !error && size > 0
  const isFetchingPage =
    size > 0 &&
    (isFetchingInitialData || (data && typeof data[size - 1] === 'undefined'))

  const fetchNextPage = () => {
    if (!isFetchingPage && hasNextPage) {
      setSize((size) => size + 1)
    }
  }

  const resetCache = () => {
    setSize(0)
    return mutate(undefined, {
      revalidate: false,
    }).then(() => {
      globalMutate(
        (key) => {
          const url = key && key[0] ? key[0] : null
          if (url) {
            return keys.includes(url)
          }
          return false
        },
        undefined,
        false
      ).then(() => {
        setKeys([])
      })
    })
  }

  return {
    ...response,
    hasNextPage,
    isFetchingInitialData,
    isFetchingPage,
    resetCache,
    fetchNextPage,
  }
}
