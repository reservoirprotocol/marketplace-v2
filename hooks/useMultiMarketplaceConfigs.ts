import { ReservoirChain, paths } from '@reservoir0x/reservoir-sdk'
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
  const urls = collectionIds.map(
    (id) =>
      `${chain?.baseApiUrl}/collections/${id}/marketplace-configurations/v1`
  )
  const { data, error } = useSWR<MarketplaceConfigurationsResponse[]>(
    enabled ? urls : null,
    fetcher
  )

  return {
    data: data,
    isError: !!error,
    isLoading: !data && !error,
  }
}
