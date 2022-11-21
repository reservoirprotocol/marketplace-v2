import { useState } from 'react'
import { useCollections } from '@reservoir0x/reservoir-kit-ui'
import Box from './primitives/Box'
import Flex from './primitives/Flex'
import Text from './primitives/Text'
import FormatEth from './FormatEth'
import { formatNumber } from '../lib/numbers'

const CollectionRow = ({ rank, collection }) => {
  return (
    <Flex align="center">
      <Box css={{ width: 32, mr: '$4' }}>
        <Text style="h5">{rank}</Text>
      </Box>
      <Box css={{ width: 60, height: 60 }}>
        <img src={collection.image} style={{ borderRadius: 8 }} />
      </Box>
      <Box css={{ ml: '$4', flex: 1 }}>
        <Text css={{ mb: 4 }} style="subtitle1" as="p">
          {collection.name}
        </Text>
        <Flex>
          <Text css={{ mr: '$1', color: '$gray11' }} as="p" style="body2">
            Floor
          </Text>
          <FormatEth amount={collection.floorAsk.price.amount.native} />
        </Flex>
      </Box>

      <Flex css={{ ml: '$4', mr: '$5' }} direction="column" align="end">
        <Text css={{ mb: 4, color: '$green10' }} style="body2" as="p">
          {formatNumber(collection.volumeChange['7day'])}%
        </Text>

        <FormatEth
          amount={collection.volume['7day']}
          maximumFractionDigits={1}
        />
      </Flex>
    </Flex>
  )
}

const TrendingCollectionsList = ({ ...props }) => {
  const [timePeriod, setTimePeriod] = useState('7DayVolume')

  const { data: collections } = useCollections({})

  return (
    <Box
      css={{
        display: 'grid',
        gridTemplateRows: 'repeat(12, 1fr)',
        '@bp1': {
          gridTemplateRows: 'repeat(12, 1fr)',
        },

        '@bp2': {
          gridTemplateRows: 'repeat(6, 1fr)',
        },

        '@bp3': {
          gridTemplateRows: '1fr 1fr 1fr 1fr',
        },

        '@bp4': {
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
