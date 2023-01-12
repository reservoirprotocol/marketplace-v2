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
import { useCopyToClipboard, useIntersectionObserver } from 'usehooks-ts'
import { useMediaQuery } from 'react-responsive'
import { useContext, useEffect, useRef, useState } from 'react'
import { ToastContext } from 'context/ToastContextProvider'
import { Avatar } from 'components/primitives/Avatar'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { TabsList, TabsTrigger, TabsContent } from 'components/primitives/Tab'
import * as Tabs from '@radix-ui/react-tabs'
import {
  useCollectionActivity,
  useTokens,
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
import supportedChains from 'utils/chains'
import { useENSResolver } from 'hooks'
import { COLLECTION_SET_ID, COMMUNITY, NORMALIZE_ROYALTIES } from 'pages/_app'

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
  const [tokenFiltersOpen, setTokenFiltersOpen] = useState(true)
  const [activityFiltersOpen, setActivityFiltersOpen] = useState(true)
  const [filterCollection, setFilterCollection] = useState<string | undefined>(
    undefined
  )
  const isSmallDevice = useMediaQuery({ maxWidth: 905 })
  const [value, copy] = useCopyToClipboard()
  const { addToast } = useContext(ToastContext)
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
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {
    rootMargin: '0px 0px 300px 0px',
  })

  let tokenQuery: Parameters<typeof useUserTokens>['1'] = {
    limit: 20,
    collection: filterCollection,
  }

  if (COLLECTION_SET_ID) {
    tokenQuery.collectionsSetId = COLLECTION_SET_ID
  } else if (COMMUNITY) {
    tokenQuery.community = COMMUNITY
  }

  const ssrTokens = ssr.tokens[marketplaceChain.id]
  const {
    data: tokens,
    mutate,
    fetchNextPage,
    isFetchingInitialData,
    hasNextPage,
    isFetchingPage,
  } = useUserTokens(address || '', tokenQuery, {
    fallbackData: filterCollection ? undefined : [ssrTokens],
  })

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      fetchNextPage()
    }
  }, [loadMoreObserver?.isIntersecting])

  const ssrCollections = ssr.collections[marketplaceChain.id]
  const collections = ssrCollections?.collections || []

  if (!isMounted) {
    return null
  }

  return (
    <Layout>
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
            <Text style="h4">{ensName ? ensName : shortAddress}</Text>
            <Flex
              align="center"
              css={{ cursor: 'pointer' }}
              onClick={() => {
                copy(address as string)
                addToast?.({ title: 'Copied' })
              }}
            >
              <Text style="subtitle1" color="subtle" css={{ mr: '$3' }}>
                {shortAddress}
              </Text>
              <Box css={{ color: '$gray10' }}>
                <FontAwesomeIcon icon={faCopy} width={16} height={16} />
              </Box>
            </Flex>
          </Flex>
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
                  {collections && collections.length > 0 && !isSmallDevice && (
                    <FilterButton
                      open={tokenFiltersOpen}
                      setOpen={setTokenFiltersOpen}
                    />
                  )}
                </Flex>
                <Grid
                  css={{
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '$4',
                    width: '100%',
                    pb: '$6',
                  }}
                >
                  {isFetchingInitialData
                    ? Array(10)
                        .fill(null)
                        .map((_, index) => (
                          <LoadingCard key={`loading-card-${index}`} />
                        ))
                    : tokens.map((token, i) => {
                        if (token)
                          return (
                            <TokenCard
                              key={i}
                              token={
                                token as ReturnType<typeof useTokens>['data'][0]
                              }
                              mutate={mutate}
                              rarityEnabled={false}
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
                      })}
                  <Box ref={loadMoreRef}>
                    {hasNextPage && !isFetchingInitialData && <LoadingCard />}
                  </Box>
                  {hasNextPage && (
                    <>
                      {Array(10)
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

  if (COLLECTION_SET_ID) {
    tokensQuery.collectionsSetId = COLLECTION_SET_ID
    collectionsQuery.collectionsSetId = COLLECTION_SET_ID
  } else if (COMMUNITY) {
    tokensQuery.community = COMMUNITY
    collectionsQuery.community = COMMUNITY
  }

  const chainMap: Record<string, typeof supportedChains[0]> = {}
  const promises: ReturnType<typeof fetcher>[] = []
  supportedChains.forEach((chain) => {
    const headers = {
      headers: {
        'x-api-key': chain.apiKey || '',
      },
    }
    chainMap[chain.reservoirBaseUrl] = chain
    const tokensPromise = fetcher(
      `${chain.reservoirBaseUrl}/users/${address}/tokens/v6`,
      tokensQuery,
      headers
    )
    const collectionsPromise = fetcher(
      `${chain.reservoirBaseUrl}/users/${address}/collections/v2`,
      collectionsQuery,
      headers
    )
    promises.push(tokensPromise)
    promises.push(collectionsPromise)
  })

  const responses = await Promise.allSettled(promises)
  const collections: Record<number, any> = {}
  const tokens: Record<number, any> = {}
  responses.forEach((response) => {
    if (response.status === 'fulfilled') {
      const url = new URL(response.value.response.url)
      const chain = chainMap[url.origin]
      if (chain) {
        if (url.pathname.includes('collections')) {
          collections[chain.id] = response.value.data
        } else if (url.pathname.includes('tokens')) {
          tokens[chain.id] = response.value.data
        }
      }
    }
  })

  return {
    props: { ssr: { tokens, collections }, address, ensName },
    revalidate: 5,
  }
}

export default IndexPage
