import { useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import { paths } from '@reservoir0x/reservoir-sdk'
import { ChainContext } from 'context/ChainContextProvider'
import { useContext } from 'react'
import useSWR from 'swr'

export default ({ collectionId }: any) => {
  const client = useReservoirClient()
  const { chain } = useContext(ChainContext)

  const path = `${chain?.reservoirBaseUrl}/collections/${collectionId}/supported-marketplaces/v1`

  return useSWR<
    paths['/collections/{collection}/supported-marketplaces/v1']['get']['responses']['200']['schema']
  >(path ? [path, client?.apiKey, client?.version] : null, null, {})
}
