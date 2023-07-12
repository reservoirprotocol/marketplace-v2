import { useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import { paths } from '@reservoir0x/reservoir-sdk'
import { ChainContext } from 'context/ChainContextProvider'
import { useContext } from 'react'
import useSWR from 'swr'

export default () => {
  const client = useReservoirClient()
  const { chain } = useContext(ChainContext)

  const path = `${chain?.reservoirBaseUrl}/chain/stats/v1`

  return useSWR<paths['/chain/stats/v1']['get']['responses']['200']['schema']>(
    path ? [path, chain?.apiKey, client?.version] : null,
    null,
    {}
  )
}
