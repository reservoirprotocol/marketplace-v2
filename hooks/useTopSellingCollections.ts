import { useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import { paths } from '@reservoir0x/reservoir-sdk'
import useSWR, { SWRConfiguration } from 'swr'
import { setParams } from '@reservoir0x/reservoir-sdk'
import useMarketplaceChain from './useMarketplaceChain'

export type TopSellingCollectionv2Data = {
  collections: NonNullable<
    paths['/collections/top-selling/v2']['get']['responses']['200']['schema']['collections']
  >
}

export default function (options?: any, swrOptions: SWRConfiguration = {}) {
  const client = useReservoirClient()
  const { proxyApi } = useMarketplaceChain()

  const path = new URL(
    `${process.env.NEXT_PUBLIC_PROXY_URL}${proxyApi}/collections/top-selling/v2`
  )

  if (options) {
    setParams(path, options)
  }

  return useSWR<TopSellingCollectionv2Data>(
    path.href ? [path.href, client?.apiKey, client?.version] : null,
    null,
    swrOptions
  )
}
