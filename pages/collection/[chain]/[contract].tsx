import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import { Text, Flex, Box } from '../../../components/primitives'
import {
  useCollections,
  useTokens,
  useCollectionActivity,
} from '@reservoir0x/reservoir-kit-ui'
import { paths } from '@reservoir0x/reservoir-sdk'
import Layout from 'components/Layout'
import { useEffect, useRef, useState } from 'react'
import { truncateAddress } from 'utils/truncate'
import StatHeader from 'components/collections/StatHeader'
import CollectionActions from 'components/collections/CollectionActions'
import TokenCard from 'components/collections/TokenCard'
import { AttributeFilters } from 'components/collections/filters/AttributeFilters'
import { FilterButton } from 'components/common/FilterButton'
import SelectedAttributes from 'components/collections/filters/SelectedAttributes'
import { CollectionOffer } from 'components/buttons'
import { Grid } from 'components/primitives/Grid'
import { useIntersectionObserver } from 'usehooks-ts'
import fetcher from 'utils/fetcher'
import { useRouter } from 'next/router'
import { SortTokens } from 'components/collections/SortTokens'
import { useMediaQuery } from 'react-responsive'
import { TabsList, TabsTrigger, TabsContent } from 'components/primitives/Tab'
import * as Tabs from '@radix-ui/react-tabs'
import { NAVBAR_HEIGHT } from 'components/navbar'
import { CollectionAcivityTable } from 'components/collections/CollectionActivityTable'
import { ActivityFilters } from 'components/common/ActivityFilters'
import { MobileAttributeFilters } from 'components/collections/filters/MobileAttributeFilters'
import { MobileActivityFilters } from 'components/common/MobileActivityFilters'
import LoadingCard from 'components/common/LoadingCard'
import { useMounted } from 'hooks'
import { NORMALIZE_ROYALTIES } from 'pages/_app'
import { faCopy, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import supportedChains, { DefaultChain } from 'utils/chains'
import Head from 'next/head'
import CopyText from 'components/common/CopyText'
import { OpenSeaVerified } from 'components/common/OpenSeaVerified'

type ActivityTypes = Exclude<
  NonNullable<
    NonNullable<
      Exclude<Parameters<typeof useCollectionActivity>['0'], boolean>
    >['types']
  >,
  string
>

type Props = InferGetStaticPropsType<typeof getStaticProps>

const CollectionPage: NextPage<Props> = ({ id, ssr }) => {
  const router = useRouter()
  const [attributeFiltersOpen, setAttributeFiltersOpen] = useState(true)
  const [activityFiltersOpen, setActivityFiltersOpen] = useState(true)
  const [activityTypes, setActivityTypes] = useState<ActivityTypes>(['sale'])
  const [initialTokenFallbackData, setInitialTokenFallbackData] = useState(true)
  const isMounted = useMounted()
  const isSmallDevice = useMediaQuery({ maxWidth: 905 }) && isMounted
  const [playingElement, setPlayingElement] = useState<
    HTMLAudioElement | HTMLVideoElement | null
  >()
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {
    rootMargin: '0px 0px 300px 0px',
  })

  const scrollRef = useRef<HTMLDivElement | null>(null)

  const scrollToTop = () => {
    let top = (scrollRef.current?.offsetTop || 0) - (NAVBAR_HEIGHT + 16)
    window.scrollTo({ top: top })
  }

  let collectionQuery: Parameters<typeof useCollections>['0'] = {
    id,
    includeTopBid: true,
  }

  const { data: collections } = useCollections(collectionQuery, {
    fallbackData: [ssr.collection],
  })

  let collection = collections && collections[0]

  let tokenQuery: Parameters<typeof useTokens>['0'] = {
    limit: 20,
    collection: id,
    sortBy: 'floorAskPrice',
    sortDirection: 'asc',
  }

  const sortDirection = router.query['sortDirection']?.toString()
  const sortBy = router.query['sortBy']?.toString()

  if (sortBy === 'tokenId' || sortBy === 'rarity') tokenQuery.sortBy = sortBy
  if (sortDirection === 'desc') tokenQuery.sortDirection = 'desc'

  // Extract all queries of attribute type
  Object.keys({ ...router.query }).map((key) => {
    if (
      key.startsWith('attributes[') &&
      key.endsWith(']') &&
      router.query[key] !== ''
    ) {
      //@ts-ignore
      tokenQuery[key] = router.query[key]
    }
  })

  const {
    data: tokens,
    mutate,
    resetCache,
    fetchNextPage,
    isFetchingInitialData,
    isFetchingPage,
    hasNextPage,
  } = useTokens(tokenQuery, {
    fallbackData: initialTokenFallbackData ? [ssr.tokens] : undefined,
  })

  const attributes = ssr?.attributes?.attributes?.filter(
    (attribute) => attribute.kind != 'number' && attribute.kind != 'range'
  )

  const rarityEnabledCollection = Boolean(
    collection?.tokenCount &&
      +collection.tokenCount >= 2 &&
      attributes &&
      attributes?.length >= 2
  )

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      fetchNextPage()
    }
  }, [loadMoreObserver?.isIntersecting])

  useEffect(() => {
    resetCache()
    if (isMounted && initialTokenFallbackData) {
      setInitialTokenFallbackData(false)
    }
  }, [router.query])

  return (
    <Layout>
      <Head>
        <title>{ssr?.collection?.collections?.[0]?.name}</title>
        <meta
          name="description"
          content={ssr?.collection?.collections?.[0]?.description as string}
        />
        <meta
          property="twitter:title"
          content={ssr?.collection?.collections?.[0]?.name}
        />
        <meta
          name="twitter:image"
          content={ssr?.collection?.collections?.[0]?.banner}
        />
        <meta
          property="og:title"
          content={ssr?.collection?.collections?.[0]?.name}
        />
        <meta
          property="og:image"
          content={ssr?.collection?.collections?.[0]?.banner}
        />
      </Head>
      {collection ? (
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
          <Flex justify="between" css={{ mb: '$4' }}>
            <Flex direction="column" css={{ gap: '$4', minWidth: 0 }}>
              <Flex css={{ gap: '$4', flex: 1 }} align="center">
                <img
                  src={collection.image}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 8,
                    objectFit: 'cover',
                  }}
                />
                <Box css={{ minWidth: 0 }}>
                  <Flex align="center" css={{ gap: '$2' }}>
                    <Text style="h5" as="h6" ellipsify>
                      {collection.name}
                    </Text>
                    <OpenSeaVerified
                      openseaVerificationStatus={
                        collection?.openseaVerificationStatus
                      }
                    />
                  </Flex>

                  <CopyText
                    text={collection.id as string}
                    css={{ width: 'max-content' }}
                  >
                    <Flex css={{ gap: '$2', mt: '$2', width: 'max-content' }}>
                      <Text style="body1" css={{ color: '$gray11' }} as="p">
                        {truncateAddress(collection.id as string)}
                      </Text>
                      <Box css={{ color: '$gray10' }}>
                        <FontAwesomeIcon icon={faCopy} width={16} height={16} />
                      </Box>
                    </Flex>
                  </CopyText>
                </Box>
              </Flex>
            </Flex>
            <CollectionActions collection={collection} />
          </Flex>
          <StatHeader collection={collection} />
          <Tabs.Root defaultValue="items">
            <TabsList>
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="items">
              <Flex
                css={{
                  gap: attributeFiltersOpen ? '$5' : '',
                  position: 'relative',
                }}
                ref={scrollRef}
              >
                {isSmallDevice ? (
                  <MobileAttributeFilters
                    attributes={attributes}
                    scrollToTop={scrollToTop}
                  />
                ) : (
                  <AttributeFilters
                    attributes={attributes}
                    open={attributeFiltersOpen}
                    setOpen={setAttributeFiltersOpen}
                    scrollToTop={scrollToTop}
                  />
                )}
                <Box
                  css={{
                    flex: 1,
                    width: '100%',
                  }}
                >
                  <Flex justify="between" css={{ marginBottom: '$4' }}>
                    {attributes && attributes.length > 0 && !isSmallDevice && (
                      <FilterButton
                        open={attributeFiltersOpen}
                        setOpen={setAttributeFiltersOpen}
                      />
                    )}
                    <Flex
                      css={{
                        ml: 'auto',
                        width: '100%',
                        flexDirection: 'row-reverse',
                        gap: '$3',
                        '@md': {
                          flexDirection: 'row',
                          width: 'max-content',
                          gap: '$4',
                        },
                      }}
                    >
                      <SortTokens />
                      <CollectionOffer
                        collection={collection}
                        buttonCss={{
                          width: '100%',
                          justifyContent: 'center',
                          '@sm': {
                            maxWidth: '220px',
                          },
                        }}
                      />
                    </Flex>
                  </Flex>
                  {!isSmallDevice && <SelectedAttributes />}
                  <Grid
                    css={{
                      gap: '$4',
                      pb: '$6',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(200px, 1fr))',
                      '@md': {
                        gridTemplateColumns:
                          'repeat(auto-fill, minmax(240px, 1fr))',
                      },
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
                            token={token}
                            mutate={mutate}
                            rarityEnabled={rarityEnabledCollection}
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
                      {(hasNextPage || isFetchingPage) &&
                        !isFetchingInitialData && <LoadingCard />}
                    </Box>
                    {(hasNextPage || isFetchingPage) && (
                      <>
                        {Array(10)
                          .fill(null)
                          .map((_, index) => (
                            <LoadingCard key={`loading-card-${index}`} />
                          ))}
                      </>
                    )}
                  </Grid>
                  {tokens.length == 0 && (
                    <Flex
                      direction="column"
                      align="center"
                      css={{ py: '$6', gap: '$4' }}
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
                {isSmallDevice ? (
                  <MobileActivityFilters
                    activityTypes={activityTypes}
                    setActivityTypes={setActivityTypes}
                  />
                ) : (
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
                  {!isSmallDevice && (
                    <FilterButton
                      open={activityFiltersOpen}
                      setOpen={setActivityFiltersOpen}
                    />
                  )}
                  <CollectionAcivityTable
                    id={id}
                    activityTypes={activityTypes}
                  />
                </Box>
              </Flex>
            </TabsContent>
          </Tabs.Root>
        </Flex>
      ) : (
        <Box />
      )}
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
    collection: paths['/collections/v5']['get']['responses']['200']['schema']
    tokens: paths['/tokens/v5']['get']['responses']['200']['schema']
    attributes?: paths['/collections/{collection}/attributes/all/v2']['get']['responses']['200']['schema']
  }
  id: string | undefined
}> = async ({ params }) => {
  const id = params?.contract?.toString()
  const { reservoirBaseUrl, apiKey } =
    supportedChains.find((chain) => params?.chain === chain.routePrefix) ||
    DefaultChain
  const headers = {
    headers: {
      'x-api-key': apiKey || '',
    },
  }

  let collectionQuery: paths['/collections/v5']['get']['parameters']['query'] =
    {
      id,
      includeTopBid: true,
      normalizeRoyalties: NORMALIZE_ROYALTIES,
    }

  const collectionsResponse = await fetcher(
    `${reservoirBaseUrl}/collections/v5`,
    collectionQuery,
    headers
  )
  const collection: Props['ssr']['collection'] = collectionsResponse['data']

  let tokensQuery: paths['/tokens/v5']['get']['parameters']['query'] = {
    collection: id,
    sortBy: 'floorAskPrice',
    sortDirection: 'asc',
    limit: 20,
    normalizeRoyalties: NORMALIZE_ROYALTIES,
  }

  const tokensResponse = await fetcher(
    `${reservoirBaseUrl}/tokens/v5`,
    tokensQuery,
    headers
  )

  const tokens: Props['ssr']['tokens'] = tokensResponse['data']
  let attributes: Props['ssr']['attributes'] | undefined
  try {
    const attributesResponse = await fetcher(
      `${reservoirBaseUrl}/collections/${id}/attributes/all/v2`,
      {},
      headers
    )
    attributes = attributesResponse['data']
  } catch (e) {
    console.log('Failed to load attributes')
  }

  return {
    props: { ssr: { collection, tokens, attributes }, id },
    revalidate: 20,
  }
}

export default CollectionPage
