import { useCollections } from '@reservoir0x/reservoir-kit-ui'
import { Box, Flex } from '../primitives'
import { ComponentPropsWithoutRef, FC } from 'react'
import { TrendingCollectionItem } from './TrendingCollectionItem'
import LoadingSpinner from 'components/common/LoadingSpinner'

export type TrendingCollections = ReturnType<typeof useCollections>['data']

type Props = {
  collections: TrendingCollections
  loading?: boolean
  volumeKey: ComponentPropsWithoutRef<
    typeof TrendingCollectionItem
  >['volumeKey']
}

const TrendingCollectionsList: FC<Props> = ({
  collections,
  volumeKey,
  loading,
}) => {
  return (
    <Box
      css={{
        position: 'relative',
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
      {loading && (
        <Flex
          css={{ width: '100%', height: '100%', position: 'absolute' }}
          align="center"
          justify="center"
        >
          <Box
            css={{
              inset: 0,
              position: 'absolute',
              background: '$slate1',
              opacity: 0.9,
            }}
          ></Box>
          <LoadingSpinner />
        </Flex>
      )}
    </Box>
  )
}

export default TrendingCollectionsList
