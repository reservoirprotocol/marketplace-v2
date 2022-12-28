import { useCollections } from '@reservoir0x/reservoir-kit-ui'
import { Text, Box, Flex, FormatCryptoCurrency } from '../primitives'
import { formatNumber } from '../../utils/numbers'
import Link from 'next/link'
import { useContext } from 'react'
import { ToastContext } from '../../context/ToastContextProvider'

type CollectionRowProps = {
  rank: string | number
  collection: NonNullable<ReturnType<typeof useCollections>['data']>[0]
}

const CollectionRow = ({ rank, collection }: CollectionRowProps) => {
  return (
    <Link href={`/collections/${collection.id}`}>
      <Flex align="center" css={{ cursor: 'pointer' }}>
        <Box css={{ width: 32, mr: '$4' }}>
          <Text style="h5">{rank}</Text>
        </Box>
        <Box css={{ width: 60, height: 60 }}>
          <img src={collection?.image} style={{ borderRadius: 8 }} />
        </Box>
        <Box css={{ ml: '$4', flex: 1 }}>
          <Text css={{ mb: 4 }} style="subtitle1" as="p">
            {collection?.name}
          </Text>
          <Flex>
            <Text css={{ mr: '$1', color: '$gray11' }} as="p" style="body2">
              Floor
            </Text>
            <FormatCryptoCurrency
              amount={collection?.floorAsk?.price?.amount?.decimal}
              address={collection?.floorAsk?.price?.currency?.contract}
              decimals={collection?.floorAsk?.price?.currency?.decimals}
            />
          </Flex>
        </Box>

        <Flex css={{ ml: '$4', mr: '$5' }} direction="column" align="end">
          <Text css={{ mb: 4, color: '$green10' }} style="body2" as="p">
            {formatNumber(collection?.volumeChange?.['7day'])}%
          </Text>
          <FormatCryptoCurrency
            amount={collection?.volume?.['7day']}
            maximumFractionDigits={1}
          />
        </Flex>
      </Flex>
    </Link>
  )
}

const TrendingCollectionsList = () => {
  const { data: collections } = useCollections({
    limit: 20,
  })

  return (
    <Box
      css={{
        display: 'grid',
        gridTemplateRows: 'repeat(12, 1fr)',
        '@sm': {
          gridTemplateRows: 'repeat(12, 1fr)',
        },

        '@md': {
          gridTemplateRows: 'repeat(6, 1fr)',
        },

        '@lg': {
          gridTemplateRows: '1fr 1fr 1fr 1fr',
        },

        '@xl': {
          gridTemplateRows: '1fr 1fr 1fr 1fr',
        },
        gridAutoFlow: 'column',
        gap: '$5',
      }}
    >
      {collections &&
        collections
          .slice(0, 12)
          .map((collection, i) => (
            <CollectionRow collection={collection} rank={i + 1} />
          ))}
    </Box>
  )
}

export default TrendingCollectionsList
