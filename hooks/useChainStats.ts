import { useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import { paths } from '@reservoir0x/reservoir-sdk'
import useMarketplaceChain from './useMarketplaceChain'
import useSWR from 'swr'

export default () => {
  const client = useReservoirClient()
  const { proxyApi } = useMarketplaceChain()

  const path = `${process.env.NEXT_PUBLIC_PROXY_URL}${proxyApi}/chain/stats/v1`

  return useSWR<paths['/chain/stats/v1']['get']['responses']['200']['schema']>(
    path ? [path, client?.apiKey, client?.version] : null,
    null,
    {}
  )
}
