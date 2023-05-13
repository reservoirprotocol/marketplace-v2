import { setParams } from '@nftearth/reservoir-sdk'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import fetcher from 'utils/fetcher'
import { useSWRConfig } from "swr";
import { useState } from "react";

export default function (
    options?: any,
    swrOptions: SWRInfiniteConfiguration = {}
) {
    const [keys, setKeys] = useState<string[]>([])
    const { mutate: globalMutate } = useSWRConfig()
    const response = useSWRInfinite(
        (pageIndex, previousPageData) => {
            if (!options) {
                return null
            }

            const url = new URL(`${process.env.NEXT_PUBLIC_HOST_URL}/api/quest/top`)
            let query = { ...options }

            if (previousPageData && previousPageData?.data?.length) {
                query.page = pageIndex + 1;
            } else if (previousPageData && !previousPageData?.data?.length) {
                return null
            }

            setParams(url, query)
            return [url.href]
        },
        fetcher,
        swrOptions
    );

    const scores = response.data?.flatMap((page) => page?.data || []) ?? []
    const { size, error, setSize, mutate } = response
    const data = response.data as any
    let hasNextPage: boolean
    hasNextPage = size === 0 || Boolean(data?.[size - 1]?.data?.length)
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
        data: scores,
    }
}