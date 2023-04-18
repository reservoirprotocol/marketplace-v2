import React, { FC } from 'react'
import { Flex, Text, FormatCryptoCurrency } from 'components/primitives'
import { styled } from 'stitches.config'
import { Currency } from 'types/currency'
import { useTimeSince } from 'hooks'
import { ListingData } from './ListModalRenderer'
import { marketplaceInfo } from 'constants/common'

const Img = styled('img', {
  width: 16,
  height: 16,
})

type Props = {
  listing: ListingData
  currency: Currency
}

const ListingStat: FC<Props> = ({ listing, currency, ...props }) => {
  const timeSince = useTimeSince(
    listing?.endTime ? Number(listing.endTime) : 0
  )

  return (
    <Flex
      direction="column"
      className="rk-stat-well"
      css={{
        backgroundColor: '$wellBackground',
        p: '$2',
        borderRadius: '$borderRadius',
        gap: '$1',
      }}
      {...props}
    >
      <Flex justify="between">
        <FormatCryptoCurrency
          amount={listing?.price}
          textStyle="subtitle2"
          address={currency.contract}
          decimals={currency.decimals}
        />
        <Img src={marketplaceInfo.imageUrl} />
      </Flex>
      <Text style="subtitle2" color="subtle" as="p" css={{ flex: 1 }}>
        {listing?.endTime ? `Expires ${timeSince}` : 'No Expiration'}
      </Text>
    </Flex>
  )
}

ListingStat.toString = () => '.rk-stat-well'

export default ListingStat
