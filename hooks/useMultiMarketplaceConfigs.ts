import { ReservoirChain, paths } from '@reservoir0x/reservoir-sdk'
import useMarketplaceChain from 'hooks/useMarketplaceChain'
import { useMemo } from 'react'
import useSWR from 'swr/immutable'

type MarketplaceConfigurationsResponse =
  paths['/collections/{collection}/marketplace-configurations/v1']['get']['responses']['200']['schema']
export type Marketplace = NonNullable<
  NonNullable<MarketplaceConfigurationsResponse['marketplaces']>[0]
>
export type Exchange = NonNullable<
  NonNullable<Marketplace['exchanges']>['string']
>

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
        const reservoirMarketplace = data?.marketplaces?.find(
          (marketplace) => marketplace.orderbook === 'reservoir'
        )

        if (reservoirMarketplace) {
          //CONFIGURABLE: Set your marketplace fee and recipient, (fee is in BPS)
          // Note that this impacts orders created on your marketplace (offers/listings)
          reservoirMarketplace.fee = {
            bps: 250,
          }

          const key = collectionIds[i]

          exchanges[key] = {
            exchange: Object.values(reservoirMarketplace?.exchanges || {}).find(
              (exchange) => exchange?.enabled
            ) as Exchange,
            marketplace: reservoirMarketplace,
          }
        }

        return exchanges
      }, {} as Record<string, { exchange: Exchange; marketplace: Marketplace }>) ||
      {}
    )
  }, [data])

  return {
    data: data,
    collectionExchanges,
    isError: !!error,
    isLoading: !data && !error,
  }
}
