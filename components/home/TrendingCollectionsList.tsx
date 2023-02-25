import { useCollections } from '@nftearth/reservoir-kit-ui'
import { Box, Flex, Text } from '../primitives'
import { ComponentPropsWithoutRef, FC } from 'react'
import { TrendingCollectionItem } from './TrendingCollectionItem'
import LoadingSpinner from 'components/common/LoadingSpinner'
import {DefaultChain} from "../../utils/chains";

export type TrendingCollections = ReturnType<typeof useCollections>['data']

type Props = {
  uniqueKey: string,
  chain: typeof DefaultChain,
  collections: TrendingCollections
  loading?: boolean
  volumeKey?: ComponentPropsWithoutRef<
    typeof TrendingCollectionItem
  >['volumeKey']
}

const TrendingCollectionsList: FC<Props> = ({
  uniqueKey,
  chain,
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
          .map((_, i) => (
            <Flex justify="between" key={`label-${i}`}>
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
              key={`${uniqueKey}${collection.id}`}
              chain={chain}
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
            />
            <LoadingSpinner />
          </Flex>
        )}
      </Box>
    </Box>
  )
}

export default TrendingCollectionsList
