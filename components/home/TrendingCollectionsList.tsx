import { useCollections } from '@reservoir0x/reservoir-kit-ui'
import { Box } from '../primitives'
import { ComponentPropsWithoutRef, FC } from 'react'
import { TrendingCollectionItem } from './TrendingCollectionItem'

export type TrendingCollections = ReturnType<typeof useCollections>['data']

type Props = {
  collections: TrendingCollections
  volumeKey: ComponentPropsWithoutRef<
    typeof TrendingCollectionItem
  >['volumeKey']
}

const TrendingCollectionsList: FC<Props> = ({ collections, volumeKey }) => {
  return (
    <Box
      css={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        columnGap: 48,
        rowGap: '$5',
        '@bp900': {
          gridTemplateColumns: '1fr 1fr',
        },
        '@bp1100': {
          gridTemplateColumns: '1fr 1fr 1fr',
        },
      }}
    >
      {collections?.map((collection, i) => (
        <TrendingCollectionItem
          key={i}
          collection={collection}
          rank={i + 1}
          volumeKey={volumeKey}
        />
      ))}
    </Box>
  )
}

export default TrendingCollectionsList
