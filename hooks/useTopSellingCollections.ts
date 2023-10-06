import { useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import { paths } from '@reservoir0x/reservoir-sdk'
import useSWR, { SWRConfiguration } from 'swr'
import { setParams } from '@reservoir0x/reservoir-sdk'

export type TopSellingCollectionv2Data = {
  collections: NonNullable<
    paths['/collections/top-selling/v2']['get']['responses']['200']['schema']['collections']
  >
}

export default function (
  options?: any,
  swrOptions: SWRConfiguration = {},
  chainId?: number
) {
  const client = useReservoirClient()
  const chain =
    chainId !== undefined
      ? client?.chains.find((chain) => chain.id === chainId)
      : client?.currentChain()

  const path = new URL(`${chain?.baseApiUrl}/collections/top-selling/v2`)

  if (options) {
    setParams(path, options)
  }

  return useSWR<TopSellingCollectionv2Data>(
    path.href ? [path.href, client?.apiKey, client?.version] : null,
    null,
    swrOptions
  )
}
