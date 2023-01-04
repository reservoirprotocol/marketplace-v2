import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import { Text, Flex, Box, Grid } from '../../components/primitives'
import { paths } from '@reservoir0x/reservoir-sdk'
import Layout from 'components/Layout'
import fetcher from 'utils/fetcher'
import { useEnsAvatar, useEnsName, Address } from 'wagmi'
import { useCopyToClipboard, useIntersectionObserver } from 'usehooks-ts'
import { useMediaQuery } from 'react-responsive'
import { useContext, useEffect, useRef, useState } from 'react'
import { ToastContext } from 'context/ToastContextProvider'
import { Avatar } from 'components/primitives/Avatar'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { truncateAddress, truncateEns } from 'utils/truncate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { TabsList, TabsTrigger, TabsContent } from 'components/primitives/Tab'
import * as Tabs from '@radix-ui/react-tabs'
import {
  useCollectionActivity,
  useTokens,
  useUserTokens,
} from '@reservoir0x/reservoir-kit-ui'
import TokenCard from 'components/collections/TokenCard'
import { useMounted } from '../../hooks'
import { TokenFilters } from 'components/profile/TokenFilters'
import { FilterButton } from 'components/common/FilterButton'
import { UserAcivityTable } from 'components/profile/UserActivityTable'
import { MobileActivityFilters } from 'components/common/MobileActivityFilters'
import { ActivityFilters } from 'components/common/ActivityFilters'
import { MobileTokenFilters } from 'components/profile/MobileTokenFilters'
import LoadingCard from 'components/common/LoadingCard'

type Props = InferGetStaticPropsType<typeof getStaticProps>

type ActivityTypes = Exclude<
  NonNullable<
    NonNullable<
      Exclude<Parameters<typeof useCollectionActivity>['0'], boolean>
    >['types']
  >,
  string
>

const IndexPage: NextPage<Props> = ({ address, ssr }) => {
  const [filterCollection, setFilterCollection] = useState<string | undefined>(
    undefined
  )
  const [tokenFiltersOpen, setTokenFiltersOpen] = useState(true)
  const [activityFiltersOpen, setActivityFiltersOpen] = useState(true)
  const isSmallDevice = useMediaQuery({ maxWidth: 905 })
  const { data: ensAvatar } = useEnsAvatar(address as Address)
  const { data: ensName } = useEnsName(address as Address)
  const [value, copy] = useCopyToClipboard()
  const { addToast } = useContext(ToastContext)
  const [playingElement, setPlayingElement] = useState<
    HTMLAudioElement | HTMLVideoElement | null
  >()
  const isMounted = useMounted()
  const [activityTypes, setActivityTypes] = useState<ActivityTypes>(['sale'])

  const scrollRef = useRef<HTMLDivElement | null>(null)

  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {
    rootMargin: '0px 0px 300px 0px',
  })

  let tokenQuery: Parameters<typeof useUserTokens>['1'] = {
    limit: 20,
    normalizeRoyalties: true,
    collection: filterCollection,
  }

  const {
    data: tokens,
    mutate,
    fetchNextPage,
    isFetchingInitialData,
    hasNextPage,
  } = useUserTokens(address || '', tokenQuery, {
    fallback: ssr.tokens,
  })

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      fetchNextPage()
    }
  }, [loadMoreObserver?.isIntersecting])

  const collections = ssr.collections.collections

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
            <Text style="h4">
              {ensName
                ? truncateEns(ensName)
                : truncateAddress(address as string)}
            </Text>
            <Flex
              align="center"
              css={{ cursor: 'pointer' }}
              onClick={() => {
                copy(address as string)
                addToast?.({ title: 'Copied' })
              }}
            >
              <Text
                style="subtitle1"
                color="$gray11"
                css={{ color: '$gray11', mr: '$3' }}
              >
                {truncateAddress(address as string)}
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
                    : tokens.map((token, i) => (
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
                      ))}
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
                <UserAcivityTable
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

export const getStaticProps: GetStaticProps<{
  ssr: {
    tokens: paths['/users/{user}/tokens/v6']['get']['responses']['200']['schema']
    collections: paths['/users/{user}/collections/v2']['get']['responses']['200']['schema']
  }
  address: string | undefined
}> = async ({ params }) => {
  const address = params?.address?.toString()

  let tokensQuery: paths['/users/{user}/tokens/v6']['get']['parameters']['query'] =
    {
      limit: 20,
      normalizeRoyalties: true,
    }

  const tokensResponse = await fetcher(
    `/users/${address}/tokens/v6`,
    tokensQuery
  )

  const tokens: Props['ssr']['tokens'] = tokensResponse['data']

  let collectionsQuery: paths['/users/{user}/collections/v2']['get']['parameters']['query'] =
    {
      limit: 100,
    }

  const collectionsResponse = await fetcher(
    `users/${address}/collections/v2`,
    collectionsQuery
  )

  const collections: Props['ssr']['collections'] = collectionsResponse['data']

  return {
    props: { ssr: { tokens, collections }, address },
    revalidate: 20,
  }
}

export default IndexPage
