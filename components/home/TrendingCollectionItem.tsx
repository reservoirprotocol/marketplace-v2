import { useCollections } from '@reservoir0x/reservoir-kit-ui'
import { Text, Box, Flex, FormatCryptoCurrency } from '../primitives'
import { formatNumber } from '../../utils/numbers'
import Link from 'next/link'
import { FC } from 'react'
import { TrendingCollections } from 'components/home/TrendingCollectionsList'

type Props = {
  rank: string | number
  collection: TrendingCollections[0]
  volumeKey: '1day' | '7day' | '30day' | 'allTime'
}

export const TrendingCollectionItem: FC<Props> = ({
  rank,
  collection,
  volumeKey,
}) => {
  return (
    <Link
      href={`/collections/${collection.id}`}
      style={{ display: 'inline-block' }}
    >
      <Flex align="center" css={{ cursor: 'pointer' }}>
        <Text css={{ mr: '$4' }} style="subtitle3">
          {rank}
        </Text>
        <img
          src={collection?.image}
          style={{ borderRadius: 8, width: 56, height: 56, objectFit: 'cover' }}
        />
        <Box css={{ ml: '$4', width: '100%', minWidth: 0 }}>
          <Text
            css={{
              mb: 4,
              maxWidth: '80%',
              display: 'inline-block',
            }}
            style="h6"
            ellipsify
          >
            {collection?.name}
          </Text>
          <Flex>
            <Text css={{ mr: '$1', color: '$gray11' }} style="body2">
              Floor
            </Text>
            <FormatCryptoCurrency
              amount={collection?.floorAsk?.price?.amount?.decimal}
              address={collection?.floorAsk?.price?.currency?.contract}
              decimals={collection?.floorAsk?.price?.currency?.decimals}
            />
          </Flex>
        </Box>

        <Flex direction="column" align="end">
          {volumeKey !== 'allTime' && (
            <Text css={{ mb: 4, color: '$green10' }} style="body2" as="p">
              {formatNumber(collection?.volumeChange?.[volumeKey])}%
            </Text>
          )}
          <FormatCryptoCurrency
            amount={collection?.volume?.[volumeKey]}
            maximumFractionDigits={1}
          />
        </Flex>
      </Flex>
    </Link>
  )
}
