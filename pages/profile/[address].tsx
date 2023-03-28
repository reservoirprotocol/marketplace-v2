import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import { Text, Flex, Box, Grid } from '../../components/primitives'
import { paths } from '@reservoir0x/reservoir-sdk'
import Layout from 'components/Layout'
import fetcher, { basicFetcher } from 'utils/fetcher'
import { useIntersectionObserver } from 'usehooks-ts'
import { useMediaQuery } from 'react-responsive'
import { useContext, useEffect, useRef, useState } from 'react'
import { Avatar } from 'components/primitives/Avatar'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { TabsList, TabsTrigger, TabsContent } from 'components/primitives/Tab'
import * as Tabs from '@radix-ui/react-tabs'
import {
  useCollectionActivity,
  useDynamicTokens,
  useUserCollections,
  useUserTokens,
} from '@reservoir0x/reservoir-kit-ui'
import TokenCard from 'components/collections/TokenCard'
import { TokenFilters } from 'components/common/TokenFilters'
import { useMounted, useMarketplaceChain } from '../../hooks'
import { FilterButton } from 'components/common/FilterButton'
import { UserActivityTable } from 'components/profile/UserActivityTable'
import { MobileActivityFilters } from 'components/common/MobileActivityFilters'
import { ActivityFilters } from 'components/common/ActivityFilters'
import { MobileTokenFilters } from 'components/common/MobileTokenFilters'
import LoadingCard from 'components/common/LoadingCard'
import { NAVBAR_HEIGHT } from 'components/navbar'
import { DefaultChain } from 'utils/chains'
import { useENSResolver } from 'hooks'
import { NORMALIZE_ROYALTIES } from 'pages/_app'
import { Head } from 'components/Head'
import CopyText from 'components/common/CopyText'
import { Address, useAccount } from 'wagmi'
import ChainToggle from 'components/common/ChainToggle'
import { ChainContext } from 'context/ChainContextProvider'

type Props = InferGetStaticPropsType<typeof getStaticProps>

type ActivityTypes = Exclude<
  NonNullable<
    NonNullable<
      Exclude<Parameters<typeof useCollectionActivity>['0'], boolean>
    >['types']
  >,
  string
>

