import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { Text, Flex, Box, Button } from 'components/primitives'
import TrendingCollectionsList from 'components/home/TrendingCollectionsList'
import Layout from 'components/Layout'
import { ComponentPropsWithoutRef, useState } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import TrendingCollectionsTimeToggle, {
  CollectionsSortingOption,
} from 'components/home/TrendingCollectionsTimeToggle'
import { Footer } from 'components/home/Footer'
import { useMediaQuery } from 'react-responsive'
import { useMarketplaceChain, useMounted } from 'hooks'
import LoadingSpinner from 'components/common/LoadingSpinner'
import { paths } from '@reservoir0x/reservoir-sdk'
import { useCollections } from '@reservoir0x/reservoir-kit-ui'
import fetcher from 'utils/fetcher'
import { NORMALIZE_ROYALTIES, COLLECTION_SET_ID, COMMUNITY } from './_app'
import supportedChains from 'utils/chains'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const IndexPage: NextPage<Props> = ({ ssr }) => {
  const isSSR = typeof window === 'undefined'
  const isMounted = useMounted()
  const compactToggleNames = useMediaQuery({ query: '(max-width: 800px)' })
  const [sortByTime, setSortByTime] =
    useState<CollectionsSortingOption>('1DayVolume')
  const marketplaceChain = useMarketplaceChain()

  let collectionQuery: Parameters<typeof useCollections>['0'] = {
    limit: 12,
    sortBy: sortByTime,
  }

  if (COLLECTION_SET_ID) {
    collectionQuery.collectionsSetId = COLLECTION_SET_ID
  } else if (COMMUNITY) {
    collectionQuery.community = COMMUNITY
  }

  const { data, hasNextPage, fetchNextPage, isFetchingPage, isValidating } =
    useCollections(collectionQuery, {
      fallbackData: [ssr.collections[marketplaceChain.id]],
    })

  let collections = data || []
  const showViewAllButton = collections.length <= 12 && hasNextPage
  if (showViewAllButton) {
    collections = collections?.slice(0, 12)
  }

  const [sentryRef] = useInfiniteScroll({
    rootMargin: '0px 0px 100px 0px',
    loading: isFetchingPage,
    hasNextPage: hasNextPage && !showViewAllButton,
    onLoadMore: () => {
      fetchNextPage()
    },
  } as any)

  let volumeKey: ComponentPropsWithoutRef<
    typeof TrendingCollectionsList
  >['volumeKey'] = 'allTime'

  switch (sortByTime) {
    case '1DayVolume':
      volumeKey = '1day'
      break
    case '7DayVolume':
      volumeKey = '7day'
      break
    case '30DayVolume':
      volumeKey = '30day'
      break
  }

  return (
    <Layout>
      <Box
        css={{
          p: 24,
          height: '100%',
          '@bp800': {
            p: '$6',
          },
        }}
      >
        <Flex css={{ my: '$6', gap: 65 }} direction="column">
          <Flex
            justify="between"
            align="start"
            css={{
              flexDirection: 'column',
              gap: 24,
              '@bp800': {
                alignItems: 'center',
                flexDirection: 'row',
              },
            }}
          >
            <Text style="h4" as="h4">
              Popular Collections
            </Text>
            <TrendingCollectionsTimeToggle
              compact={compactToggleNames && isMounted}
              option={sortByTime}
              onOptionSelected={(option) => {
                setSortByTime(option)
              }}
            />
          </Flex>
          {isSSR || !isMounted ? null : (
            <TrendingCollectionsList
              collections={collections}
              loading={isValidating && showViewAllButton}
              volumeKey={volumeKey}
            />
          )}
          {(isFetchingPage || isValidating) && !showViewAllButton && (
            <Flex align="center" justify="center" css={{ py: '$4' }}>
              <LoadingSpinner />
            </Flex>
          )}
          {showViewAllButton && (
            <Button
              disabled={isValidating}
              onClick={() => {
                fetchNextPage()
              }}
              css={{
                minWidth: 224,
                justifyContent: 'center',
                alignSelf: 'center',
              }}
              size="large"
            >
              View All
            </Button>
          )}
          {!showViewAllButton && <div ref={sentryRef}></div>}
        </Flex>
        <Footer />
      </Box>
    </Layout>
  )
}

type CollectionSchema =
  paths['/collections/v5']['get']['responses']['200']['schema']
type ChainCollections = Record<string, CollectionSchema>

export const getStaticProps: GetStaticProps<{
  ssr: {
    collections: ChainCollections
  }
}> = async () => {
  let collectionQuery: paths['/collections/v5']['get']['parameters']['query'] =
    {
      sortBy: '1DayVolume',
      normalizeRoyalties: NORMALIZE_ROYALTIES,
      limit: 12,
    }

  if (COLLECTION_SET_ID) {
    collectionQuery.collectionsSetId = COLLECTION_SET_ID
  } else if (COMMUNITY) {
    collectionQuery.community = COMMUNITY
  }

  const promises: ReturnType<typeof fetcher>[] = []
  supportedChains.forEach((chain) => {
    promises.push(
      fetcher(`${chain.reservoirBaseUrl}/collections/v5`, collectionQuery, {
        headers: {
          'x-api-key': chain.apiKey || '',
        },
      })
    )
  })
  const responses = await Promise.allSettled(promises)
  const collections: ChainCollections = {}
  responses.forEach((response, i) => {
    if (response.status === 'fulfilled') {
      collections[supportedChains[i].id] = response.value.data
    }
  })

  return {
    props: { ssr: { collections } },
    revalidate: 5,
  }
}

export default IndexPage
