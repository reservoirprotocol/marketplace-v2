import React, { FC } from 'react'
import { Flex, Box } from 'components/primitives'
import Token from './Token'
import Stat from '../Modal/Stat'
import ListingStat from './ListingStat'
import { ListingData } from './ListModalRenderer'
import { Currency } from 'types/currency'
import { Token as TokenType, Collection as CollectionType, Marketplace } from 'types/workaround'
import { marketplaceInfo } from 'constants/common'

type Props = {
  token?: TokenType
  collection?: CollectionType
  listingData: ListingData
  currency: Currency
}

const TokenListingDetails: FC<Props> = ({
  token,
  collection,
  listingData,
  currency,
}) => (
  <Flex
    css={{
      width: '100%',
      flexDirection: 'row',
      '@bp600': {
        width: 220,
        flexDirection: 'column',
      },
      p: '$4',
    }}
  >
    <Token collection={collection} token={token} />
    <Box
      css={{
        flex: 1,
        mt: '$4',
        [`& ${Stat}:not(:last-child)`]: {
          mb: '$1',
        },
        mb: '$3',
      }}
    >
      <ListingStat
        listing={listingData}
        currency={currency}
      />
    </Box>
  </Flex>
)

export default TokenListingDetails
