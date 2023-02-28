import { paths, setParams } from '@nftearth/reservoir-sdk'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import {DefaultChain} from "utils/chains";
import fetcher from 'utils/fetcher'
import {useSWRConfig} from "swr";
import {useState} from "react";

type LaunchpadQuery = paths['/launchpads/v1']['get']['parameters']['query']

export default function (
  chain:  typeof DefaultChain,
  options?: LaunchpadQuery | false,
  swrOptions: SWRInfiniteConfiguration = {}
) {
  const [keys, setKeys] = useState<string[]>([])
  const { mutate: globalMutate } = useSWRConfig()
  const response = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (!options) {
        return null
      }

      const url = new URL(`${process.env.NEXT_PUBLIC_HOST_URL}${chain?.proxyApi}/launchpads/v1`)
      let query: LaunchpadQuery = { ...options }

      if (previousPageData && !previousPageData?.data?.owners?.length) {
        return null
      } else if (previousPageData && pageIndex > 0) {
        query.continuation = previousPageData.data.continuation;
      }

      setParams(url, query)
      return [url.href]
    },
    fetcher,
    swrOptions
  );

  const owners = response.data?.flatMap((page) => page?.data?.launchpads || []) ?? []
  const { size, error, setSize, mutate } = response
  const data = response.data as any
  let hasNextPage: boolean
  hasNextPage = size === 0 || Boolean(data?.[size - 1]?.data?.launchpads?.length)
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
    isFetchingPage,
    isFetchingInitialData,
    fetchNextPage,
    resetCache,
    data: owners,
  }
}
