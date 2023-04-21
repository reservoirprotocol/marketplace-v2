import { useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import { paths } from '@reservoir0x/reservoir-sdk'
import { ChainContext } from 'context/ChainContextProvider'
import { useContext } from 'react'
import useSWR from 'swr'

export default (collectionId?: string) => {
  const client = useReservoirClient()
  const { chain } = useContext(ChainContext)

  const path = collectionId
    ? new URL(
        `${chain?.reservoirBaseUrl}/collections/${collectionId}/supported-marketplaces/v1`
      )
    : null

  const { data } = useSWR<
    paths['/collections/{collection}/supported-marketplaces/v1']['get']['responses']['200']['schema']
  >(path ? [path.href, chain?.apiKey, client?.version] : null, null, {})

  let openseaFees

  if (data?.marketplaces) {
    openseaFees = data?.marketplaces.filter(
      (marketplace: any) => marketplace.name === 'OpenSea'
    )[0]
  }

  return openseaFees
}
