import { ListModal } from '@reservoir0x/reservoir-kit-ui'
import { ComponentPropsWithoutRef } from 'react'

export type ListingCurrencies = ComponentPropsWithoutRef<
  typeof ListModal
>['currencies']

export const currencies: ListingCurrencies = [
  {
    contract: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    coinGeckoId: 'ethereum',
    symbol: 'ETH',
  },
  {
    contract: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
    decimals: 18,
    coinGeckoId: 'weth',
    symbol: 'WETH',
  },
]