const IndexPage: NextPage<Props> = ({ address, ssr, ensName }) => {
  const {
    avatar: ensAvatar,
    name: resolvedEnsName,
    shortAddress,
  } = useENSResolver(address)
  ensName = resolvedEnsName ? resolvedEnsName : ensName
  const account = useAccount()

  const [tokenFiltersOpen, setTokenFiltersOpen] = useState(true)
  const [activityFiltersOpen, setActivityFiltersOpen] = useState(true)
  const [filterCollection, setFilterCollection] = useState<string | undefined>(
    undefined
  )
  const isSmallDevice = useMediaQuery({ maxWidth: 905 })
  const [playingElement, setPlayingElement] = useState<
    HTMLAudioElement | HTMLVideoElement | null
  >()
  const isMounted = useMounted()
  const [activityTypes, setActivityTypes] = useState<ActivityTypes>(['sale'])
  const marketplaceChain = useMarketplaceChain()

  const scrollRef = useRef<HTMLDivElement | null>(null)

  const scrollToTop = () => {
    let top = (scrollRef.current?.offsetTop || 0) - (NAVBAR_HEIGHT + 16)
    window.scrollTo({ top: top })
  }

  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})

  const tokenQuery: Parameters<typeof useUserTokens>['1'] = {
    limit: 20,
    collection: filterCollection,
  }

  const collectionQuery: Parameters<typeof useUserCollections>['1'] = {
    limit: 100,
  }

  const { chain } = useContext(ChainContext)

  if (chain.collectionSetId) {
    collectionQuery.collectionsSetId = chain.collectionSetId
    tokenQuery.collectionsSetId = chain.collectionSetId
  } else if (chain.community) {
    collectionQuery.community = chain.community
    tokenQuery.community = chain.community
  }

  const ssrTokens = ssr.tokens[marketplaceChain.id]
    ? [ssr.tokens[marketplaceChain.id]]
    : undefined
  const {
    data: tokens,
    mutate,
    fetchNextPage,
    isFetchingInitialData,
    hasNextPage,
    isFetchingPage,
  } = useUserTokens(address || '', tokenQuery, {
    fallbackData: filterCollection ? undefined : ssrTokens,
  })

  const ssrCollections = ssr.collections[marketplaceChain.id]
    ? [ssr.collections[marketplaceChain.id]]
    : undefined

  const { data: collections, isLoading: collectionsLoading } =
    useUserCollections(address, collectionQuery, {
      fallbackData: filterCollection ? undefined : ssrCollections,
    })

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      fetchNextPage()
    }
  }, [loadMoreObserver?.isIntersecting])

  if (!isMounted) {
    return null
  }

  return (
    <Layout>
      <Head title={`Profile - ${address}`} />
      <Flex
        direction="column"
        css={{
          px: '$4',
          pt: '$5',
          pb: 0,
          '@sm': {
            px: '$5',
          },
        }}
      >
        <Flex
          justify="between"
          css={{
            gap: '$4',
            flexDirection: 'column',
            alignItems: 'start',
            '@sm': { flexDirection: 'row', alignItems: 'center' },
          }}
        >
          <Flex align="center">
            {ensAvatar ? (
              <Avatar size="xxl" src={ensAvatar} />
            ) : (
              <Jazzicon
                diameter={64}
                seed={jsNumberForAddress(address as string)}
              />
            )}
            <Flex direction="column" css={{ ml: '$4' }}>
              <Text style="h5">{ensName ? ensName : shortAddress}</Text>
              <CopyText text={address as string}>
                <Flex align="center" css={{ cursor: 'pointer' }}>
                  <Text style="subtitle1" color="subtle" css={{ mr: '$3' }}>
                    {shortAddress}
                  </Text>
                  <Box css={{ color: '$gray10' }}>
                    <FontAwesomeIcon icon={faCopy} width={16} height={16} />
                  </Box>
                </Flex>
              </CopyText>
            </Flex>
          </Flex>
          <ChainToggle />
        </Flex>
        <Tabs.Root defaultValue="items">
          <TabsList>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="items">
            <Flex
              css={{
                gap: tokenFiltersOpen ? '$5' : '',
                position: 'relative',
              }}
              ref={scrollRef}
            >
              {isSmallDevice ? (
                <MobileTokenFilters
                  collections={collections}
                  filterCollection={filterCollection}
                  setFilterCollection={setFilterCollection}
                />
              ) : (
                <TokenFilters
                  isLoading={collectionsLoading}
                  open={tokenFiltersOpen}
                  setOpen={setTokenFiltersOpen}
                  collections={collections}
                  filterCollection={filterCollection}
                  setFilterCollection={setFilterCollection}
                  scrollToTop={scrollToTop}
                />
              )}
              <Box
                css={{
                  flex: 1,
                }}
              >
                <Flex justify="between" css={{ marginBottom: '$4' }}>
                  {!collectionsLoading &&
                    collections &&
                    collections.length > 0 &&
                    !isSmallDevice && (
                      <FilterButton
                        open={tokenFiltersOpen}
                        setOpen={setTokenFiltersOpen}
                      />
                    )}
                </Flex>
                <Grid
                  css={{
                    gap: '$4',
                    width: '100%',
                    pb: '$6',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(200px, 1fr))',
                    '@md': {
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(240px, 1fr))',
                    },
                  }}
                >
                  {isFetchingInitialData || collectionsLoading
                    ? Array(10)
                        .fill(null)
                        .map((_, index) => (
                          <LoadingCard key={`loading-card-${index}`} />
                        ))
                    : tokens.map((token, i) => {
                        if (token) {
                          let dynamicToken = token as ReturnType<
                            typeof useDynamicTokens
                          >['data'][0]

                          if (dynamicToken.token) {
                            dynamicToken.token.owner = address
                          }
                          dynamicToken.market = {
                            floorAsk: token?.ownership?.floorAsk,
                          }
                          return (
                            <TokenCard
                              key={i}
                              token={dynamicToken}
                              address={account.address as Address}
                              tokenCount={
                                token?.token?.kind === 'erc1155'
                                  ? token.ownership?.tokenCount
                                  : undefined
                              }
                              mutate={mutate}
                              rarityEnabled={false}
                              addToCartEnabled={false}
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
                          )
                        }
                      })}
                  <Box
                    ref={loadMoreRef}
                    css={{
                      display: isFetchingPage ? 'none' : 'block',
                    }}
                  >
                    {hasNextPage && !isFetchingInitialData && <LoadingCard />}
                  </Box>
                  {(hasNextPage || isFetchingPage) &&
                    !isFetchingInitialData && (
                      <>
                        {Array(6)
                          .fill(null)
                          .map((_, index) => (
                            <LoadingCard key={`loading-card-${index}`} />
                          ))}
                      </>
                    )}
                </Grid>
                {tokens.length === 0 && !isFetchingPage && (
                  <Flex
                    direction="column"
                    align="center"
                    css={{ py: '$6', gap: '$4', width: '100%' }}
                  >
                    <Text css={{ color: '$gray11' }}>
                      <FontAwesomeIcon icon={faMagnifyingGlass} size="2xl" />
                    </Text>
                    <Text css={{ color: '$gray11' }}>No items found</Text>
                  </Flex>
                )}
              </Box>
            </Flex>
          </TabsContent>
          <TabsContent value="activity">
            <Flex
              css={{
                gap: activityFiltersOpen ? '$5' : '',
                position: 'relative',
              }}
            >
              {!isSmallDevice && (
                <ActivityFilters
                  open={activityFiltersOpen}
                  setOpen={setActivityFiltersOpen}
                  activityTypes={activityTypes}
                  setActivityTypes={setActivityTypes}
                />
              )}
              <Box
                css={{
                  flex: 1,
                  gap: '$4',
                  pb: '$5',
                }}
              >
                {isSmallDevice ? (
                  <MobileActivityFilters
                    activityTypes={activityTypes}
                    setActivityTypes={setActivityTypes}
                  />
                ) : (
                  <FilterButton
                    open={activityFiltersOpen}
                    setOpen={setActivityFiltersOpen}
                  />
                )}
                <UserActivityTable
                  user={address}
                  activityTypes={activityTypes}
                />
              </Box>
            </Flex>
          </TabsContent>
        </Tabs.Root>
      </Flex>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

