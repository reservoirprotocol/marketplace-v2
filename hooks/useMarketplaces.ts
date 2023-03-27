import { useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import { paths } from '@reservoir0x/reservoir-sdk'
import { useEffect, useState } from 'react'

import useSWRImmutable from 'swr/immutable'

export type Marketplace = NonNullable<
  paths['/admin/get-marketplaces']['get']['responses']['200']['schema']['marketplaces']
>[0] & {
  isSelected: boolean
  price: number | string
  truePrice: number | string
}

export default function (
  royaltyBps?: number,
  chainId?: number
): [Marketplace[], React.Dispatch<React.SetStateAction<Marketplace[]>>] {
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([])
  const client = useReservoirClient()
  const chain =
    chainId !== undefined
      ? client?.chains.find((chain) => chain.id === chainId)
      : client?.currentChain()
  const path = new URL(`${chain?.baseApiUrl}/admin/get-marketplaces`)

  const { data } = useSWRImmutable<
    paths['/admin/get-marketplaces']['get']['responses']['200']['schema']
  >([path.href, chain?.apiKey, client?.version], null)

  useEffect(() => {
    if (data && data.marketplaces) {
      const updatedMarketplaces: Marketplace[] = data.marketplaces.map(
        (marketplace) => {
          let fee = marketplace.fee
          let feeBps = marketplace.feeBps
          if (marketplace.orderbook === 'opensea') {
            const osFee =
              royaltyBps && royaltyBps >= 50 ? 0 : 50 - (royaltyBps || 0)
            fee = {
              bps: osFee,
              percent: osFee / 100,
            }
            feeBps = osFee
          }

          return {
            ...marketplace,
            fee,
            feeBps,
            price: 0,
            truePrice: 0,
            isSelected: marketplace.orderbook === 'reservoir',
          }
        }
      )
      setMarketplaces(updatedMarketplaces)
    }
  }, [data, royaltyBps, client, chain])

  return [marketplaces, setMarketplaces]
}
