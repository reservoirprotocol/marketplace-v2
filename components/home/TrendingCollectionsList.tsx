import { useCollections } from '@reservoir0x/reservoir-kit-ui'
import { Box, Flex, Text } from '../primitives'
import { ComponentPropsWithoutRef, FC } from 'react'
import { TrendingCollectionItem } from './TrendingCollectionItem'
import LoadingSpinner from 'components/common/LoadingSpinner'
import { display } from '@datadog/browser-core'

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
    <Box>
      <Box
        css={{
          position: 'relative',
          mb: '$3',
          display: 'grid',
          gridTemplateColumns: '1fr',
          columnGap: 48,
          rowGap: '$5',
          'div:not(:first-child)': {
            display: 'none',
          },
          '@bp900': {
            gridTemplateColumns: '1fr 1fr',
            'div:not(:first-child)': {
              display: 'flex',
            },
            'div:last-child': { display: 'none' },
          },
          '@bp1100': {
            gridTemplateColumns: '1fr 1fr 1fr',
            'div:last-child': { display: 'flex' },
          },
        }}
      >
        {Array(3)
          .fill(null)
          .map(() => (
            <Flex justify="between">
              <Text style="subtitle3" color="subtle">
                Collection
              </Text>
              <Text style="subtitle3" color="subtle">
                Volume
              </Text>
            </Flex>
          ))}
      </Box>
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
                background: '$neutralBg',
                opacity: 0.9,
              }}
            ></Box>
            <LoadingSpinner />
          </Flex>
        )}
      </Box>
    </Box>
  )
}

export default TrendingCollectionsList
