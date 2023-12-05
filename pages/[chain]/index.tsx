import { paths } from '@reservoir0x/reservoir-sdk'
import { Head } from 'components/Head'
import Layout from 'components/Layout'
import { Footer } from 'components/home/Footer'
import { Box, Button, Flex, Text } from 'components/primitives'
import { ChainContext } from 'context/ChainContextProvider'
import { useMarketplaceChain, useMounted } from 'hooks'
import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import {
  ComponentPropsWithoutRef,
  useContext,
  useEffect,
  useState,
} from 'react'
import supportedChains, { DefaultChain } from 'utils/chains'

import * as Tabs from '@radix-ui/react-tabs'
import {
  useTrendingCollections,
  useTrendingMints,
} from '@reservoir0x/reservoir-kit-ui'
import ChainToggle from 'components/common/ChainToggle'
import CollectionsTimeDropdown, {
  CollectionsSortingOption,
} from 'components/common/CollectionsTimeDropdown'
import LoadingSpinner from 'components/common/LoadingSpinner'
import { MintTypeOption } from 'components/common/MintTypeSelector'
import MintsPeriodDropdown, {
  MintsSortingOption,
} from 'components/common/MintsPeriodDropdown'
import { FeaturedCards } from 'components/home/FeaturedCards'
import { TabsContent, TabsList, TabsTrigger } from 'components/primitives/Tab'
import { CollectionRankingsTable } from 'components/rankings/CollectionRankingsTable'
import { MintRankingsTable } from 'components/rankings/MintRankingsTable'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import { useMediaQuery } from 'react-responsive'
import { basicFetcher as fetcher } from 'utils/fetcher'

type TabValue = 'collections' | 'mints'

