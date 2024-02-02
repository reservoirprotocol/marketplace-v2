import {
  faArrowLeft,
  faChevronDown,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Tabs from '@radix-ui/react-tabs'
import {
  TokenMedia,
  useAttributes,
  useBids,
  useCollections,
  useDynamicTokens,
  useListings,
  useTokenActivity,
  useUserTokens,
} from '@reservoir0x/reservoir-kit-ui'
import { paths } from '@reservoir0x/reservoir-sdk'
import { ActivityFilters } from 'components/token/ActivityFilters'
import { spin } from 'components/common/LoadingSpinner'
import { MobileActivityFilters } from 'components/common/MobileActivityFilters'
import { OpenSeaVerified } from 'components/common/OpenSeaVerified'
import Layout from 'components/Layout'
import { Anchor, Box, Button, Flex, Grid, Text } from 'components/primitives'
import { Dropdown } from 'components/primitives/Dropdown'
import { TabsContent, TabsList, TabsTrigger } from 'components/primitives/Tab'
import AttributeCard from 'components/token/AttributeCard'
import FullscreenMedia from 'components/token/FullscreenMedia'
import { PriceData } from 'components/token/PriceData'
import RarityRank from 'components/token/RarityRank'
import { TokenActions } from 'components/token/TokenActions'
import { TokenActivityTable } from 'components/token/ActivityTable'
import { TokenInfo } from 'components/token/TokenInfo'
import { ToastContext } from 'context/ToastContextProvider'
import { useENSResolver, useMarketplaceChain, useMounted } from 'hooks'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NORMALIZE_ROYALTIES } from 'pages/_app'
import { useContext, useEffect, useState } from 'react'
import { jsNumberForAddress } from 'react-jazzicon'
import Jazzicon from 'react-jazzicon/dist/Jazzicon'
import { useMediaQuery } from 'react-responsive'
import supportedChains, { DefaultChain } from 'utils/chains'
import fetcher from 'utils/fetcher'
import { DATE_REGEX, timeTill } from 'utils/till'
import titleCase from 'utils/titleCase'
import { useAccount } from 'wagmi'
import { Head } from 'components/Head'
import { OffersTable } from 'components/token/OffersTable'
import { ListingsTable } from 'components/token/ListingsTable'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

type ActivityTypes = Exclude<
  NonNullable<
    NonNullable<
      Exclude<Parameters<typeof useTokenActivity>['1'], boolean>
    >['types']
  >,
  string
>

