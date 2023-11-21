import { NextPage, GetServerSideProps } from 'next'
import Link from 'next/link'
import {
  Text,
  Flex,
  Box,
  Button,
  FormatCryptoCurrency,
} from 'components/primitives'
import Layout from 'components/Layout'
import { paths } from '@reservoir0x/reservoir-sdk'
import { useContext, useEffect, useState } from 'react'
import { Footer } from 'components/home/Footer'
import { useMarketplaceChain, useMounted } from 'hooks'
import supportedChains, { DefaultChain } from 'utils/chains'
import { Head } from 'components/Head'
import { ChainContext } from 'context/ChainContextProvider'

import Img from 'components/primitives/Img'
import useTopSellingCollections from 'hooks/useTopSellingCollections'
import ReactMarkdown from 'react-markdown'
import { basicFetcher as fetcher } from 'utils/fetcher'
import { styled } from 'stitches.config'
import { useTheme } from 'next-themes'
import ChainToggle from 'components/common/ChainToggle'
import optimizeImage from 'utils/optimizeImage'
import { MarkdownLink } from 'components/primitives/MarkdownLink'
import { useRouter } from 'next/router'
import { FeaturedCards } from 'components/home/FeaturedCards'
import { useTrendingCollections } from '@reservoir0x/reservoir-kit-ui'

const StyledImage = styled('img', {})

