import {
  faArrowLeft,
  faCircleExclamation,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { paths } from '@reservoir0x/reservoir-sdk'
import {
  TokenMedia,
  useCollections,
  useTokenOpenseaBanned,
  useTokens,
  useUserTokens,
} from '@reservoir0x/reservoir-kit-ui'
import Layout from 'components/Layout'
import {
  Flex,
  Text,
  Button,
  Tooltip,
  Anchor,
  Grid,
  Box,
} from 'components/primitives'
import { TabsList, TabsTrigger, TabsContent } from 'components/primitives/Tab'
import * as Tabs from '@radix-ui/react-tabs'
import AttributeCard from 'components/token/AttributeCard'
import { PriceData } from 'components/token/PriceData'
import RarityRank from 'components/token/RarityRank'
import { TokenActions } from 'components/token/TokenActions'
import {
  GetStaticProps,
  GetStaticPaths,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import Link from 'next/link'
import { jsNumberForAddress } from 'react-jazzicon'
import Jazzicon from 'react-jazzicon/dist/Jazzicon'
import fetcher from 'utils/fetcher'
import { useAccount } from 'wagmi'
import { TokenInfo } from 'components/token/TokenInfo'
import { useMediaQuery } from 'react-responsive'
import FullscreenMedia from 'components/token/FullscreenMedia'
import { useContext, useEffect, useState } from 'react'
import { ToastContext } from 'context/ToastContextProvider'
import { NORMALIZE_ROYALTIES } from 'pages/_app'
import { useENSResolver, useMarketplaceChain, useMounted } from 'hooks'
import { useRouter } from 'next/router'
import supportedChains, { DefaultChain } from 'utils/chains'
import { spin } from 'components/common/LoadingSpinner'
import Head from 'next/head'
import { OpenSeaVerified } from 'components/common/OpenSeaVerified'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const IndexPage: NextPage<Props> = ({ id, collectionId, ssr }) => {
  const router = useRouter()
  const { addToast } = useContext(ToastContext)
  const account = useAccount()
  const isMounted = useMounted()
  const isSmallDevice = useMediaQuery({ maxWidth: 900 }) && isMounted
  const [tabValue, setTabValue] = useState('info')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { proxyApi } = useMarketplaceChain()
  const { data: collections } = useCollections(
    {
      id: collectionId,
    },
    {
      fallbackData: [ssr.collection],
    }
  )
  const collection = collections && collections[0] ? collections[0] : null

  const contract = collectionId ? collectionId?.split(':')[0] : undefined
  const { data: tokens, mutate } = useTokens(
    {
      tokens: [`${contract}:${id}`],
      includeAttributes: true,
      includeTopBid: true,
    },
    {
      fallbackData: [ssr.tokens],
    }
  )
  const flagged = useTokenOpenseaBanned(collectionId, id)
  const token = tokens && tokens[0] ? tokens[0] : undefined
  const checkUserOwnership = token?.token?.kind === 'erc1155'

  const { data: userTokens } = useUserTokens(
    checkUserOwnership ? account.address : undefined,
    {
      tokens: [`${contract}:${id}`],
    }
  )

  const isOwner =
    userTokens &&
    userTokens[0] &&
    userTokens[0].ownership?.tokenCount &&
    +userTokens[0].ownership.tokenCount > 0
      ? true
      : token?.token?.owner?.toLowerCase() === account?.address?.toLowerCase()
  const owner = isOwner ? account?.address : token?.token?.owner
  const { displayName: ownerFormatted } = useENSResolver(token?.token?.owner)

  const tokenName = `${token?.token?.name || `#${token?.token?.tokenId}`}`

  const hasAttributes =
    token?.token?.attributes && token?.token?.attributes.length > 0

  useEffect(() => {
    isMounted && isSmallDevice && hasAttributes
      ? setTabValue('attributes')
      : setTabValue('info')
  }, [isSmallDevice])

  const pageTitle = token?.token?.name
    ? token.token.name
    : `${token?.token?.tokenId} - ${token?.token?.collection?.name}`

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={collection?.description as string} />
        <meta name="twitter:title" content={pageTitle} />
        <meta
          name="twitter:image"
          content={token?.token?.image || collection?.banner}
        />
        <meta name="og:title" content={pageTitle} />
        <meta
          property="og:image"
          content={token?.token?.image || collection?.banner}
        />
      </Head>
      <Flex
        justify="center"
        css={{
          maxWidth: 1175,
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
            '@md': { maxWidth: 445, width: '100%' },
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
            px: '$4',
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
                href={`/collection/${router.query.chain}/${collectionId}`}
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
                    {collection?.name}
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
                  `${window.location.origin}/${proxyApi}/tokens/refresh/v1`,
                  undefined,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: `${contract}:${id}` }),
                  }
                )
                  .then(({ response }) => {
                    if (response.status === 200) {
                      addToast?.({
                        title: 'Refresh token',
                        description:
                          'Request to refresh this token was accepted.',
                      })
                    } else {
                      throw 'Request Failed'
                    }
                    setIsRefreshing(false)
                  })
                  .catch((e) => {
                    addToast?.({
                      title: 'Refresh token failed',
                      description:
                        'We have queued this item for an update, check back in a few.',
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
            {flagged && (
              <Tooltip
                content={
                  <Text style="body2" as="p">
                    Not tradeable on OpenSea
                  </Text>
                }
              >
                <Text css={{ color: '$red10' }}>
                  <FontAwesomeIcon
                    icon={faCircleExclamation}
                    width={16}
                    height={16}
                  />
                </Text>
              </Tooltip>
            )}
          </Flex>
          {token && (
            <>
              <Flex align="center" css={{ mt: '$2' }}>
                <Text style="subtitle3" color="subtle" css={{ mr: '$2' }}>
                  Owner
                </Text>
                <Jazzicon
                  diameter={16}
                  seed={jsNumberForAddress(owner || '')}
                />
                <Link href={`/profile/${owner}`} legacyBehavior={true}>
                  <Anchor color="primary" weight="normal" css={{ ml: '$1' }}>
                    {isMounted ? ownerFormatted : ''}
                  </Anchor>
                </Link>
              </Flex>
              <RarityRank
                token={token}
                collection={collection}
                collectionAttributes={ssr.attributes?.attributes}
              />
              <PriceData token={token} />
              {isMounted && (
                <TokenActions
                  token={token}
                  isOwner={isOwner}
                  mutate={mutate}
                  account={account}
                />
              )}
              <Tabs.Root
                value={tabValue}
                onValueChange={(value) => setTabValue(value)}
              >
                <TabsList>
                  {isMounted && isSmallDevice && hasAttributes && (
                    <TabsTrigger value="attributes">Attributes</TabsTrigger>
                  )}
                  <TabsTrigger value="info">Info</TabsTrigger>
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
              </Tabs.Root>
            </>
          )}
        </Flex>
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
  id?: string
  collectionId?: string
  ssr: {
    collection: paths['/collections/v5']['get']['responses']['200']['schema']
    tokens: paths['/tokens/v5']['get']['responses']['200']['schema']
    attributes?: paths['/collections/{collection}/attributes/all/v2']['get']['responses']['200']['schema']
  }
}> = async ({ params }) => {
  let collectionId = params?.contract?.toString()
  const id = params?.id?.toString()
  const { reservoirBaseUrl, apiKey } =
    supportedChains.find((chain) => params?.chain === chain.routePrefix) ||
    DefaultChain

  let collectionQuery: paths['/collections/v5']['get']['parameters']['query'] =
    {
      id: collectionId,
      includeTopBid: true,
      normalizeRoyalties: NORMALIZE_ROYALTIES,
    }

  const headers = {
    headers: {
      'x-api-key': apiKey || '',
    },
  }

  const collectionsResponse = await fetcher(
    `${reservoirBaseUrl}/collections/v5`,
    collectionQuery,
    headers
  )
  const collection: Props['ssr']['collection'] = collectionsResponse['data']
  const contract = collectionId ? collectionId?.split(':')[0] : undefined

  let tokensQuery: paths['/tokens/v5']['get']['parameters']['query'] = {
    tokens: [`${contract}:${id}`],
    includeAttributes: true,
    includeTopBid: true,
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
      `${reservoirBaseUrl}/collections/${collectionId}/attributes/all/v2`,
      {},
      headers
    )
    attributes = attributesResponse['data']
  } catch (e) {
    console.log('Failed to load attributes')
  }

  return {
    props: { collectionId, id, ssr: { collection, tokens, attributes } },
    revalidate: 20,
  }
}

export default IndexPage
