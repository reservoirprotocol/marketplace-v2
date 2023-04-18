import React from 'react'

import {
  Flex,
  Box,
  Input,
  FormatCurrency,
  Text,
  FormatCryptoCurrency,
  CryptoCurrencyIcon
} from 'components/primitives'

import { Currency } from 'types/currency'
import { Collection, Marketplace } from 'types/workaround'
import { marketplaceInfo } from 'constants/common'

type MarketPlaceInputProps = {
  price: string,
  collection?: Collection
  currency: Currency
  quantity?: number
  onChange: (e: any) => void
}

const MarketplacePriceInput = ({
  price,
  collection,
  currency,
  quantity = 1,
  onChange,
  ...props
}: MarketPlaceInputProps) => {
  let profit =
    (1 -
      // TO-DO: minus market fee here
      // (marketplace?.fee?.percent || 0) / 100  
      (collection?.royalties?.bps || 0) * 0.0001) *
    Number(price || 0) *
    quantity
  100

  return (
    <Flex {...props} align="center">
      <Box css={{ mr: '$2' }}>
        <img
          src={marketplaceInfo.imageUrl}
          style={{ height: 32, width: 32, borderRadius: 4 }}
        />
      </Box>
      <Flex align="center">
        <Box
          css={{
            width: 'auto',
            height: 20,
          }}
        >
          <CryptoCurrencyIcon
            css={{ height: 18 }}
            address={currency.contract}
          />
        </Box>

        <Text style="body1" color="subtle" css={{ ml: '$1', mr: '$4' }} as="p">
          {currency.symbol}
        </Text>
      </Flex>
      <Box css={{ flex: 1 }}>
        <Input
          type="number"
          value={+price}
          onChange={onChange}
          placeholder="Enter a listing price"
        />
      </Box>
      <Flex direction="column" align="end" css={{ ml: '$3' }}>
        <FormatCryptoCurrency
          amount={profit}
          address={currency.contract}
          decimals={currency.decimals}
          textStyle="h6"
          logoHeight={18}
        />
        <FormatCurrency
          // TO-DO: using usdPrice later
          amount={profit * 0}
          style="subtitle2"
          color="subtle"
        />
      </Flex>
    </Flex>
  )
}

export default MarketplacePriceInput
