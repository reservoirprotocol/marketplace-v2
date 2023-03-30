import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import { Text, Flex, Box } from '../../../components/primitives'
import {
  useCollections,
  useCollectionActivity,
  useDynamicTokens,
  useAttributes,
} from '@reservoir0x/reservoir-kit-ui'
import { paths } from '@reservoir0x/reservoir-sdk'
import Layout from 'components/Layout'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
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
import { CollectionActivityTable } from 'components/collections/CollectionActivityTable'
import { ActivityFilters } from 'components/common/ActivityFilters'
import { MobileAttributeFilters } from 'components/collections/filters/MobileAttributeFilters'
import { MobileActivityFilters } from 'components/common/MobileActivityFilters'
import LoadingCard from 'components/common/LoadingCard'
import { useMounted } from 'hooks'
import { NORMALIZE_ROYALTIES } from 'pages/_app'
import { faCopy, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import supportedChains, { DefaultChain } from 'utils/chains'
import { Head } from 'components/Head'
import CopyText from 'components/common/CopyText'
import { OpenSeaVerified } from 'components/common/OpenSeaVerified'
import { Address, useAccount } from 'wagmi'
import titleCase from 'utils/titleCase'
import Link from 'next/link'
import Img from 'components/primitives/Img'

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
  const { address } = useAccount()
  const [attributeFiltersOpen, setAttributeFiltersOpen] = useState(false)
  const [activityFiltersOpen, setActivityFiltersOpen] = useState(true)
  const [activityTypes, setActivityTypes] = useState<ActivityTypes>(['sale'])
  const [initialTokenFallbackData, setInitialTokenFallbackData] = useState(true)
  const isMounted = useMounted()
  const isSmallDevice = useMediaQuery({ maxWidth: 905 }) && isMounted
  const smallSubtitle = useMediaQuery({ maxWidth: 1150 }) && isMounted
  const [playingElement, setPlayingElement] = useState<
    HTMLAudioElement | HTMLVideoElement | null
  >()
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})

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

  let tokenQuery: Parameters<typeof useDynamicTokens>['0'] = {
    limit: 20,
    collection: id,
    sortBy: 'floorAskPrice',
    sortDirection: 'asc',
    includeQuantity: true,
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
    fetchNextPage,
    setSize,
    resetCache,
    isFetchingInitialData,
    isFetchingPage,
    hasNextPage,
  } = useDynamicTokens(tokenQuery, {
    fallbackData: initialTokenFallbackData ? [ssr.tokens] : undefined,
  })

  const attributesData = useAttributes(id)

  const attributes = useMemo(() => {
    if (!attributesData.data) {
      return []
    }
    return attributesData.data
      ?.filter(
        (attribute) => attribute.kind != 'number' && attribute.kind != 'range'
      )
      .sort((a, b) => a.key.localeCompare(b.key))
  }, [attributesData.data])

  if (attributeFiltersOpen && attributesData.response && !attributes.length) {
    setAttributeFiltersOpen(false)
  }

  let creatorRoyalties = collection?.royalties?.bps
    ? collection?.royalties?.bps * 0.01
    : 0
  let chain = titleCase(router.query.chain as string)

  const rarityEnabledCollection = Boolean(
    collection?.tokenCount &&
      +collection.tokenCount >= 2 &&
      attributes &&
      attributes?.length >= 2
  )

  //@ts-ignore: Ignore until we regenerate the types
  const contractKind = collection?.contractKind?.toUpperCase()

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      fetchNextPage()
    }
  }, [loadMoreObserver?.isIntersecting])

  useEffect(() => {
    if (isMounted && initialTokenFallbackData) {
      setInitialTokenFallbackData(false)
    }
  }, [router.query])

  return (
    <Layout>
      <Head
        ogImage={ssr?.collection?.collections?.[0]?.banner}
        title={ssr?.collection?.collections?.[0]?.name}
        description={ssr?.collection?.collections?.[0]?.description as string}
      />

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
                <Img
                  src={collection.image!}
                  width={64}
                  height={64}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 8,
                    objectFit: 'cover',
                  }}
                  alt="Collection Page Image"
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

                  {!smallSubtitle && (
                    <Flex align="end" css={{ gap: 24 }}>
                      <CopyText
                        text={collection.id as string}
                        css={{ width: 'max-content' }}
                      >
                        <Flex css={{ gap: '$2', width: 'max-content' }}>
                          {!isSmallDevice && (
                            <Text style="body1" color="subtle">
                              Collection
                            </Text>
                          )}
                          <Text
                            style="body1"
                            color={isSmallDevice ? 'subtle' : undefined}
                            as="p"
                          >
                            {truncateAddress(collection.id as string)}
                          </Text>
                          <Box css={{ color: '$gray10' }}>
                            <FontAwesomeIcon
                              icon={faCopy}
                              width={16}
                              height={16}
                            />
                          </Box>
                        </Flex>
                      </CopyText>
                      <Box>
                        <Text style="body1" color="subtle">
                          Token Standard{' '}
                        </Text>
                        <Text style="body1">{contractKind}</Text>
                      </Box>
                      <Box>
                        <Text style="body1" color="subtle">
                          Chain{' '}
                        </Text>
                        <Link
                          href={`/collection-rankings?chain=${router.query.chain}`}
                        >
                          <Text style="body1">{chain}</Text>
                        </Link>
                      </Box>
                      <Box>
                        <Text style="body1" color="subtle">
                          Creator Earnings
                        </Text>
                        <Text style="body1"> {creatorRoyalties}%</Text>
                      </Box>
                    </Flex>
                  )}
                </Box>
              </Flex>
            </Flex>
            <CollectionActions collection={collection} />
          </Flex>
          {smallSubtitle && (
            <Grid
              css={{
                gap: 12,
                mb: 24,
                gridTemplateColumns: '1fr 1fr',
                maxWidth: 550,
              }}
            >
              <CopyText
                text={collection.id as string}
                css={{ width: 'max-content' }}
              >
                <Flex css={{ width: 'max-content' }} direction="column">
                  <Text style="body1" color="subtle">
                    Collection
                  </Text>
                  <Flex css={{ gap: '$2' }}>
                    <Text style="body1" as="p">
                      {truncateAddress(collection.id as string)}
                    </Text>
                    <Box css={{ color: '$gray10' }}>
                      <FontAwesomeIcon icon={faCopy} width={16} height={16} />
                    </Box>
                  </Flex>
                </Flex>
              </CopyText>
              <Flex direction="column">
                <Text style="body1" color="subtle">
                  Token Standard{' '}
                </Text>
                <Text style="body1">{contractKind}</Text>
              </Flex>
              <Flex direction="column">
                <Text style="body1" color="subtle">
                  Chain{' '}
                </Text>
                <Text style="body1">{chain}</Text>
              </Flex>
              <Flex direction="column">
                <Text style="body1" color="subtle">
                  Creator Earnings
                </Text>
                <Text style="body1"> {creatorRoyalties}%</Text>
              </Flex>
            </Grid>
          )}
          <StatHeader collection={collection} />
          <Tabs.Root
            defaultValue="items"
            onValueChange={(value) => {
              if (value === 'items') {
                resetCache()
                setSize(1)
                mutate()
              }
            }}
          >
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
                            orderQuantity={
                              token?.market?.floorAsk?.quantityRemaining
                            }
                            address={address as Address}
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
                    <Box
                      ref={loadMoreRef}
                      css={{
                        display: isFetchingPage ? 'none' : 'block',
                      }}
                    >
                      {(hasNextPage || isFetchingPage) &&
                        !isFetchingInitialData && <LoadingCard />}
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
                  {tokens.length == 0 && !isFetchingPage && (
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
                  <CollectionActivityTable
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
    collection?: paths['/collections/v5']['get']['responses']['200']['schema']
    tokens?: paths['/tokens/v5']['get']['responses']['200']['schema']
    hasAttributes: boolean
  }
  id: string | undefined
}> = async ({ params }) => {
  const id = params?.contract?.toString()
  const { reservoirBaseUrl, apiKey, routePrefix } =
    supportedChains.find((chain) => params?.chain === chain.routePrefix) ||
    DefaultChain
  const headers: RequestInit = {
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

  const collectionsPromise = fetcher(
    `${reservoirBaseUrl}/collections/v5`,
    collectionQuery,
    headers
  )

  let tokensQuery: paths['/tokens/v5']['get']['parameters']['query'] = {
    collection: id,
    sortBy: 'floorAskPrice',
    sortDirection: 'asc',
    limit: 20,
    normalizeRoyalties: NORMALIZE_ROYALTIES,
    includeDynamicPricing: true,
    includeAttributes: true,
    includeQuantity: true,
  }

  const tokensPromise = fetcher(
    `${reservoirBaseUrl}/tokens/v5`,
    tokensQuery,
    headers
  )

  const promises = await Promise.allSettled([
    collectionsPromise,
    tokensPromise,
  ]).catch(() => {})
  const collection: Props['ssr']['collection'] =
    promises?.[0].status === 'fulfilled' && promises[0].value.data
      ? (promises[0].value.data as Props['ssr']['collection'])
      : {}
  const tokens: Props['ssr']['tokens'] =
    promises?.[1].status === 'fulfilled' && promises[1].value.data
      ? (promises[1].value.data as Props['ssr']['tokens'])
      : {}

  const hasAttributes =
    tokens?.tokens?.some(
      (token) => (token?.token?.attributes?.length || 0) > 0
    ) || false

  if (
    collection &&
    collection.collections?.[0].contractKind === 'erc1155' &&
    Number(collection?.collections?.[0].tokenCount) === 1 &&
    tokens?.tokens?.[0].token?.tokenId !== undefined
  ) {
    return {
      redirect: {
        destination: `/collection/${routePrefix}/${id}/${tokens.tokens[0].token.tokenId}`,
        permanent: false,
      },
    }
  }

  return {
    props: { ssr: { collection, tokens, hasAttributes }, id },
    revalidate: 30,
  }
}

export default CollectionPage