const IndexPage: NextPage<Props> = ({ assetId, ssr }) => {
  const assetIdPieces = assetId ? assetId.toString().split(':') : []
  let collectionId = assetIdPieces[0]
  const id = assetIdPieces[1]
  const router = useRouter()
  const { addToast } = useContext(ToastContext)
  const account = useAccount()
  const isMounted = useMounted()
  const isSmallDevice = useMediaQuery({ maxWidth: 900 }) && isMounted
  const [tabValue, setTabValue] = useState('info')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [activityFiltersOpen, setActivityFiltersOpen] = useState(true)
  const [activityTypes, setActivityTypes] = useState<ActivityTypes>([])
  const [activityNames, setActivityNames] = useState<string[]>([])

  const { proxyApi } = useMarketplaceChain()
  const contract = collectionId ? collectionId?.split(':')[0] : undefined

  const { data: tokens, mutate } = useDynamicTokens(
    {
      tokens: [`${contract}:${id}`],
      includeAttributes: true,
      includeTopBid: true,
      includeQuantity: true,
    },
    {
      fallbackData: [ssr.tokens ? ssr.tokens : {}],
    }
  )

  const token = tokens && tokens[0] ? tokens[0] : undefined
  const is1155 = token?.token?.kind === 'erc1155'

  const { data: collections } = useCollections(
    {
      includeSecurityConfigs: true,
      includeMintStages: true,
      id: token?.token?.collection?.id,
    },
    {
      fallbackData: [ssr.collection ? ssr.collection : {}],
    }
  )
  const collection = collections && collections[0] ? collections[0] : null

  const { data: userTokens } = useUserTokens(
    is1155 ? account.address : undefined,
    {
      tokens: [`${contract}:${id}`],
      limit: 20,
    }
  )

  const { data: offers } = useBids({
    token: `${token?.token?.collection?.id}:${token?.token?.tokenId}`,
    includeRawData: true,
    sortBy: 'price',
    limit: 1,
  })

  const { data: listings } = useListings({
    token: `${token?.token?.collection?.id}:${token?.token?.tokenId}`,
    includeRawData: true,
    sortBy: 'price',
    limit: 1,
  })

  const offer = offers && offers[0] ? offers[0] : undefined
  const listing = listings && listings[0] ? listings[0] : undefined

  const attributesData = useAttributes(collectionId)

  let countOwned = 0
  if (is1155) {
    countOwned = Number(userTokens?.[0]?.ownership?.tokenCount || 0)
  } else {
    countOwned =
      token?.token?.owner?.toLowerCase() === account?.address?.toLowerCase()
        ? 1
        : 0
  }

  const isOwner = countOwned > 0
  const owner = isOwner ? account?.address : token?.token?.owner
  const { displayName: ownerFormatted } = useENSResolver(token?.token?.owner)

  const tokenName = `${token?.token?.name || `#${token?.token?.tokenId}`}`

  const hasAttributes =
    token?.token?.attributes && token?.token?.attributes.length > 0

  const trigger = (
    <Button
      color="gray3"
      size="small"
      css={{
        justifyContent: 'space-between',
        width: '336px',
        px: '$2',
        py: '$2',
      }}
    >
      {isSmallDevice ? null : (
        <Text style="body1">
          {activityNames.map(titleCase).join(', ') || 'All Events'}
        </Text>
      )}
      <Text css={{ color: '$slate10' }}>
        <FontAwesomeIcon icon={faChevronDown} width={16} height={16} />
      </Text>
    </Button>
  )

  useEffect(() => {
    let tab = tabValue
    const hasAttributesTab = isMounted && isSmallDevice && hasAttributes
    if (hasAttributesTab) {
      tab = 'attributes'
    } else {
      tab = 'info'
    }

    let deeplinkTab: string | null = null
    if (typeof window !== 'undefined') {
      const params = new URL(window.location.href).searchParams
      deeplinkTab = params.get('tab')
    }

    if (deeplinkTab) {
      switch (deeplinkTab) {
        case 'attributes':
          if (hasAttributesTab) {
            tab = 'attributes'
          }
          break
        case 'info':
          tab = 'info'
          break
        case 'activity':
          tab = 'activity'
          break
        case 'listings':
          tab = 'listings'
          break
        case 'offers':
          tab = 'offers'
          break
      }
    }
    setTabValue(tab)
  }, [isSmallDevice])

  useEffect(() => {
    const updatedUrl = new URL(`${window.location.origin}${router.asPath}`)
    updatedUrl.searchParams.set('tab', tabValue)
    router.replace(updatedUrl, undefined, {
      shallow: true,
    })
  }, [tabValue])

  const pageTitle = token?.token?.name
    ? token.token.name
    : `${token?.token?.tokenId} - ${token?.token?.collection?.name}`

  return (
    <Layout>
      <Head
        ogImage={token?.token?.image || collection?.banner}
        title={pageTitle}
        description={collection?.description as string}
      />
      <Flex
        justify="center"
        css={{
          maxWidth: 1320,
          mt: 10,
          pb: 100,
          marginLeft: 'auto',
          marginRight: 'auto',
          px: '$1',
          gap: 20,
          flexDirection: 'column',
          alignItems: 'center',
          '@md': {
            mt: 48,
            px: '$3',
            flexDirection: 'row',
            gap: 40,
            alignItems: 'flex-start',
          },
          '@lg': {
            gap: 80,
          },
        }}
      >
        <Flex
          direction="column"
          css={{
            maxWidth: '100%',
            flex: 1,
            width: '100%',
            '@md': { maxWidth: 445 },
            '@lg': { maxWidth: 520 },
            '@xl': { maxWidth: 620 },
            position: 'relative',
            '@sm': {
              '>button': {
                height: 0,
                opacity: 0,
                transition: 'opacity .3s',
              },
            },
            ':hover >button': {
              opacity: 1,
              transition: 'opacity .3s',
            },
          }}
        >
          <Box
            css={{
              backgroundColor: '$gray3',
              borderRadius: 8,
              '@sm': {
                button: {
                  height: 0,
                  opacity: 0,
                  transition: 'opacity .3s',
                },
              },
              ':hover button': {
                opacity: 1,
                transition: 'opacity .3s',
              },
            }}
          >
            <TokenMedia
              token={token?.token}
              videoOptions={{ autoPlay: true, muted: true }}
              imageResolution={'large'}
              style={{
                width: '100%',
                height: 'auto',
                minHeight: isMounted && isSmallDevice ? 300 : 445,
                borderRadius: 8,
                overflow: 'hidden',
              }}
              onRefreshToken={() => {
                mutate?.()
                addToast?.({
                  title: 'Refresh token',
                  description: 'Request to refresh this token was accepted.',
                })
              }}
            />
            <FullscreenMedia token={token} />
          </Box>

          {token?.token?.attributes && !isSmallDevice && (
            <Grid
              css={{
                maxWidth: '100%',
                width: '100%',
                gridTemplateColumns: '1fr 1fr',
                gap: '$3',
                mt: 24,
              }}
            >
              {token?.token?.attributes?.map((attribute) => (
                <AttributeCard
                  key={`${attribute.key}-${attribute.value}`}
                  attribute={attribute}
                  collectionTokenCount={collection?.tokenCount || 0}
                  collectionId={collection?.id}
                />
              ))}
            </Grid>
          )}
        </Flex>
        <Flex
          direction="column"
          css={{
            flex: 1,
            px: '$3',
            width: '100%',
            '@md': {
              px: 0,
              maxWidth: '60%',
              overflow: 'hidden',
            },
          }}
        >
          <Flex justify="between" align="center" css={{ mb: 20 }}>
            <Flex align="center" css={{ mr: '$2', gap: '$2' }}>
              <Link
                href={`/${router.query.chain}/collection/${token?.token?.collection?.id}`}
                legacyBehavior={true}
              >
                <Anchor
                  color="primary"
                  css={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '$2',
                  }}
                >
                  <FontAwesomeIcon icon={faArrowLeft} height={16} />
                  <Text css={{ color: 'inherit' }} style="subtitle1" ellipsify>
                    {token?.token?.collection?.name}
                  </Text>
                </Anchor>
              </Link>
              <OpenSeaVerified
                openseaVerificationStatus={
                  collection?.openseaVerificationStatus
                }
              />
            </Flex>
            <Button
              onClick={(e) => {
                if (isRefreshing) {
                  e.preventDefault()
                  return
                }
                setIsRefreshing(true)
                fetcher(
                  `${process.env.NEXT_PUBLIC_PROXY_URL}${proxyApi}/tokens/refresh/v1`,
                  undefined,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: `${contract}:${id}` }),
                  }
                )
                  .then(({ data, response }) => {
                    if (response.status === 200) {
                      addToast?.({
                        title: 'Refresh token',
                        description:
                          'Request to refresh this token was accepted.',
                      })
                    } else {
                      throw data
                    }
                    setIsRefreshing(false)
                  })
                  .catch((e) => {
                    const ratelimit = DATE_REGEX.exec(e?.message)?.[0]

                    addToast?.({
                      title: 'Refresh token failed',
                      description: ratelimit
                        ? `This token was recently refreshed. The next available refresh is ${timeTill(
                            ratelimit
                          )}.`
                        : `This token was recently refreshed. Please try again later.`,
                    })

                    setIsRefreshing(false)
                    throw e
                  })
              }}
              disabled={isRefreshing}
              color="gray3"
              size="xs"
              css={{ cursor: isRefreshing ? 'not-allowed' : 'pointer' }}
            >
              <Box
                css={{
                  animation: isRefreshing
                    ? `${spin} 1s cubic-bezier(0.76, 0.35, 0.2, 0.7) infinite`
                    : 'none',
                }}
              >
                <FontAwesomeIcon icon={faRefresh} width={16} height={16} />
              </Box>
            </Button>
          </Flex>
          <Flex align="center" css={{ gap: '$2' }}>
            <Text style="h4" css={{ wordBreak: 'break-all' }}>
              {tokenName}
            </Text>
          </Flex>
          {token && (
            <>
              {is1155 && countOwned > 0 && (
                <Flex align="center" css={{ mt: '$2' }}>
                  <Text style="subtitle3" color="subtle" css={{ mr: '$2' }}>
                    You own {countOwned}
                  </Text>
                  <Link
                    href={`/portfolio/${account.address || ''}`}
                    legacyBehavior={true}
                  >
                    <Anchor
                      color="primary"
                      weight="normal"
                      css={{ ml: '$1', fontSize: 12 }}
                    >
                      Sell
                    </Anchor>
                  </Link>
                </Flex>
              )}
              {!is1155 && owner && (
                <Flex align="center" css={{ mt: '$2' }}>
                  <Text style="subtitle3" color="subtle" css={{ mr: '$2' }}>
                    Owner
                  </Text>
                  <Jazzicon
                    diameter={16}
                    seed={jsNumberForAddress(owner || '')}
                  />
                  <Link href={`/portfolio/${owner}`} legacyBehavior={true}>
                    <Anchor color="primary" weight="normal" css={{ ml: '$1' }}>
                      {isMounted ? ownerFormatted : ''}
                    </Anchor>
                  </Link>
                </Flex>
              )}
              <RarityRank
                token={token}
                collection={collection}
                collectionAttributes={attributesData?.data}
              />
              <PriceData token={token} />
              {isMounted && (
                <TokenActions
                  token={token}
                  collection={collection}
                  offer={offer}
                  listing={listing}
                  isOwner={isOwner}
                  mutate={mutate}
                  account={account}
                />
              )}
              <Tabs.Root
                value={tabValue}
                onValueChange={(value) => setTabValue(value)}
                style={{
                  paddingRight: isSmallDevice ? 0 : 15,
                }}
              >
                <TabsList
                  css={{
                    overflowX: isSmallDevice ? 'scroll' : 'unset',
                  }}
                >
                  {isMounted && isSmallDevice && hasAttributes && (
                    <TabsTrigger value="attributes">Attributes</TabsTrigger>
                  )}
                  <TabsTrigger value="info">Info</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="listings">Listings</TabsTrigger>
                  <TabsTrigger value="offers">Offers</TabsTrigger>
                </TabsList>
                <TabsContent value="attributes">
                  {token?.token?.attributes && (
                    <Grid
                      css={{
                        gap: '$3',
                        mt: 24,
                        gridTemplateColumns: '1fr',
                        '@sm': {
                          gridTemplateColumns: '1fr 1fr',
                        },
                      }}
                    >
                      {token?.token?.attributes?.map((attribute) => (
                        <AttributeCard
                          key={`${attribute.key}-${attribute.value}`}
                          attribute={attribute}
                          collectionTokenCount={collection?.tokenCount || 0}
                          collectionId={collection?.id}
                        />
                      ))}
                    </Grid>
                  )}
                </TabsContent>
                <TabsContent value="info">
                  {collection && (
                    <TokenInfo token={token} collection={collection} />
                  )}
                </TabsContent>
                <TabsContent value="activity" css={{ mr: -15 }}>
                  {isSmallDevice ? (
                    <MobileActivityFilters
                      activityTypes={activityTypes}
                      setActivityTypes={setActivityTypes}
                    />
                  ) : (
                    <Dropdown
                      trigger={trigger}
                      contentProps={{
                        sideOffset: 8,
                      }}
                    >
                      <ActivityFilters
                        open={activityFiltersOpen}
                        setOpen={setActivityFiltersOpen}
                        activityTypes={activityTypes}
                        activityNames={activityNames}
                        setActivityNames={setActivityNames}
                        setActivityTypes={setActivityTypes}
                      />
                    </Dropdown>
                  )}
                  <TokenActivityTable
                    id={`${contract}:${token?.token?.tokenId}`}
                    activityTypes={activityTypes}
                  />
                </TabsContent>
                <TabsContent value="listings">
                  <ListingsTable
                    token={`${contract}:${token?.token?.tokenId}`}
                    address={account.address}
                    is1155={is1155}
                    isOwner={isOwner}
                  />
                </TabsContent>
                <TabsContent value="offers" css={{ mr: -15, width: '100%' }}>
                  <OffersTable
                    token={`${contract}:${token?.token?.tokenId}`}
                    address={account.address}
                    is1155={is1155}
                    isOwner={isOwner}
                  />
                </TabsContent>
              </Tabs.Root>
            </>
          )}
        </Flex>
      </Flex>
    </Layout>
  )
}

