import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { Text, Flex, Box } from 'components/primitives'
import Layout from 'components/Layout'
import { paths } from '@reservoir0x/reservoir-sdk'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Footer } from 'components/home/Footer'
import { useMediaQuery } from 'react-responsive'
import { useMarketplaceChain, useMounted } from 'hooks'
import supportedChains, { DefaultChain } from 'utils/chains'
import { Head } from 'components/Head'
import { ChainContext } from 'context/ChainContextProvider'
import { Dropdown, DropdownMenuItem } from 'components/primitives/Dropdown'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'
import { ChainStats } from 'components/home/ChainStats'
import useTopSellingCollections from 'hooks/useTopSellingCollections'
import { CollectionTopSellingTable } from 'components/home/CollectionTopSellingTable'
import { FillTypeToggle } from 'components/home/FillTypeToggle'
import { TimeFilterToggle } from 'components/home/TimeFilterToggle'
import fetcher from 'utils/fetcher'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const IndexPage: NextPage<Props> = ({ ssr }) => {
  const isSSR = typeof window === 'undefined'
  const isMounted = useMounted()
  const isSmallDevice = useMediaQuery({ maxWidth: 905 }) && isMounted
  const marketplaceChain = useMarketplaceChain()
  const router = useRouter()
  const [fillType, setFillType] = useState<'mint' | 'sale' | 'any'>('sale')
  const [minutesFilter, setMinutesFilter] = useState<number>(1440)

  const { chain, switchCurrentChain } = useContext(ChainContext)

  const startTime = useMemo(() => {
    const now = new Date()
    const timestamp = Math.floor(now.getTime() / 1000)
    return timestamp - minutesFilter * 60
  }, [minutesFilter])

  const {
    data: topSellingCollectionsData,
    collections: collectionsData,
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
      fallbackData: ssr.topSellingCollections[marketplaceChain.id]?.collections
        ? [ssr.topSellingCollections[marketplaceChain.id].collections]
        : [],
    },
    chain?.id
  )

  const [topSellingCollections, setTopSellingCollections] = useState<
    ReturnType<typeof useTopSellingCollections>['data']
  >(ssr.topSellingCollections[marketplaceChain.id])
  const [collections, setCollections] =
    useState<ReturnType<typeof useTopSellingCollections>['collections']>(
      collectionsData
    )

  useEffect(() => {
    if (!isValidating) {
      setTopSellingCollections(topSellingCollectionsData)
      setCollections(collectionsData)
    }
  }, [isValidating])

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
                    <Box
                      css={{
                        color: '$gray10',
                        transition: 'transform',
                        '[data-state=open] &': { transform: 'rotate(180deg)' },
                      }}
                    >
                      <FontAwesomeIcon icon={faChevronDown} width={16} />
                    </Box>
                  </Flex>
                }
              >
                <Flex direction="column" css={{ minWidth: 150 }}>
                  {supportedChains.map(({ name, id, routePrefix }) => (
                    <DropdownMenuItem
                      css={{
                        textAlign: 'left',
                        py: '$2',
                      }}
                      key={id}
                      onClick={() => {
                        switchCurrentChain(id)

                        router.replace(routePrefix, undefined, {
                          scroll: false,
                          shallow: true,
                        })
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
          <Text
            style="body1"
            color="subtle"
            css={{ mb: 48, textAlign: 'left' }}
          >
            Multi-Chain Explorer, powered by Reservoir
          </Text>
        </Flex>
        {!isSmallDevice ? <ChainStats /> : null}
        <Flex
          css={{ mb: '$6', '@sm': { my: '$6' }, gap: 32 }}
          direction="column"
        >
          <Flex
            justify="between"
            align="center"
            css={{
              gap: '$2',
            }}
          >
            <FillTypeToggle fillType={fillType} setFillType={setFillType} />
            <TimeFilterToggle
              minutesFilter={minutesFilter}
              setMinutesFilter={setMinutesFilter}
            />
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

type TopSellingCollectionsSchema =
  paths['/collections/top-selling/v1']['get']['responses']['200']['schema']

type ChainTopSellingCollections = Record<string, TopSellingCollectionsSchema>

export const getServerSideProps: GetServerSideProps<{
  ssr: {
    topSellingCollections: ChainTopSellingCollections
  }
}> = async ({ params, res }) => {
  const now = new Date()
  const timestamp = Math.floor(now.getTime() / 1000)
  const startTime = timestamp - 1440 * 60 // 24hrs ago

  const topSellingCollectionsQuery: paths['/collections/top-selling/v1']['get']['parameters']['query'] =
    {
      startTime: startTime,
      fillType: 'sale',
      limit: 20,
      includeRecentSales: true,
    }

  const chainPrefix = params?.chain || ''
  const chain =
    supportedChains.find((chain) => chain.routePrefix === chainPrefix) ||
    DefaultChain
  const response = await fetcher(
    `${chain.reservoirBaseUrl}/collections/top-selling/v1`,
    topSellingCollectionsQuery,
    {
      headers: {
        'x-api-key': chain.apiKey || '',
      },
    }
  )
  const topSellingCollections: ChainTopSellingCollections = {}
  topSellingCollections[chain.id] = response.data

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=120, stale-while-revalidate=180'
  )

  return {
    props: { ssr: { topSellingCollections } },
  }
}

export default IndexPage
