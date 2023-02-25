import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { Text, Flex, Box } from 'components/primitives'
import TrendingCollectionsList from 'components/home/TrendingCollectionsList'
import Layout from 'components/Layout'
import { ComponentPropsWithoutRef, useEffect, useRef } from 'react'
import { useMarketplaceChain, useMounted } from 'hooks'
import LoadingSpinner from 'components/common/LoadingSpinner'
import { paths } from '@nftearth/reservoir-sdk'
import { useCollections } from '@nftearth/reservoir-kit-ui'
import fetcher from 'utils/fetcher'
import { NORMALIZE_ROYALTIES } from './_app'
import supportedChains from 'utils/chains'
import { useIntersectionObserver } from 'usehooks-ts'
import HeroSection from 'components/HeroSection'
import ChainToggle from "../components/home/ChainToggle";

type Props = InferGetStaticPropsType<typeof getStaticProps>

const ExplorePage: NextPage<Props> = ({ ssr }) => {
  const isSSR = typeof window === 'undefined'
  const isMounted = useMounted()
  const marketplaceChain = useMarketplaceChain()

  let collectionQuery: Parameters<typeof useCollections>['0'] = {
    normalizeRoyalties: NORMALIZE_ROYALTIES,
    sortBy: 'allTimeVolume',
  }

  const { data, hasNextPage, fetchNextPage, isFetchingPage, isValidating } =
    useCollections(collectionQuery, {
      fallbackData: [ssr.exploreCollections[marketplaceChain.id]],
      revalidateFirstPage: true,
      revalidateIfStale: true,
    }, marketplaceChain.id)

  let collections = data || []

  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})

  useEffect(() => {
    let isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      fetchNextPage()
    }
  }, [loadMoreObserver?.isIntersecting, isFetchingPage])

  let volumeKey: ComponentPropsWithoutRef<
    typeof TrendingCollectionsList
  >['volumeKey'] = 'allTime'

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
        <HeroSection hideLink />
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
            <Text style="h2" as="h2">
              Explore
            </Text>
            <ChainToggle compact/>
          </Flex>
          {isSSR || !isMounted ? null : (
            <TrendingCollectionsList
              uniqueKey="explore"
              chain={marketplaceChain}
              collections={collections}
              loading={isValidating && collections.length <= 12}
              volumeKey={volumeKey}
            />
          )}
          {(isFetchingPage || isValidating) && collections.length > 12 && (
            <Flex align="center" justify="center" css={{ py: '$space$4' }}>
              <LoadingSpinner />
            </Flex>
          )}
          <div ref={loadMoreRef} />
        </Flex>
      </Box>
    </Layout>
  )
}

type CollectionSchema =
  paths['/collections/v5']['get']['responses']['200']['schema']
type ChainCollections = Record<string, CollectionSchema>

export const getStaticProps: GetStaticProps<{
  ssr: {
    exploreCollections: ChainCollections
  }
}> = async () => {
  let collectionQuery: paths['/collections/v5']['get']['parameters']['query'] =
    {
      sortBy: '1DayVolume',
      normalizeRoyalties: NORMALIZE_ROYALTIES
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
    props: { ssr: { exploreCollections: collections } },
    revalidate: 5,
  }
}

export default ExplorePage