type SSRProps = {
  collection?:
    | paths['/collections/v7']['get']['responses']['200']['schema']
    | null
  tokens?: paths['/tokens/v6']['get']['responses']['200']['schema'] | null
}

export const getServerSideProps: GetServerSideProps<{
  assetId?: string
  ssr: SSRProps
}> = async ({ params, res }) => {
  const assetId = params?.assetId ? params.assetId.toString().split(':') : []
  let collectionId = assetId[0]
  const id = assetId[1]
  const { reservoirBaseUrl } =
    supportedChains.find((chain) => params?.chain === chain.routePrefix) ||
    DefaultChain

  const contract = collectionId ? collectionId?.split(':')[0] : undefined

  const headers = {
    headers: {
      'x-api-key': process.env.RESERVOIR_API_KEY || '',
    },
  }

  let tokensQuery: paths['/tokens/v6']['get']['parameters']['query'] = {
    tokens: [`${contract}:${id}`],
    includeAttributes: true,
    includeTopBid: true,
    normalizeRoyalties: NORMALIZE_ROYALTIES,
    includeDynamicPricing: true,
  }

  let tokens: SSRProps['tokens'] = null
  let collection: SSRProps['collection'] = null

  try {
    const tokensPromise = fetcher(
      `${reservoirBaseUrl}/tokens/v6`,
      tokensQuery,
      headers
    )

    const tokensResponse = await tokensPromise
    tokens = tokensResponse.data
      ? (tokensResponse.data as Props['ssr']['tokens'])
      : {}

    let collectionQuery: paths['/collections/v7']['get']['parameters']['query'] =
      {
        id: tokens?.tokens?.[0]?.token?.collection?.id,
        normalizeRoyalties: NORMALIZE_ROYALTIES,
      }

    const collectionsPromise = fetcher(
      `${reservoirBaseUrl}/collections/v7`,
      collectionQuery,
      headers
    )

    const collectionsResponse = await collectionsPromise
    collection = collectionsResponse.data
      ? (collectionsResponse.data as Props['ssr']['collection'])
      : {}

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=30, stale-while-revalidate=60'
    )
  } catch (e) {
    console.log(e)
  }

  return {
    props: {
      assetId: params?.assetId as string,
      ssr: { collection, tokens },
    },
  }
}

export default IndexPage