const Home: NextPage<any> = ({ ssr }) => {
  const router = useRouter()
  const marketplaceChain = useMarketplaceChain()
  const isMounted = useMounted()

  // not sure if there is a better way to fix this
  const { theme: nextTheme } = useTheme()
  const [theme, setTheme] = useState<string | null>(null)
  useEffect(() => {
    if (nextTheme) {
      setTheme(nextTheme)
    }
  }, [nextTheme])

  const { chain } = useContext(ChainContext)

  const { data: topSellingCollectionsData } = useTopSellingCollections(
    {
      period: '24h',
      includeRecentSales: true,
      limit: 9,
      fillType: 'sale',
    },
    {
      revalidateOnMount: true,
      refreshInterval: 300000,
      fallbackData: ssr.topSellingCollections[marketplaceChain.id]?.collections
        ? ssr.topSellingCollections[marketplaceChain.id]
        : null,
    },
    isMounted ? chain?.id : undefined
  )

  const { data: trendingCollectionsData } = useTrendingCollections({
    period: '24h',
    limit: 4,
  })

  const topCollection = topSellingCollectionsData?.collections?.[0]

  return (
    <Layout>
      <Head />
      <Box
        css={{
          p: 24,
          height: '100%',
          '@bp800': {
            px: '$5',
          },
          '@xl': {
            px: '$6',
          },
        }}
      >
        <FeaturedCards collections={trendingCollectionsData} />
        <Flex
          justify="between"
          align="center"
          css={{ flexWrap: 'wrap', mb: '$4', gap: '$3' }}
        >
          <Text style="h4" as="h4">
            Trending Collections
          </Text>
          <ChainToggle />
        </Flex>
        <Box
          css={{
            pt: '$2',
            mb: '$4',
            display: 'grid',
            gap: '$4',
            gridTemplateColumns: 'repeat(1, 1fr)',
            '@sm': {
              gridTemplateColumns: 'repeat(2, 1fr)',
            },

            '@lg': {
              gridTemplateColumns: 'repeat(4, 1fr)',
            },
          }}
        >
          {topSellingCollectionsData?.collections &&
            topSellingCollectionsData.collections.length &&
            topSellingCollectionsData.collections
              .slice(1, 9)
              .map((collection) => {
                return (
                  <Link
                    key={collection.id}
                    href={`/${marketplaceChain.routePrefix}/collection/${collection.id}`}
                    style={{ display: 'grid' }}
                  >
                    <Flex
                      direction="column"
                      css={{
                        flex: 1,
                        width: '100%',
                        borderRadius: 12,
                        cursor: 'pointer',
                        height: '100%',
                        background: '$neutralBgSubtle',
                        $$shadowColor: '$colors$panelShadow',
                        boxShadow: '0 0px 12px 0px $$shadowColor',

                        overflow: 'hidden',
                        position: 'relative',
                        p: '$3',
                        '&:hover > div > div> img:nth-child(1)': {
                          transform: 'scale(1.075)',
                        },
                      }}
                    >
                      <Flex
                        direction="column"
                        css={{
                          zIndex: 2,
                          position: 'relative',
                          flex: 1,
                          width: '100%',
                        }}
                      >
                        <Box
                          css={{
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: 8,
                          }}
                        >
                          {collection?.banner?.length ||
                          collection.recentSales?.[0]?.token?.image?.length ? (
                            <img
                              loading="lazy"
                              src={optimizeImage(
                                collection?.banner ||
                                  collection.recentSales?.[0]?.token?.image ||
                                  collection.recentSales?.[0]?.collection
                                    ?.image,
                                800
                              )}
                              style={{
                                transition: 'transform 300ms ease-in-out',
                                width: '100%',
                                borderRadius: 8,
                                height: 250,
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            <Box
                              css={{
                                width: '100%',
                                borderRadius: 8,
                                height: 250,
                                background: '$gray3',
                              }}
                            />
                          )}
                          <Img
                            src={
                              optimizeImage(collection?.image, 72 * 2) as string
                            }
                            alt={collection?.name as string}
                            width={72}
                            height={72}
                            css={{
                              width: 72,
                              height: 72,
                              border: '2px solid rgba(255,255,255,0.6)',
                              position: 'absolute',
                              bottom: '$3',
                              left: '$3',
                              borderRadius: 8,
                            }}
                          />
                        </Box>
                        <Flex
                          css={{ my: '$4', mb: '$2' }}
                          justify="between"
                          align="center"
                        >
                          <Text style="h5" as="h5" ellipsify css={{ flex: 1 }}>
                            {collection?.name}
                          </Text>
                        </Flex>

                        <Box
                          css={{
                            maxWidth: 720,
                            lineHeight: 1.5,
                            fontSize: 16,
                            flex: 1,
                            fontWeight: 400,
                            display: '-webkit-box',
                            color: '$gray12',
                            fontFamily: '$body',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            '& a': {
                              fontWeight: 500,
                              cursor: 'pointer',
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          <ReactMarkdown
                            children={collection?.description || ''}
                            components={{
                              a: MarkdownLink,
                              p: Text as any,
                            }}
                          />
                        </Box>

                        <Flex css={{ mt: '$4' }}>
                          <Box css={{ mr: '$5' }}>
                            <Text
                              style="subtitle2"
                              color="subtle"
                              as="p"
                              css={{ mb: 2 }}
                            >
                              FLOOR
                            </Text>
                            <FormatCryptoCurrency
                              amount={
                                collection?.floorAsk?.price?.amount?.native ?? 0
                              }
                              textStyle={'h6'}
                              logoHeight={12}
                              address={
                                collection?.floorAsk?.price?.currency?.contract
                              }
                            />
                          </Box>

                          <Box css={{ mr: '$4' }}>
                            <Text style="subtitle2" color="subtle" as="p">
                              24H SALES
                            </Text>
                            <Text style="h6" as="h4" css={{ mt: 2 }}>
                              {collection.count?.toLocaleString()}
                            </Text>
                          </Box>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Link>
                )
              })}
        </Box>
        <Box css={{ my: '$5' }}>
          <Link href={`/${marketplaceChain.routePrefix}/collections/trending`}>
            <Button>See More</Button>
          </Link>
        </Box>
      </Box>

      <Footer />
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
  const chainPrefix = params?.chain || ''
  const chain =
    supportedChains.find((chain) => chain.routePrefix === chainPrefix) ||
    DefaultChain

  const topSellingCollections: ChainTopSellingCollections = {}
  try {
    const response = await fetcher(
      `${chain.reservoirBaseUrl}/collections/top-selling/v2?period=24h&includeRecentSales=true&limit=9&fillType=sale`,
      {
        headers: {
          'x-api-key': process.env.RESERVOIR_API_KEY || '',
        },
      }
    )

    topSellingCollections[chain.id] = response.data

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=120, stale-while-revalidate=180'
    )
  } catch (e) {}

  return {
    props: { ssr: { topSellingCollections } },
  }
}

export default Home
