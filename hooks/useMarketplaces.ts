import { paths } from '@reservoir0x/reservoir-sdk'
import { useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import { useEffect, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import useMarketplaceChain from './useMarketplaceChain'
import useSWR from 'swr'

export type Marketplace = NonNullable<
  paths['/admin/get-marketplaces']['get']['responses']['200']['schema']['marketplaces']
>[0] & {
  isSelected: boolean
  price: number | string
  truePrice: number | string
}

export default function (
  royaltyBps?: number
): [Marketplace[], React.Dispatch<React.SetStateAction<Marketplace[]>>] {
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([])
  const client = useReservoirClient()
  const marketplaceChain = useMarketplaceChain()

  const path = new URL(
    `${marketplaceChain?.reservoirBaseUrl}/admin/get-marketplaces`
  )

  const { data } = useSWR<
    paths['/admin/get-marketplaces']['get']['responses']['200']['schema']
  >([path.href, marketplaceChain?.apiKey, client?.version], null, {
    revalidateOnMount: true,
  })

  useEffect(() => {
    if (data && data.marketplaces) {
      let updatedMarketplaces: Marketplace[] =
        data.marketplaces as Marketplace[]

      updatedMarketplaces.forEach((marketplace) => {
        if (marketplace.orderbook === 'opensea') {
          const osFee =
            royaltyBps && royaltyBps >= 50 ? 0 : 50 - (royaltyBps || 0)
          marketplace.fee = {
            bps: osFee,
            percent: osFee / 100,
          }
          marketplace.feeBps = osFee
        }
        marketplace.price = 0
        marketplace.truePrice = 0
      })
      setMarketplaces(updatedMarketplaces)
    }
  }, [data, royaltyBps])

  return [marketplaces, setMarketplaces]
}
