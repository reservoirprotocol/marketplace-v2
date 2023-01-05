import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { Text, Flex, Box, Button } from 'components/primitives'
import TrendingCollectionsList from 'components/home/TrendingCollectionsList'
import Layout from 'components/Layout'
import { useState } from 'react'
import usePaginatedCollections from 'hooks/usePaginatedCollections'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import TrendingCollectionsTimeToggle, {
  CollectionsSortingOption,
} from 'components/home/TrendingCollectionsTimeToggle'
import { Footer } from 'components/home/Footer'
import { useMediaQuery } from 'react-responsive'
import { useMounted } from 'hooks'
import LoadingSpinner from 'components/common/LoadingSpinner'
import { paths } from '@reservoir0x/reservoir-sdk'
import fetcher from 'utils/fetcher'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const IndexPage: NextPage<Props> = ({ ssr }) => {
  const isMounted = useMounted()
  const compactToggleNames = useMediaQuery({ query: '(max-width: 800px)' })
  const [sortByTime, setSortByTime] =
    useState<CollectionsSortingOption>('allTimeVolume')
  const { data, hasNextPage, fetchNextPage, isFetchingPage } =
    usePaginatedCollections(
      {
        limit: 20,
        sortBy: sortByTime,
      },
      {
        fallbackData: [ssr.collections],
      }
    )

  let collections = data || []
  const showViewAllButton = collections.length <= 20 && hasNextPage
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
          <TrendingCollectionsList collections={collections} />
          {isFetchingPage && (
            <Flex align="center" justify="center" css={{ py: '$4' }}>
              <LoadingSpinner />
            </Flex>
          )}
          {showViewAllButton && (
            <Button
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

export const getStaticProps: GetStaticProps<{
  ssr: {
    collections: paths['/collections/v5']['get']['responses']['200']['schema']
  }
}> = async () => {
  let collectionQuery: paths['/collections/v5']['get']['parameters']['query'] =
    {
      sortBy: 'allTimeVolume',
    }

  const collectionsResponse = await fetcher('collections/v5', collectionQuery)

  return {
    props: { ssr: { collections: collectionsResponse.data } },
    revalidate: 5,
  }
}

export default IndexPage
