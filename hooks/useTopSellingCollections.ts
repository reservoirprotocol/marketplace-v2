import { useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import { paths } from '@reservoir0x/reservoir-sdk'
import useSWR, { SWRConfiguration } from 'swr'
import { setParams } from '@reservoir0x/reservoir-sdk'

//Temporary workaround until types are returned
type CollectionMetadata = Pick<
  NonNullable<
    paths['/collections/v6']['get']['responses']['200']['schema']['collections']
  >[0],
  'floorAsk' | 'description' | 'banner'
>

export type TopSellingCollectionv2Data = {
  collections: Array<
    NonNullable<
      paths['/collections/top-selling/v1']['get']['responses']['200']['schema']['collections']
    >[0] &
      CollectionMetadata
  >
}

export default function (
  options?: any, //Todo: update type
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
    path.href ? [path.href, chain?.apiKey, client?.version] : null,
    null,
    swrOptions
  )
}
