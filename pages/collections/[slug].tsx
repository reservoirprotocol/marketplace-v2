import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import { Text, Flex, Box } from '../../components/primitives'
import {
  useCollections,
  useTokens,
  useAttributes,
} from '@reservoir0x/reservoir-kit-ui'
import { paths } from '@reservoir0x/reservoir-kit-client'
import Layout from 'components/Layout'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { truncateAddress } from 'utils/truncate'
import StatHeader from 'components/collections/StatHeader'
import CollectionActions from 'components/collections/CollectionActions'
import TokenCard from 'components/collections/TokenCard'
import { Filters } from 'components/collections/filters/Filters'
import { FilterButton } from 'components/collections/filters/FilterButton'
import SelectedAttributes from 'components/collections/filters/SelectedAttributes'
import { CollectionOffer } from 'components/collections/CollectionOffer'
import { Grid } from 'components/primitives/Grid'
import { useIntersectionObserver } from 'usehooks-ts'
import fetcher from 'utils/fetcher'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const IndexPage: NextPage<Props> = ({ id, ssr }) => {
  const [attributeFiltersOpen, setAttributeFiltersOpen] = useState(false)
  const [playingElement, setPlayingElement] = useState<
    HTMLAudioElement | HTMLVideoElement | null
  >()
  const loadMoreRef = useRef<HTMLDivElement>()
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {
    rootMargin: '0px 0px 300px 0px',
  })

  const { data: collections } = useCollections(
    {
      id,
      includeTopBid: true,
    },
    {
      fallback: ssr.collection,
    }
  )

  let collection = collections && collections[0]
  const {
    data: tokens,
    mutate,
    fetchNextPage,
  } = useTokens(
    {
      collection: id,
    },
    {
      fallback: ssr.tokens,
    }
  )

  let { data: attributes } = useAttributes(collection?.id)
  console.log(attributes)

  const rarityEnabledCollection =
    collection?.tokenCount &&
    +collection.tokenCount >= 2 &&
    attributes?.length >= 2

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      fetchNextPage()
    }
  }, [loadMoreObserver?.isIntersecting])

  return (
    <Layout>
      {collection ? (
        <Flex direction="column" css={{ p: '$5', pb: 0 }}>
          <Flex justify="between" css={{ mb: '$4' }}>
            <Flex direction="column" css={{ gap: '$4', minWidth: 0 }}>
              <Flex css={{ gap: '$4', flex: 1 }} align="center">
                <img
                  src={collection.image}
                  style={{ width: 64, height: 64, borderRadius: 8 }}
                />
                <Box css={{ minWidth: 0 }}>
                  <Text style="h5" as="h6" ellipsify>
                    {collection.name}
                  </Text>
                  <Text style="body2" css={{ color: '$gray11' }} as="p">
                    {truncateAddress(collection.id)}
                  </Text>
                </Box>
              </Flex>
            </Flex>
            <CollectionActions collection={collection} />
          </Flex>
          <StatHeader collection={collection} />
          <Flex
            css={{
              borderBottom: '1px solid $gray5',
              mt: '$5',
              mb: '$4',
              gap: '$5',
            }}
          >
            <Box css={{ pb: '$3', borderBottom: '1px solid $accent' }}>
              <Text style="h6">Items</Text>
            </Box>

            <Box>
              <Text style="h6">Activity</Text>
            </Box>
          </Flex>

          <Flex css={{ gap: attributeFiltersOpen && '$5' }}>
            <Filters
              attributes={attributes}
              open={attributeFiltersOpen}
              setOpen={setAttributeFiltersOpen}
            />
            <Box
              css={{
                flex: 1,
                pb: '$5',
              }}
            >
              <Flex justify="between" css={{ marginBottom: '$4' }}>
                {attributes && attributes.length > 0 && (
                  <FilterButton
                    open={attributeFiltersOpen}
                    setOpen={setAttributeFiltersOpen}
                  />
                )}
                <CollectionOffer collection={collection} />
              </Flex>
              <SelectedAttributes />
              <Grid
                css={{
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '$4',
                }}
              >
                {tokens.map((token, i) => (
                  <TokenCard
                    key={i}
                    token={token}
                    mutate={mutate}
                    rarityEnabled={rarityEnabledCollection}
                    onMediaPlayed={(e) => {
                      if (
                        playingElement &&
                        playingElement !== e.nativeEvent.target
                      ) {
                        playingElement.pause()
                      }
                      const element =
                        (e.nativeEvent.target as HTMLAudioElement) ||
                        (e.nativeEvent.target as HTMLVideoElement)
                      if (element) {
                        setPlayingElement(element)
                      }
                    }}
                  />
                ))}
                <div ref={loadMoreRef}></div>
              </Grid>
            </Box>
          </Flex>
        </Flex>
      ) : (
        <Box />
      )}
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<{
  collectionId?: string
  ssr: {
    collection: paths['/collections/v5']['get']['responses']['200']['schema']
    tokens: paths['/tokens/v5']['get']['responses']['200']['schema']
  }
  id: string | undefined
}> = async ({ params }) => {
  const id = params?.slug?.toString()

  let collectionQuery: paths['/collections/v5']['get']['parameters']['query'] =
    {
      id,
      includeTopBid: true,
    }

  const collectionsResponse = await fetcher('/collectins/v5', collectionQuery)
  const collection: Props['ssr']['collection'] = collectionsResponse['data']

  let tokensQuery: paths['/tokens/v5']['get']['parameters']['query'] = {
    collection: id,
    sortBy: 'floorAskPrice',
    includeTopBid: false,
    limit: 20,
  }

  const tokensResponse = await fetcher('/tokens/v5', tokensQuery)

  const tokens: Props['ssr']['tokens'] = tokensResponse['data']

  return {
    props: { ssr: { collection, tokens }, id },
    revalidate: 20,
  }
}

export default IndexPage
