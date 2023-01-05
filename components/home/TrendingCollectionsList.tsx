import { useCollections } from '@reservoir0x/reservoir-kit-ui'
import { Box } from '../primitives'
import { FC } from 'react'
import { TrendingCollectionItem } from './TrendingCollectionItem'

type Props = {
  collections: ReturnType<typeof useCollections>['data']
}

const TrendingCollectionsList: FC<Props> = ({ collections }) => {
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
        <TrendingCollectionItem key={i} collection={collection} rank={i + 1} />
      ))}
    </Box>
  )
}

export default TrendingCollectionsList
