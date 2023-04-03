import { useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import { paths } from '@reservoir0x/reservoir-sdk'
import useSWR from 'swr'

export default (chainId: number) => {
  const client = useReservoirClient()
  const chain = client?.chains?.find((chain) =>
    chainId !== undefined ? chain.id === chainId : chain.default
  )

  const path = new URL(`${chain?.baseApiUrl}/admin/get-marketplaces`)

  // const { data } = useSWR<
  //   paths['']['get']['responses']['200']['schema']
  // >([path.href, chain?.apiKey, client?.version], null)
}