const Home: NextPage<any> = ({ ssr }) => {
  const router = useRouter()
  const marketplaceChain = useMarketplaceChain()
  const isMounted = useMounted()

  // not sure if there is a better way to fix this
  const { theme: nextTheme } = useTheme()
  const [theme, setTheme] = useState<string | null>(null)
  useEffect(() => {
    if (nextTheme) {
      setTheme(nextTheme)
    }
  }, [nextTheme])

  const isSSR = typeof window === 'undefined'
  const isSmallDevice = useMediaQuery({ query: '(max-width: 800px)' })

  const [tab, setTab] = useState<TabValue>('collections')
  const [sortByTime, setSortByTime] = useState<CollectionsSortingOption>('1d')
  const [mintType, setMintType] = useState<MintTypeOption>('any')
  const [sortByPeriod, setSortByPeriod] = useState<MintsSortingOption>('24h')

  let mintsQuery: Parameters<typeof useTrendingMints>['0'] = {
    limit: 20,
    period: sortByPeriod,
    type: mintType,
  }

  const { chain, switchCurrentChain } = useContext(ChainContext)

  useEffect(() => {
    if (router.query.chain) {
      let chainIndex: number | undefined
      for (let i = 0; i < supportedChains.length; i++) {
        if (supportedChains[i].routePrefix == router.query.chain) {
          chainIndex = supportedChains[i].id
        }
      }
      if (chainIndex !== -1 && chainIndex) {
        switchCurrentChain(chainIndex)
      }
    }
  }, [router.query])

  const {
    data: trendingCollections,
    isValidating: isTrendingCollectionsValidating,
  } = useTrendingCollections(
    {
      limit: 20,
      sortBy: 'volume',
      period: sortByTime,
    },
    chain.id,
    {
      fallbackData: [ssr.collection],
    }
  )

  const {
    data: featuredCollections,
    isValidating: isFeaturedCollectionsValidating,
  } = useTrendingCollections(
    {
      limit: 20,
      sortBy: 'sales',
      period: '24h',
    },
    chain.id,
    {
      fallbackData: [ssr.collection],
    }
  )

  const { data: trendingMints, isValidating: isTrendingMintsValidating } =
    useTrendingMints({ ...mintsQuery }, chain.id, {
      fallbackData: [],
    })

  let volumeKey: ComponentPropsWithoutRef<
    typeof CollectionRankingsTable
  >['volumeKey'] = 'allTime'

  switch (sortByTime) {
    case '30d':
      volumeKey = '30day'
      break
    case '7d':
      volumeKey = '7day'
      break
    case '1d':
      volumeKey = '1day'
      break
  }

  return (
    <Layout>
      <Head />
      <Box
        css={{
          p: 24,
          height: '100%',
          '@bp800': {
            px: '$5',
          },
          '@xl': {
            px: '$6',
          },
        }}
      >
        <Box
          css={{
            mb: 64,
          }}
        >
          <Flex
            justify="between"
            align="start"
            css={{
              gap: 24,
              mb: '$4',
            }}
          >
            <Text style="h4" as="h4">
              Featured
            </Text>
            <ChainToggle />
          </Flex>
          <Box
            css={{
              height: '100%',
            }}
          >
            <FeaturedCards collections={featuredCollections} />
            {isFeaturedCollectionsValidating && (
              <Flex align="center" justify="center" css={{ py: '$4' }}>
                <LoadingSpinner />
              </Flex>
            )}
          </Box>
        </Box>

        <Tabs.Root
          onValueChange={(tab) => setTab(tab as TabValue)}
          defaultValue="collections"
        >
          <Flex justify="between" align="start" css={{ mb: '$3' }}>
            <Text style="h4" as="h4">
              Trending
            </Text>
            {!isSmallDevice && (
              <Flex
                align="center"
                css={{
                  gap: '$4',
                }}
              >
                {tab === 'collections' ? (
                  <CollectionsTimeDropdown
                    compact={isSmallDevice && isMounted}
                    option={sortByTime}
                    onOptionSelected={(option) => {
                      setSortByTime(option)
                    }}
                  />
                ) : (
                  <MintsPeriodDropdown
                    option={sortByPeriod}
                    onOptionSelected={setSortByPeriod}
                  />
                )}
                <ChainToggle />
              </Flex>
            )}
          </Flex>
          <TabsList css={{ mb: 24, mt: 0, borderBottom: 'none' }}>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="mints">Mints</TabsTrigger>
          </TabsList>
          {isSmallDevice && (
            <Flex
              justify="between"
              align="center"
              css={{
                gap: 24,
                mb: '$4',
              }}
            >
              <Flex align="center" css={{ gap: '$4' }}>
                <CollectionsTimeDropdown
                  compact={isSmallDevice && isMounted}
                  option={sortByTime}
                  onOptionSelected={(option) => {
                    setSortByTime(option)
                  }}
                />
                <ChainToggle />
              </Flex>
            </Flex>
          )}
          <TabsContent value="collections">
            <Box
              css={{
                height: '100%',
              }}
            >
              <Flex direction="column">
                {isSSR || !isMounted ? null : (
                  <CollectionRankingsTable
                    collections={trendingCollections || []}
                    volumeKey={volumeKey}
                    loading={isTrendingCollectionsValidating}
                  />
                )}
                <Box
                  css={{
                    display: isTrendingCollectionsValidating ? 'none' : 'block',
                  }}
                ></Box>
              </Flex>
              {isTrendingCollectionsValidating && (
                <Flex align="center" justify="center" css={{ py: '$4' }}>
                  <LoadingSpinner />
                </Flex>
              )}
            </Box>
          </TabsContent>
          <TabsContent value="mints">
            <Box
              css={{
                height: '100%',
              }}
            >
              <Flex direction="column">
                {isSSR || !isMounted ? null : (
                  <MintRankingsTable
                    mints={trendingMints || []}
                    loading={isTrendingMintsValidating}
                  />
                )}
                <Box
                  css={{
                    display: isTrendingCollectionsValidating ? 'none' : 'block',
                  }}
                ></Box>
              </Flex>
              {isTrendingMintsValidating && (
                <Flex align="center" justify="center" css={{ py: '$4' }}>
                  <LoadingSpinner />
                </Flex>
              )}
            </Box>
          </TabsContent>
        </Tabs.Root>
        <Box css={{ my: '$5' }}>
          <Link href={`/${marketplaceChain.routePrefix}/${tab}/trending`}>
            <Button>See More</Button>
          </Link>
        </Box>
      </Box>

      <Footer />
    </Layout>
  )
}

type TopSellingCollectionsSchema =
  paths['/collections/top-selling/v1']['get']['responses']['200']['schema']

type ChainTopSellingCollections = Record<string, TopSellingCollectionsSchema>

export const getServerSideProps: GetServerSideProps<{
  ssr: {
    topSellingCollections: ChainTopSellingCollections
  }
}> = async ({ params, res }) => {
  const chainPrefix = params?.chain || ''
  const chain =
    supportedChains.find((chain) => chain.routePrefix === chainPrefix) ||
    DefaultChain

  const topSellingCollections: ChainTopSellingCollections = {}
  try {
    const response = await fetcher(
      `${chain.reservoirBaseUrl}/collections/trending/v1?period=24h&includeRecentSales=true&limit=9&fillType=sale`,
      {
        headers: {
          'x-api-key': process.env.RESERVOIR_API_KEY || '',
        },
      }
    )

    topSellingCollections[chain.id] = response.data

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=120, stale-while-revalidate=180'
    )
  } catch (e) {}

  return {
    props: { ssr: { topSellingCollections } },
  }
}

export default Home
