import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import {
  Text,
  Flex,
  Box,
  Input,
  FormatCrypto,
  FormatCryptoCurrency,
} from '../../../components/primitives'
import {
  useCollections,
  useCollectionActivity,
  useDynamicTokens,
  useAttributes,
} from '@reservoir0x/reservoir-kit-ui'
import { paths } from '@reservoir0x/reservoir-sdk'
import Layout from 'components/Layout'
import { useEffect, useMemo, useRef, useState } from 'react'
import { truncateAddress } from 'utils/truncate'
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
import { useDebounce } from 'usehooks-ts'

import { NAVBAR_HEIGHT } from 'components/navbar'
import { CollectionActivityTable } from 'components/collections/CollectionActivityTable'
import { ActivityFilters } from 'components/common/ActivityFilters'
import { MobileAttributeFilters } from 'components/collections/filters/MobileAttributeFilters'
import { MobileActivityFilters } from 'components/common/MobileActivityFilters'
import LoadingCard from 'components/common/LoadingCard'
import { useChainCurrency, useMounted } from 'hooks'
import { NORMALIZE_ROYALTIES } from 'pages/_app'
import {
  faCog,
  faCube,
  faGlobe,
  faHand,
  faMagnifyingGlass,
  faSeedling,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import supportedChains, { DefaultChain } from 'utils/chains'
import { Head } from 'components/Head'
import { OpenSeaVerified } from 'components/common/OpenSeaVerified'
import { Address, useAccount } from 'wagmi'
import Img from 'components/primitives/Img'
import Sweep from 'components/buttons/Sweep'
import Mint from 'components/buttons/Mint'
import optimizeImage from 'utils/optimizeImage'
import CopyText from 'components/common/CopyText'
import { CollectionDetails } from 'components/collections/CollectionDetails'
import useTokenUpdateStream from 'hooks/useTokenUpdateStream'
import LiveState from 'components/common/LiveState'
import { formatUnits } from 'viem'

type ActivityTypes = Exclude<
  NonNullable<
    NonNullable<
      Exclude<Parameters<typeof useCollectionActivity>['0'], boolean>
    >['types']
  >,
  string
>

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const CollectionPage: NextPage<Props> = ({ id, ssr }) => {
  const router = useRouter()
  const { address } = useAccount()
  const [attributeFiltersOpen, setAttributeFiltersOpen] = useState(false)
  const [activityFiltersOpen, setActivityFiltersOpen] = useState(true)
  const [tokenSearchQuery, setTokenSearchQuery] = useState<string>('')
  const chainCurrency = useChainCurrency()
  const debouncedSearch = useDebounce(tokenSearchQuery, 500)
  const [socketState, setSocketState] = useState<SocketState>(null)
  const [activityTypes, setActivityTypes] = useState<ActivityTypes>([
    'sale',
    'mint',
  ])
  const [initialTokenFallbackData, setInitialTokenFallbackData] = useState(true)
  const isMounted = useMounted()
  const isSmallDevice = useMediaQuery({ maxWidth: 905 }) && isMounted
  const [playingElement, setPlayingElement] = useState<
    HTMLAudioElement | HTMLVideoElement | null
  >()
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})
  const [path, _] = router.asPath.split('?')
  const routerPath = path.split('/')
  const isSweepRoute = routerPath[routerPath.length - 1] === 'sweep'
  const isMintRoute = routerPath[routerPath.length - 1] === 'mint'
  const sweepOpenState = useState(true)
  const mintOpenState = useState(true)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const collectionChain =
    supportedChains.find(
      (chain) => router.query?.chain === chain.routePrefix
    ) || DefaultChain

  const scrollToTop = () => {
    let top = (scrollRef.current?.offsetTop || 0) - (NAVBAR_HEIGHT + 16)
    window.scrollTo({ top: top })
  }

  let chainName = collectionChain?.name

  let collectionQuery: Parameters<typeof useCollections>['0'] = {
    id,
    includeSalesCount: true,
    includeMintStages: true,
    includeSecurityConfigs: true,
  }

  const { data: collections } = useCollections(collectionQuery, {
    fallbackData: [ssr.collection],
  })

  let collection = collections && collections[0]

  const mintData = collection?.mintStages?.find(
    (stage) => stage.kind === 'public'
  )

  const mintPriceDecimal = mintData?.price?.amount?.decimal
  const mintCurrency = mintData?.price?.currency?.symbol?.toUpperCase()

  const mintPrice =
    typeof mintPriceDecimal === 'number' &&
    mintPriceDecimal !== null &&
    mintPriceDecimal !== undefined
      ? mintPriceDecimal === 0
        ? 'Free'
        : `${mintPriceDecimal} ${mintCurrency}`
      : undefined

  let tokenQuery: Parameters<typeof useDynamicTokens>['0'] = {
    limit: 20,
    collection: id,
    sortBy: 'floorAskPrice',
    sortDirection: 'asc',
    includeQuantity: true,
    includeLastSale: true,
    ...(debouncedSearch.length > 0 && {
      tokenName: debouncedSearch,
    }),
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

  useTokenUpdateStream(id as string, collectionChain.id, {
    onClose: () => setSocketState(0),
    onOpen: () => setSocketState(1),
    onMessage: ({
      data: reservoirEvent,
    }: MessageEvent<ReservoirWebsocketIncomingEvent>) => {
      if (Object.keys(router.query).some((key) => key.includes('attribute')))
        return

      const tokenName = reservoirEvent.data.token.name || ''
      if (
        tokenSearchQuery &&
        tokenSearchQuery.length > 0 &&
        !tokenName.includes(tokenSearchQuery)
      ) {
        return
      }

      let hasChange = false

      const newTokens = [...tokens]
      const price = NORMALIZE_ROYALTIES
        ? reservoirEvent.data?.market?.floorAskNormalized?.price?.amount?.native
        : reservoirEvent.data?.market?.floorAsk?.price?.amount?.native
      const tokenIndex = tokens.findIndex(
        (token) => token.token?.tokenId === reservoirEvent?.data.token.tokenId
      )
      const token = tokenIndex > -1 ? tokens[tokenIndex] : null
      if (token) {
        if (token?.market?.floorAsk?.dynamicPricing) {
          return
        }
        newTokens.splice(tokenIndex, 1)
      }

      if (!price) {
        if (token) {
          const endOfListingsIndex = tokens.findIndex(
            (token) => !token.market?.floorAsk?.price?.amount?.native
          )
          if (endOfListingsIndex === -1) {
            hasChange = true
          } else {
            const newTokenIndex =
              sortBy === 'rarity'
                ? tokenIndex
                : endOfListingsIndex > -1
                ? endOfListingsIndex
                : 0
            newTokens.splice(newTokenIndex, 0, {
              ...token,
              market: {
                floorAsk: {
                  id: undefined,
                  price: undefined,
                  maker: undefined,
                  validFrom: undefined,
                  validUntil: undefined,
                  source: {},
                },
              },
            })
            hasChange = true
          }
        }
      } else {
        let updatedToken = token ? token : reservoirEvent.data
        updatedToken = {
          ...updatedToken,
          market: {
            floorAsk: NORMALIZE_ROYALTIES
              ? reservoirEvent.data.market.floorAskNormalized
              : reservoirEvent.data.market.floorAsk,
          },
        }
        if (tokens) {
          let updatedTokenPosition =
            sortBy === 'rarity'
              ? tokenIndex
              : tokens.findIndex((token) => {
                  let currentTokenPrice =
                    token.market?.floorAsk?.price?.amount?.native
                  if (currentTokenPrice !== undefined) {
                    return sortDirection === 'desc'
                      ? updatedToken.market.floorAsk.price.amount.native >=
                          currentTokenPrice
                      : updatedToken.market.floorAsk.price.amount.native <=
                          currentTokenPrice
                  }
                  return true
                })
          if (updatedTokenPosition <= -1) {
            return
          }

          newTokens.splice(updatedTokenPosition, 0, updatedToken)
          hasChange = true
        }
      }
      if (hasChange) {
        mutate(
          [
            {
              tokens: newTokens,
            },
          ],
          {
            revalidate: false,
            optimisticData: [
              {
                tokens: newTokens,
              },
            ],
          }
        )
      }
    },
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

  const rarityEnabledCollection = Boolean(
    collection?.tokenCount &&
      +collection.tokenCount >= 2 &&
      attributes &&
      attributes?.length >= 2
  )

  const hasSecurityConfig =
    typeof collection?.securityConfig?.transferSecurityLevel === 'number'

  const contractKind = `${collection?.contractKind?.toUpperCase()}${
    hasSecurityConfig ? 'C' : ''
  }`

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

  let sweepSymbol = collection?.floorAsk?.price?.currency?.symbol
  let topBidPrice = collection?.topBid?.price?.amount?.native

  return (
    <Layout>
      <Head
        ogImage={ssr?.collection?.collections?.[0]?.banner}
        title={ssr?.collection?.collections?.[0]?.name}
        description={ssr?.collection?.collections?.[0]?.description as string}
      />
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
        {collection ? (
          <Flex
            direction="column"
            css={{
              px: '$4',
              pt: '$4',
              pb: 0,
              '@md': {
                px: '$5',
              },

              '@xl': {
                px: '$6',
              },
            }}
          >
            <Flex
              justify="between"
              wrap="wrap"
              css={{ mb: '$4', gap: '$4' }}
              align="start"
            >
              <Flex
                direction="column"
                css={{
                  gap: '$4',
                  minWidth: 0,
                  //flex: 1,
                  width: '100%',
                  '@lg': { width: 'unset' },
                }}
              >
                <Flex css={{ gap: '$4', flex: 1 }} align="center">
                  <Img
                    src={optimizeImage(collection.image!, 72 * 2)}
                    width={72}
                    height={72}
                    css={{
                      width: 72,
                      height: 72,
                      borderRadius: 8,
                      objectFit: 'cover',
                      border: '1px solid $gray5',
                    }}
                    alt="Collection Page Image"
                  />
                  <Box css={{ minWidth: 0 }}>
                    <Flex align="center" css={{ gap: '$1', mb: 0 }}>
                      <Text style="h4" as="h6" ellipsify>
                        {collection.name}
                      </Text>
                      <OpenSeaVerified
                        openseaVerificationStatus={
                          collection?.openseaVerificationStatus
                        }
                      />
                    </Flex>
                    <Flex
                      css={{
                        gap: '$3',
                        ...(isSmallDevice && {
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                        }),
                      }}
                      align="center"
                    >
                      <CopyText
                        text={collection.id as string}
                        css={{
                          width: 'max-content',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '$1',
                        }}
                      >
                        <Box css={{ color: '$gray9' }}>
                          <FontAwesomeIcon icon={faCube} size="xs" />
                        </Box>
                        <Text as="p" style="body3">
                          {truncateAddress(collection?.primaryContract || '')}
                        </Text>
                      </CopyText>
                      <Flex
                        align="center"
                        css={{
                          gap: '$1',
                        }}
                      >
                        <Flex
                          css={{
                            color: '$gray9',
                          }}
                        >
                          <FontAwesomeIcon size="xs" icon={faCog} />
                        </Flex>
                        <Text style="body3">{contractKind}</Text>
                      </Flex>

                      <Flex
                        align="center"
                        css={{
                          gap: '$1',
                        }}
                      >
                        <Flex
                          css={{
                            color: '$gray9',
                          }}
                        >
                          <FontAwesomeIcon size="xs" icon={faGlobe} />
                        </Flex>
                        <Text style="body3">{chainName}</Text>
                      </Flex>

                      {mintData && (
                        <Flex
                          align="center"
                          css={{
                            gap: '$1',
                          }}
                        >
                          <Flex
                            css={{
                              color: '$green9',
                            }}
                          >
                            <FontAwesomeIcon size="xs" icon={faSeedling} />
                          </Flex>
                          <Text style="body3">Minting Now</Text>
                        </Flex>
                      )}
                    </Flex>
                  </Box>
                </Flex>
              </Flex>
              <Flex align="center">
                <Flex css={{ alignItems: 'center', gap: '$3' }}>
                  {collection?.floorAsk?.price?.amount?.raw && sweepSymbol ? (
                    <Sweep
                      collectionId={collection.id}
                      openState={isSweepRoute ? sweepOpenState : undefined}
                      buttonChildren={
                        <Flex
                          css={{ gap: '$2' }}
                          align="center"
                          justify="center"
                        >
                          <Text style="h6" as="h6" css={{ color: '$bg' }}>
                            Collect
                          </Text>
                          <Text
                            style="h6"
                            as="h6"
                            css={{ color: '$bg', fontWeight: 900 }}
                          >
                            <Flex
                              css={{
                                gap: '$1',
                              }}
                            >
                              <FormatCrypto
                                amount={
                                  collection?.floorAsk?.price?.amount?.raw
                                }
                                decimals={
                                  collection?.floorAsk?.price?.currency
                                    ?.decimals
                                }
                                textStyle="h6"
                                css={{ color: '$bg', fontWeight: 900 }}
                                maximumFractionDigits={4}
                              />
                              {sweepSymbol}
                            </Flex>
                          </Text>
                        </Flex>
                      }
                      buttonCss={{ '@lg': { order: 2 } }}
                      mutate={mutate}
                    />
                  ) : null}
                  {/* Collection Mint */}
                  {mintData && mintPrice ? (
                    <Mint
                      collectionId={collection.id}
                      openState={isMintRoute ? mintOpenState : undefined}
                      buttonChildren={
                        <Flex
                          css={{ gap: '$2', px: '$2' }}
                          align="center"
                          justify="center"
                        >
                          {isSmallDevice && (
                            <FontAwesomeIcon icon={faSeedling} />
                          )}
                          {!isSmallDevice && (
                            <Text style="h6" as="h6" css={{ color: '$bg' }}>
                              Mint
                            </Text>
                          )}

                          {!isSmallDevice && (
                            <Text
                              style="h6"
                              as="h6"
                              css={{ color: '$bg', fontWeight: 900 }}
                            >
                              {`${mintPrice}`}
                            </Text>
                          )}
                        </Flex>
                      }
                      buttonCss={{
                        minWidth: 'max-content',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        flexGrow: 1,
                        justifyContent: 'center',
                        px: '$2',
                        maxWidth: '220px',
                        '@md': {
                          order: 1,
                        },
                      }}
                      mutate={mutate}
                    />
                  ) : null}
                  <CollectionOffer
                    collection={collection}
                    buttonChildren={<FontAwesomeIcon icon={faHand} />}
                    buttonProps={{ color: mintData ? 'gray3' : 'primary' }}
                    buttonCss={{ px: '$4' }}
                    mutate={mutate}
                  />
                </Flex>
              </Flex>
            </Flex>

            <TabsList css={{ mt: 0 }}>
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
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
                  <>
                    <AttributeFilters
                      attributes={attributes}
                      open={attributeFiltersOpen}
                      setOpen={setAttributeFiltersOpen}
                      scrollToTop={scrollToTop}
                    />
                  </>
                )}
                <Box
                  css={{
                    flex: 1,
                    width: '100%',
                  }}
                >
                  <Flex css={{ marginBottom: '$4', gap: '$3' }} align="center">
                    <Flex align="center" css={{ gap: '$3', flex: 1 }}>
                      {attributes &&
                        attributes.length > 0 &&
                        !isSmallDevice && (
                          <FilterButton
                            open={attributeFiltersOpen}
                            setOpen={setAttributeFiltersOpen}
                          />
                        )}
                      {!isSmallDevice && (
                        <Box
                          css={{ position: 'relative', flex: 1, maxWidth: 420 }}
                        >
                          <Box
                            css={{
                              position: 'absolute',
                              top: '50%',
                              left: '$4',
                              zIndex: 2,
                              transform: 'translate(0, -50%)',
                              color: '$gray11',
                            }}
                          >
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                          </Box>
                          <Input
                            css={{ pl: 42 }}
                            placeholder="Search by token name"
                            onChange={(e) => {
                              setTokenSearchQuery(e.target.value)
                            }}
                            value={tokenSearchQuery}
                          />
                        </Box>
                      )}
                    </Flex>
                    {socketState !== null && <LiveState />}
                    <Flex
                      justify={'end'}
                      css={{
                        width: '100%',
                        gap: '$2',
                        '@md': {
                          width: 'max-content',
                          gap: '$3',
                        },
                      }}
                    >
                      <SortTokens
                        css={{
                          order: 4,
                          px: '14px',
                          justifyContent: 'center',
                          '@md': {
                            order: 1,
                            width: '220px',
                            height: '48px',
                            minWidth: 'max-content',
                            px: '$5',
                          },
                        }}
                      />
                    </Flex>
                  </Flex>

                  {!isSmallDevice && (
                    <SelectedAttributes
                      collection={collection}
                      mutate={mutate}
                    />
                  )}
                  <Flex
                    css={{
                      gap: '$4',
                      mb: '$3',
                      flexWrap: 'wrap',
                      '@bp800': {
                        display: 'flex',
                      },
                      display: 'flex',
                    }}
                  >
                    <Flex css={{ gap: '$1' }}>
                      <Text style="body1" as="p" color="subtle">
                        Floor
                      </Text>
                      <Text style="body1" as="p" css={{ fontWeight: '700' }}>
                        {collection?.floorAsk?.price?.amount?.raw &&
                        sweepSymbol ? (
                          <Flex
                            css={{
                              gap: '$2',
                            }}
                          >
                            <FormatCryptoCurrency
                              amount={collection?.floorAsk?.price?.amount?.raw}
                              decimals={
                                collection?.floorAsk?.price?.currency?.decimals
                              }
                              logoHeight={14}
                              textStyle="subtitle1"
                              maximumFractionDigits={4}
                            />
                            {sweepSymbol}
                          </Flex>
                        ) : (
                          '-'
                        )}
                      </Text>
                    </Flex>
                    <Flex css={{ gap: '$1' }}>
                      <Text style="body1" as="p" color="subtle">
                        Top Bid
                      </Text>
                      <Text style="body1" as="p" css={{ fontWeight: '700' }}>
                        {topBidPrice
                          ? `${topBidPrice?.toFixed(2) || 0} ${
                              chainCurrency.symbol
                            }`
                          : '-'}
                      </Text>
                    </Flex>
                    <Flex css={{ gap: '$1' }}>
                      <Text style="body1" as="p" color="subtle">
                        Count
                      </Text>
                      <Text style="body1" as="p" css={{ fontWeight: '700' }}>
                        {Number(collection?.tokenCount)?.toLocaleString()}
                      </Text>
                    </Flex>
                  </Flex>
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
                            addToCartEnabled={
                              token.market?.floorAsk?.maker?.toLowerCase() !==
                              address?.toLowerCase()
                            }
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
            <TabsContent value="details">
              <CollectionDetails
                collection={collection}
                collectionId={id}
                tokens={tokens}
              />
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
          </Flex>
        ) : (
          <Box />
        )}
      </Tabs.Root>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<{
  ssr: {
    collection?: paths['/collections/v7']['get']['responses']['200']['schema']
    tokens?: paths['/tokens/v6']['get']['responses']['200']['schema']
    hasAttributes: boolean
  }
  id: string | undefined
}> = async ({ params, res }) => {
  const id = params?.contract?.toString()
  const { reservoirBaseUrl } =
    supportedChains.find((chain) => params?.chain === chain.routePrefix) ||
    DefaultChain
  const headers: RequestInit = {
    headers: {
      'x-api-key': process.env.RESERVOIR_API_KEY || '',
    },
  }

  let collectionQuery: paths['/collections/v7']['get']['parameters']['query'] =
    {
      id,
      includeSalesCount: true,
      normalizeRoyalties: NORMALIZE_ROYALTIES,
    }

  const collectionsPromise = fetcher(
    `${reservoirBaseUrl}/collections/v7`,
    collectionQuery,
    headers
  )

  let tokensQuery: paths['/tokens/v6']['get']['parameters']['query'] = {
    collection: id,
    sortBy: 'floorAskPrice',
    sortDirection: 'asc',
    limit: 20,
    normalizeRoyalties: NORMALIZE_ROYALTIES,
    includeDynamicPricing: true,
    includeAttributes: true,
    includeQuantity: true,
    includeLastSale: true,
  }

  const tokensPromise = fetcher(
    `${reservoirBaseUrl}/tokens/v6`,
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

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=30, stale-while-revalidate=60'
  )

  return {
    props: { ssr: { collection, tokens, hasAttributes }, id },
  }
}

export default CollectionPage
