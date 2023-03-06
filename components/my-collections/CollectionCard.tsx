import { Text, Box, Flex } from '../primitives'
import Link from 'next/link'
import { FC } from 'react'
import { TrendingCollections } from 'components/home/TrendingCollectionsList'

type Props = {
  collection: NonNullable<TrendingCollections>[0]
  routePrefix: string
  heroImg: string
}

export const CollectionCard: FC<Props> = ({ collection, routePrefix, heroImg }) => {
  return (
    <Link href={`/my-collections/${routePrefix}/${collection.id}`} style={{ display: 'inline-block', minWidth: 0 }}>
      <Flex
        css={{
          cursor: 'pointer',
          background: '$gray11',
          borderRadius: '20px',
          padding: '10px',
          width: '300px',
          height: '200px',
          alignItems: 'center',
          backgroundImage: `url(/ClaimRewards.png)`,
          backgroundSize: 'cover',
        }}
      >
        <Flex
          css={{
            ml: 'auto',
            mr: 'auto',
            display: 'inline-block',
            alignItems: 'center',
          }}
        >
          <img
            alt={collection?.name}
            src={collection?.image || 'https://via.placeholder.com/56?text='}
            style={{
              borderRadius: 8,
              width: 56,
              marginLeft: 'auto',
              marginRight: 'auto',
              height: 56,
              border: '2px solid $gray11',
              objectFit: 'cover',
              backgroundColor: '#ddd',
            }}
          />

          <Box css={{ textAlign: 'center', mt: '$4' }}>
            <Flex
              align="center"
              css={{
                marginLeft: 'auto',
                marginRight: 'auto',
                gap: '$2',
                width: '90%',
              }}
            >
              <Text style="h5">{collection?.name}</Text>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </Link>
  )
}
