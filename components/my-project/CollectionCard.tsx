import {Text, Box, Flex} from '../primitives'
import Link from 'next/link'
import {FC} from 'react'
import {TrendingCollections} from 'components/home/TrendingCollectionsList'
import {CollectionDropdown} from "./CollectionDropdown";

type Props = {
  collection: NonNullable<TrendingCollections>[0]
  routePrefix: string
  heroImg: string
}

export const CollectionCard: FC<Props> = ({collection, routePrefix, heroImg}) => {
  return (
    <Flex
      css={{
        position: 'relative',
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
      <Link href={`/my-project/${routePrefix}/${collection.id}`} style={{display: 'flex', flex: 1, justifyItems: 'center' }}>
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

          <Box css={{textAlign: 'center', mt: '$4'}}>
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
      </Link>
      <Box css={{position: 'absolute', bottom: 20, right: 20}}>
        <CollectionDropdown id={collection?.id} name={collection?.name} slug={collection?.slug}/>
      </Box>
    </Flex>
  )
}
