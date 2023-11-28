import { ReservoirChain, paths } from '@reservoir0x/reservoir-sdk'
import useMarketplaceChain from 'hooks/useMarketplaceChain'
import { useMemo } from 'react'
import useSWR from 'swr/immutable'

// type MarketplaceConfigurationsResponse =
//   paths['/collections/{collection}/marketplace-configurations/v1']['get']['responses']['200']['schema']
type MarketplaceConfigurationsResponse = any

const fetcher = async (urls: string[]) => {
  const fetches = urls.map((url) =>
    fetch(url)
      .then((r) => r.json())
      .catch(() => undefined)
  )
  const results = await Promise.allSettled(fetches)
  return results.map((result) =>
    result.status === 'fulfilled' ? result.value : undefined
  )
}

export default function (
  collectionIds: string[],
  chain?: ReservoirChain | null | undefined,
  enabled: boolean = true
) {
  const marketplaceChain = useMarketplaceChain()
  const urls = collectionIds.map(
    (id) =>
      `${
        chain?.baseApiUrl || marketplaceChain.reservoirBaseUrl
      }/collections/${id}/marketplace-configurations/v1`
  )
  const { data, error } = useSWR<MarketplaceConfigurationsResponse[]>(
    enabled ? urls : null,
    fetcher
  )

  const collectionExchanges = useMemo(() => {
    return (
      data?.reduce((exchanges, data, i) => {
        const reservoirMarketplace = data.marketplaces.find(
          //@ts-ignore
          (marketplace) => marketplace.orderbook === 'reservoir'
        )
        exchanges[collectionIds[i]] = Object.values(
          reservoirMarketplace.exchanges
          //@ts-ignore
        ).find((exchange) => exchange?.enabled)
        return exchanges
      }, {}) || {}
    )
  }, [data])

  return {
    data: data,
    collectionExchanges,
    isError: !!error,
    isLoading: !data && !error,
  }
}
