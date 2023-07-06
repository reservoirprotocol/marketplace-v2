import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import {
  Text,
  Flex,
  Box,
  Button,
  ToggleGroup,
  ToggleGroupItem,
} from 'components/primitives'
import Layout from 'components/Layout'
import { useContext, useMemo, useState } from 'react'
import { Footer } from 'components/home/Footer'
import { useMediaQuery } from 'react-responsive'
import { useMarketplaceChain, useMounted } from 'hooks'
import { paths } from '@reservoir0x/reservoir-sdk'
import fetcher from 'utils/fetcher'
import { NORMALIZE_ROYALTIES } from '../_app'
import supportedChains from 'utils/chains'
import Link from 'next/link'
import { Head } from 'components/Head'
import { ChainContext } from 'context/ChainContextProvider'
import { Dropdown, DropdownMenuItem } from 'components/primitives/Dropdown'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'
import { ChainStats } from 'components/home/ChainStats'
import useTopSellingCollections from 'hooks/useTopSellingCollections'
import { CollectionTopSellingTable } from 'components/home/CollectionTopSellingTable'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const IndexPage: NextPage<Props> = ({ ssr }) => {
  const isSSR = typeof window === 'undefined'
  const isMounted = useMounted()
  const marketplaceChain = useMarketplaceChain()
  const router = useRouter()
  const [fillType, setFillType] = useState<'mint' | 'sale' | 'any'>('any')
  const [minutesFilter, setMinutesFilter] = useState<number>(1440)

  const { chain, switchCurrentChain } = useContext(ChainContext)

  // const { data, isValidating } = useCollections(
  //   {},
  //   {
  //     fallbackData: [ssr.collections[marketplaceChain.id]],
  //   }
  // )

  const startTime = useMemo(() => {
    const now = new Date()
    const timestamp = Math.floor(now.getTime() / 1000)
    return timestamp - minutesFilter * 60
  }, [minutesFilter])

  const {
    data: topSellingCollections,
    collections,
    isValidating,
  } = useTopSellingCollections(
    {
      startTime,
      fillType,
      limit: 20,
      includeRecentSales: true,
    },
    {
      revalidateOnMount: true,
      refreshInterval: 300000,
    }
  )

  return (
    <Layout>
      <Head />
      <Box
        css={{
          p: 24,
          height: '100%',
          '@bp800': {
            p: '$6',
          },
        }}
      >
        <Flex
          direction="column"
          css={{
            mx: 'auto',
            maxWidth: 728,
            pt: '$5',
            textAlign: 'center',
            alignItems: 'flex-start',
            '@bp600': { alignItems: 'center' },
          }}
        >
          <Flex
            css={{
              mb: '$4',
              gap: '$3',
              flexDirection: 'column',
              alignItems: 'flex-start',
              maxWidth: '100%',
              '@bp600': {
                flexDirection: 'row',
                alignItems: 'center',
              },
            }}
          >
            <Text style="h3" css={{ flexShrink: 0 }}>
              Explore NFTs
            </Text>{' '}
            <Flex css={{ gap: '$3', maxWidth: '100%' }}>
              <Text style="h3" color="subtle">
                on
              </Text>
              <Dropdown
                contentProps={{
                  sideOffset: 8,
                  asChild: true,
                  style: {
                    margin: 0,
                  },
                }}
                trigger={
                  <Flex
                    css={{
                      gap: '$3',
                      alignItems: 'center',
                      cursor: 'pointer',
                      minWidth: 0,
                    }}
                  >
                    <img
                      src={`/home/logos/${marketplaceChain.routePrefix}-logo.png`}
                      alt={`${marketplaceChain.name} Logo`}
                      style={{ width: 40, height: 40 }}
                    />
                    <Text style="h3" ellipsify>
                      {' ' + marketplaceChain.name}
                    </Text>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      width={16}
                      height={16}
                      color="#9BA1A6"
                    />
                  </Flex>
                }
              >
                <Flex direction="column" css={{ minWidth: 150 }}>
                  {supportedChains.map(({ name, id, routePrefix }) => (
                    <DropdownMenuItem
                      css={{
                        textAlign: 'left',
                      }}
                      key={id}
                      onClick={() => {
                        const newUrl = router.asPath.replace(
                          chain.routePrefix,
                          routePrefix
                        )
                        switchCurrentChain(id)
                        router.replace(newUrl, undefined, { scroll: false })
                      }}
                    >
                      <Text
                        style="h6"
                        color={
                          id === marketplaceChain.id ? undefined : 'subtle'
                        }
                        css={{ cursor: 'pointer' }}
                      >
                        {name}
                      </Text>
                    </DropdownMenuItem>
                  ))}
                </Flex>
              </Dropdown>
            </Flex>
          </Flex>
          <Text style="body1" color="subtle" css={{ mb: 48 }}>
            Multi-Chain Explorer, powered by Reservoir
          </Text>
        </Flex>
        <ChainStats />
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
            <ToggleGroup
              type="single"
              value={fillType}
              onValueChange={(value) => setFillType(value as typeof fillType)}
              css={{ flexShrink: 0 }}
            >
              <ToggleGroupItem value="any" css={{ minWidth: 160, p: '$4' }}>
                <Text style="subtitle1">All Sales</Text>
              </ToggleGroupItem>
              <ToggleGroupItem value="mint" css={{ minWidth: 160, p: '$4' }}>
                <Text style="subtitle1">Mints</Text>
              </ToggleGroupItem>
              <ToggleGroupItem value="sale" css={{ minWidth: 160, p: '$4' }}>
                <Text style="subtitle1">Trades</Text>
              </ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup
              type="single"
              value={`${minutesFilter}`}
              onValueChange={(value) => setMinutesFilter(+value)}
              css={{ flexShrink: 0 }}
            >
              <ToggleGroupItem value="5" css={{ minWidth: 80, p: '$4' }}>
                <Text style="subtitle1">5m</Text>
              </ToggleGroupItem>
              <ToggleGroupItem value="30" css={{ minWidth: 80, p: '$4' }}>
                <Text style="subtitle1">30m</Text>
              </ToggleGroupItem>
              <ToggleGroupItem value="60" css={{ minWidth: 80, p: '$4' }}>
                <Text style="subtitle1">1h</Text>
              </ToggleGroupItem>
              <ToggleGroupItem value="360" css={{ minWidth: 80, p: '$4' }}>
                <Text style="subtitle1">6h</Text>
              </ToggleGroupItem>
              <ToggleGroupItem value="1440" css={{ minWidth: 80, p: '$4' }}>
                <Text style="subtitle1">24h</Text>
              </ToggleGroupItem>
            </ToggleGroup>
          </Flex>
          {isSSR || !isMounted ? null : (
            <CollectionTopSellingTable
              topSellingCollections={topSellingCollections?.collections}
              collections={collections}
              loading={isValidating}
              fillType={fillType}
            />
          )}
        </Flex>
        <Footer />
      </Box>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
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
      includeTopBid: true,
      limit: 10,
    }

  const promises: ReturnType<typeof fetcher>[] = []
  supportedChains.forEach((chain) => {
    const query = { ...collectionQuery }
    if (chain.collectionSetId) {
      query.collectionsSetId = chain.collectionSetId
    } else if (chain.community) {
      query.community = chain.community
    }
    promises.push(
      fetcher(`${chain.reservoirBaseUrl}/collections/v5`, query, {
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
