import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { Text, Flex, Box } from 'components/primitives'
import TrendingCollectionsList from 'components/home/TrendingCollectionsList'
import Layout from 'components/Layout'
import { ComponentPropsWithoutRef, useState } from 'react'
import TrendingCollectionsTimeToggle, {
  CollectionsSortingOption,
} from 'components/home/TrendingCollectionsTimeToggle'
import { Footer } from 'components/Footer'
import { useMediaQuery } from 'react-responsive'
import { useMarketplaceChain, useMounted } from 'hooks'
import { paths } from '@nftearth/reservoir-sdk'
import { useCollections } from '@nftearth/reservoir-kit-ui'
import fetcher from 'utils/fetcher'
import { NORMALIZE_ROYALTIES } from './_app'
import supportedChains from 'utils/chains'
import HeroSection from 'components/HeroSection'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const collectionsSetId: any = {
  10: 'b03e080953a3a1cc77cee63968ecc126a918c8557838a2396e1651bae030b6b4',
  42161: '3b38ae5b4e28b3b9873d74d3cf397b479a8506fe9bf26a1335b4e2807196e03b',
}

const IndexPage: NextPage<Props> = ({ ssr }) => {
  const isSSR = typeof window === 'undefined'
  const isMounted = useMounted()
  const compactToggleNames = useMediaQuery({ query: '(max-width: 800px)' })
  const [sortByTime, setSortByTime] =
    useState<CollectionsSortingOption>('1DayVolume')
  const marketplaceChain = useMarketplaceChain()

  let collectionQuery: Parameters<typeof useCollections>['0'] = {
    limit: 12,
    normalizeRoyalties: NORMALIZE_ROYALTIES,
    sortBy: sortByTime,
  }

  let collectionQuery2: Parameters<typeof useCollections>['0'] = {
    sortBy: '1DayVolume',
    normalizeRoyalties: NORMALIZE_ROYALTIES,
    collectionsSetId: collectionsSetId[marketplaceChain.id],
  }

  const {
    data: topData,
    isFetchingPage: isFetchingTopPage,
    isValidating: isValidatingTopPage,
  } = useCollections(collectionQuery2, {
    fallbackData: [ssr.collections[marketplaceChain.id]],
  })

  let topCollections = topData || []

  const { data, hasNextPage, fetchNextPage, isFetchingPage, isValidating } =
    useCollections(collectionQuery, {
      fallbackData: [ssr.collections[marketplaceChain.id]],
    })

  let collections = (data || []).slice(0, 12)

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
          height: '100%',
        }}
      >
        <HeroSection />
        <Box
          css={{
            p: 24,
            height: '100%',
            '@bp800': {
              p: '$6',
            },
          }}
        >
          <Flex css={{ mb: '100px', gap: 65 }} direction="column">
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
              <Text style="h3" as="h3">
                Featured Collections
              </Text>
            </Flex>
            {isSSR || !isMounted ? null : (
              <TrendingCollectionsList
                uniqueKey="featured"
                chain={marketplaceChain}
                collections={topCollections}
                loading={isValidatingTopPage}
              />
            )}
          </Flex>
          <Flex css={{ my: '$6', mb: '150px', gap: 65 }} direction="column">
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
              <Text style="h3" as="h3">
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
                uniqueKey="popular"
                chain={marketplaceChain}
                collections={collections}
                loading={isValidating}
                volumeKey={volumeKey}
              />
            )}
          </Flex>
          <Footer />
        </Box>
      </Box>
    </Layout>
  )
}

type CollectionSchema =
  paths['/collections/v5']['get']['responses']['200']['schema']
type ChainCollections = Record<string, CollectionSchema>
type TopChainCollections = Record<string, CollectionSchema>

export const getStaticProps: GetStaticProps<{
  ssr: {
    topCollections: TopChainCollections
    collections: ChainCollections
  }
}> = async () => {
  let collectionQuery: paths['/collections/v5']['get']['parameters']['query'] =
    {
      sortBy: '1DayVolume',
      normalizeRoyalties: NORMALIZE_ROYALTIES,
      limit: 12,
    }

  let collectionQuery2: paths['/collections/v5']['get']['parameters']['query'] =
    {
      sortBy: '1DayVolume',
      normalizeRoyalties: NORMALIZE_ROYALTIES,
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

  const promises2: ReturnType<typeof fetcher>[] = []
  supportedChains.forEach((chain) => {
    collectionQuery2.collectionsSetId = collectionsSetId[chain.id]
    promises2.push(
      fetcher(`${chain.reservoirBaseUrl}/collections/v5`, collectionQuery2, {
        headers: {
          'x-api-key': chain.apiKey || '',
        },
      })
    )
  })

  const responses = await Promise.allSettled(promises)
  const responses2 = await Promise.allSettled(promises2)
  const collections: ChainCollections = {}
  const topCollections: ChainCollections = {}
  responses.forEach((response, i) => {
    if (response.status === 'fulfilled') {
      collections[supportedChains[i].id] = response.value.data
    }
  })

  responses2.forEach((response, i) => {
    if (response.status === 'fulfilled') {
      topCollections[supportedChains[i].id] = response.value.data
    }
  })

  return {
    props: { ssr: { collections, topCollections } },
    revalidate: 5,
  }
}

export default IndexPage
