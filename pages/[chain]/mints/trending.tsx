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
import { useMarketplaceChain } from 'hooks'
import supportedChains, { DefaultChain } from 'utils/chains'
import { Head } from 'components/Head'
import { ChainContext } from 'context/ChainContextProvider'
import { preload } from 'swr'

import Img from 'components/primitives/Img'
import useTopSellingCollections from 'hooks/useTopSellingCollections'
import ReactMarkdown from 'react-markdown'
import { basicFetcher as fetcher } from 'utils/fetcher'
import { styled } from 'stitches.config'
import { useTheme } from 'next-themes'
import ChainToggle from 'components/common/ChainToggle'
import optimizeImage from 'utils/optimizeImage'
import { MarkdownLink } from 'components/primitives/MarkdownLink'

const StyledImage = styled('img', {})

const Home: NextPage<any> = ({ ssr }) => {
  const marketplaceChain = useMarketplaceChain()

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
      period: '1h',
      includeRecentSales: true,
      limit: 25,
      fillType: 'mint',
    },
    {
      revalidateOnMount: true,
      refreshInterval: 300000,
      fallbackData: ssr.topSellingCollections[marketplaceChain.id]?.collections
        ? ssr.topSellingCollections[marketplaceChain.id]
        : null,
    },
    chain?.id
  )

  useEffect(
    () =>
      supportedChains
        .filter((c) => c.id !== chain.id)
        .forEach((c) => {
          preload(
            `${c.reservoirBaseUrl}/collections/top-selling/v2?period=1h&includeRecentSales=true&limit=25&fillType=mint`,
            fetcher
          )
        }),
    []
  )

  return (
    <Layout>
      <Head />
      <Box
        css={{
          p: '$5',
          height: '100%',
          maxWidth: 1200,
          mx: 'auto',
          '@bp800': {
            px: '$5',
          },
          '@xl': {
            px: '$6',
          },
        }}
      >
        <Flex
          justify="between"
          align="center"
          css={{ flexWrap: 'wrap', mb: '$5', gap: '$3' }}
        >
          <Text style="h4" as="h4">
            Trending Mints
          </Text>
          <ChainToggle />
        </Flex>
        <Box
          css={{
            pt: '$2',
            mb: '$4',
          }}
        >
          {topSellingCollectionsData?.collections &&
            topSellingCollectionsData.collections.length &&
            topSellingCollectionsData.collections.map((collection, i) => {
              let collectionImage =
                collection.image ||
                collection?.recentSales?.filter((sale) => sale?.token?.image)[0]
                  ?.token?.image
              return (
                <Link
                  key={collection.id}
                  href={`/${marketplaceChain.routePrefix}/collection/${collection.id}`}
                  style={{ display: 'grid' }}
                >
                  <Box css={{ mb: '$5', borderBottom: '1px solid $gray5' }}>
                    <Flex css={{ gap: '$5' }}>
                      <Text css={{ minWidth: 30 }} style="h4" color="subtle">
                        {i + 1}
                      </Text>
                      <Box
                        css={{
                          flex: 1,
                          pb: '$5',
                        }}
                      >
                        <Flex
                          css={{
                            gap: '$3',
                            '& > img': {
                              border: '1px solid $gray5',
                            },
                          }}
                          align="center"
                        >
                          <img
                            src={collectionImage}
                            style={{ width: 42, height: 42, borderRadius: 6 }}
                          />
                          <Box>
                            <Text as="h5" style="h5">
                              {collection.name}
                            </Text>
                          </Box>
                        </Flex>

                        {collection?.description && (
                          <Box
                            css={{
                              maxWidth: 720,
                              lineHeight: 1.5,
                              fontSize: 16,
                              flex: 1,
                              mt: '$4',
                              fontWeight: 400,
                              display: '-webkit-box',
                              color: '$gray12',
                              fontFamily: '$body',
                              WebkitLineClamp: 2,
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
                        )}
                        <Flex css={{ gap: '$3', my: '$4' }}>
                          {collection.recentSales?.slice(0, 7).map((sale) => (
                            <Box
                              css={{
                                flex: 1,
                                '& > img': {
                                  border: '1px solid $gray5',
                                },
                              }}
                            >
                              {sale?.token?.image || collection.image ? (
                                <img
                                  src={sale?.token?.image || collection.image}
                                  style={{
                                    width: '100%',
                                    aspectRatio: '1/1',

                                    borderRadius: 8,
                                  }}
                                />
                              ) : (
                                <Box
                                  css={{
                                    width: '100%',
                                    aspectRatio: '1/1',
                                    borderRadius: 8,

                                    backgroundColor: '$gray3',
                                  }}
                                />
                              )}
                              <Flex
                                css={{
                                  maxWidth: 140,
                                  overflow: 'hidden',
                                  mt: '$1',
                                }}
                              >
                                <Text style="body3" ellipsify css={{ flex: 1 }}>
                                  {sale.token.name || `#${sale.token.id}`}
                                </Text>
                              </Flex>
                            </Box>
                          ))}
                        </Flex>
                        <Text style="subtitle1" as="p" css={{ mb: '$5' }}>
                          {collection.count}{' '}
                          <span style={{ fontWeight: 400 }}>
                            mints last hour
                          </span>
                        </Text>
                        <Button color="primary" size="large">
                          Mint
                        </Button>
                      </Box>
                    </Flex>
                  </Box>
                </Link>
              )
            })}
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

  const response = await fetcher(
    `${chain.reservoirBaseUrl}/collections/top-selling/v2?period=24h&includeRecentSales=true&limit=9&fillType=sale`,
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

export default Home