type UserTokensSchema =
  paths['/users/{user}/tokens/v6']['get']['responses']['200']['schema']
type UserCollectionsSchema =
  paths['/users/{user}/collections/v2']['get']['responses']['200']['schema']

export const getStaticProps: GetStaticProps<{
  ssr: {
    tokens: Record<number, UserTokensSchema>
    collections: Record<number, UserCollectionsSchema>
  }
  address: string | undefined
  ensName: string | null
}> = async ({ params }) => {
  let address = params?.address?.toString() || ''
  const isEnsName = address.includes('.')
  let ensName: null | string = null

  if (isEnsName) {
    ensName = address
    const ensResponse = await basicFetcher(
      `https://api.ensideas.com/ens/resolve/${address}`
    )
    const ensAddress = ensResponse?.data?.address
    if (ensAddress) {
      address = ensAddress
    } else {
      return {
        notFound: true,
      }
    }
  }

  const tokensQuery: paths['/users/{user}/tokens/v6']['get']['parameters']['query'] =
    {
      limit: 20,
      normalizeRoyalties: NORMALIZE_ROYALTIES,
    }

  const collectionsQuery: paths['/users/{user}/collections/v2']['get']['parameters']['query'] =
    {
      limit: 100,
    }

  if (DefaultChain.collectionSetId) {
    tokensQuery.collectionsSetId = DefaultChain.collectionSetId
    collectionsQuery.collectionsSetId = DefaultChain.collectionSetId
  } else if (DefaultChain.community) {
    tokensQuery.community = DefaultChain.community
    collectionsQuery.community = DefaultChain.community
  }

  const promises: ReturnType<typeof fetcher>[] = []

  const headers = {
    headers: {
      'x-api-key': DefaultChain.apiKey || '',
    },
  }
  const tokensPromise = fetcher(
    `${DefaultChain.reservoirBaseUrl}/users/${address}/tokens/v6`,
    tokensQuery,
    headers
  )
  const collectionsPromise = fetcher(
    `${DefaultChain.reservoirBaseUrl}/users/${address}/collections/v2`,
    collectionsQuery,
    headers
  )
  promises.push(tokensPromise)
  promises.push(collectionsPromise)

  const responses = await Promise.allSettled(promises)
  const collections: Record<number, any> = {}
  const tokens: Record<number, any> = {}
  responses.forEach((response) => {
    if (response.status === 'fulfilled') {
      const url = new URL(response.value.response.url)
      if (url.pathname.includes('collections')) {
        collections[DefaultChain.id] = response.value.data
      } else if (url.pathname.includes('tokens')) {
        tokens[DefaultChain.id] = response.value.data
      }
    }
  })

  return {
    props: { ssr: { tokens, collections }, address, ensName },
    revalidate: 5,
  }
}

export default IndexPage
