import { paths } from '@reservoir0x/reservoir-sdk'
import { useMemo } from 'react'
import useSWR from 'swr/immutable'
import { setParams } from '@reservoir0x/reservoir-sdk'
import useMarketplaceChain from './useMarketplaceChain'

type MarketplaceConfigurationsResponse =
  paths['/collections/{collection}/marketplace-configurations/v1']['get']['responses']['200']['schema']
type MarketplaceConfigurationsParams =
  paths['/collections/{collection}/marketplace-configurations/v1']['get']['parameters']['query']
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

export default function (tokens: string[], enabled: boolean = true) {
  const marketplaceChain = useMarketplaceChain()
  const urls = tokens.map((id) => {
    const pieces = id.split(':')
    const tokenId = pieces[pieces.length - 1]
    const collectionId = pieces.slice(0, -1).join(':')
    let url = new URL(
      `${marketplaceChain.reservoirBaseUrl}/collections/${collectionId}/marketplace-configurations/v1`
    )
    setParams(url, {
      tokenId,
    } as MarketplaceConfigurationsParams)
    return url.href
  })
  const { data, error } = useSWR<MarketplaceConfigurationsResponse[]>(
    enabled ? urls : null,
    fetcher
  )

  const tokenExchanges = useMemo(() => {
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

          const key = tokens[i]

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
    tokenExchanges,
    isError: !!error,
    isLoading: !data && !error,
  }
}
