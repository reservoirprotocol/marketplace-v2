import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { Text, Flex, Box } from 'components/primitives'
import Layout from 'components/Layout'
import { useEffect, useRef } from 'react'
import { useMarketplaceChain, useMounted } from 'hooks'
import { paths } from '@nftearth/reservoir-sdk'
import { useCollections } from '@nftearth/reservoir-kit-ui'
import fetcher from 'utils/fetcher'
import { NORMALIZE_ROYALTIES } from '../_app'
import supportedChains from 'utils/chains'
import { useIntersectionObserver } from 'usehooks-ts'
import { LeaderboardTable } from 'components/leaderboard/LeaderboardTable'
import { PointsTable } from 'components/leaderboard/PointsTable'
import { data } from 'components/leaderboard/enums'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const LeaderboardPage: NextPage<Props> = ({ ssr }) => {
  const isMounted = useMounted()
  const marketplaceChain = useMarketplaceChain()

  let collectionQuery: Parameters<typeof useCollections>['0'] = {
    limit: 12,
    normalizeRoyalties: NORMALIZE_ROYALTIES,
    sortBy: 'allTimeVolume',
  }

  // const { data, hasNextPage, fetchNextPage, isFetchingPage, isValidating } =
  //   useCollections(
  //     collectionQuery,
  //     {
  //       fallbackData: [ssr.exploreCollections[marketplaceChain.id]],
  //     },
  //     marketplaceChain.id
  //   )

  // const loadMoreRef = useRef<HTMLDivElement>(null)
  // const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})

  // useEffect(() => {
  //   let isVisible = !!loadMoreObserver?.isIntersecting
  //   if (isVisible) {
  //     fetchNextPage()
  //   }
  // }, [loadMoreObserver?.isIntersecting, isFetchingPage])

  return (
    <Layout>
      <Box
        css={{
          height: 'calc(100vh - 80px)',
          width: '100vw',
          '@bp800': {
            p: '$6',
          },
        }}
      >
        {/* <Flex
          align="center"
          justify="center"
          direction="column"
          css={{
            height: '100%',
            width: '100%',
          }}
        >
          <Text
            style={{
              '@initial': 'h3',
              '@lg': 'h2',
            }}
            css={{ lineHeight: 1.2, letterSpacing: 2, color: '$gray10' }}
          >
            COMING SOON
          </Text>
          <Text css={{ color: '$gray10' }}>
            This page is under construction
          </Text>
        </Flex> */}
        <Flex
          align="center"
          direction="column"
          css={{
            height: '100%',
            width: '100%',
            // background: `url(/ClaimRewards.png)`,
          }}
        >
          <Text
            style={{
              '@initial': 'h3',
              '@lg': 'h2',
            }}
            css={{
              lineHeight: 1.2,
              letterSpacing: 2,
              marginTop: '75px',
              textAlign: 'center',
              marginLeft: 'auto',
              marginRight: 'auto',
              textShadow:
              `0 0 7px green,
              0 0 10px green,
              0 0 21px green,
              0 0 42px green,
              0 0 82px green,
              0 0 92px green,
              0 0 102px green,
              0 0 151px green`
            }}
          >
            NFTEARTH AIDRDROP SEASON 2
          </Text>
          <Text
            style={{
              '@initial': 'h4',
              '@lg': 'h5',
            }}
            css={{
              lineHeight: 1.2,
              letterSpacing: 2,
              marginTop: '75px',
              color: '#39FF14',
              textAlign: 'center',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Season 1 was just the beginning. There's a lot more coming. Season 2
            rewards have not been revealed yet, but for the next 30 days, all
            bidding and listing points have been doubled.
          </Text>
          <PointsTable />
          <Text
            as="a"
            href="/collections"
            style={{
              '@initial': 'h4',
              '@lg': 'h5',
            }}
            css={{
              lineHeight: 1.2,
              letterSpacing: 2,
              marginTop: '75px',
              color: '#39FF14',
              textAlign: 'center',
              marginLeft: 'auto',
              marginRight: 'auto',
              cursor: 'pointer',
            }}
          >
            View Collections
          </Text>
          <Flex
            css={{  width: '100%' }}
          >
            <Box css={{ width: '100%', height: '25vh' }}>
              <Flex
                align="center"
                direction="column"
                css={{ textAlign: 'center', gap: '$4' }}
              >
                <Text
                  style={{
                    '@initial': 'h3',
                    '@lg': 'h2',
                  }}
                  css={{
                    lineHeight: 1.2,
                    letterSpacing: 2,
                    marginTop: '75px',
                    textAlign: 'center',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    textShadow:
                    `0 0 7px green,
                    0 0 10px green,
                    0 0 21px green,
                    0 0 42px green,
                    0 0 82px green,
                    0 0 92px green,
                    0 0 102px green,
                    0 0 151px green`
                  }}
                >
                  ROLLING 24HR LEADERBOARD
                </Text>
              </Flex>
              <Box css={{ textAlign: 'center' }}>
                <Text css={{ color: '#39FF14', textAlign: 'center' }}>
                  Increase your position on the leaderboard by completing
                  quests! 💰
                </Text>
              </Box>
            </Box>
          </Flex>
          <Flex
            align="center"
            direction="column"
            css={{
              width: '100%',
              alignItems: 'center',
            }}
          >
            <LeaderboardTable data={data} />
          </Flex>
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
      normalizeRoyalties: NORMALIZE_ROYALTIES,
      limit: 12,
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

export default LeaderboardPage
