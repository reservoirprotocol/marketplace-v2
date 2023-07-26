import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
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
import { useContext, useEffect, useMemo, useState } from 'react'
import { Footer } from 'components/home/Footer'
import { useMarketplaceChain, useMounted } from 'hooks'
import supportedChains from 'utils/chains'
import { Head } from 'components/Head'
import { ChainContext } from 'context/ChainContextProvider'
import { faBook, faChevronRight } from '@fortawesome/free-solid-svg-icons'

import Img from 'components/primitives/Img'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useTrendingCollections from 'hooks/useTrendingCollections'
import ReactMarkdown from 'react-markdown'
import fetcher from 'utils/fetcher'
import { styled } from 'stitches.config'

import { useTheme } from 'next-themes'
import { useLocalStorage } from 'usehooks-ts'
import ChainToggle from 'components/common/ChainToggle'

const StyledImage = styled('img', {})

const mintStartTime = Math.floor(new Date().getTime() / 1000) - 60 * 6 * 60

const IndexPage: NextPage<any> = ({ ssr }) => {
  const isMounted = useMounted()
  const marketplaceChain = useMarketplaceChain()
  const [fillType, setFillType] = useState<'mint' | 'sale' | 'any'>('sale')
  const [minutesFilter, setMinutesFilter] = useState<number>(1440)

  const [showBlogPost, setShowBlogPost] = useLocalStorage('showBlogPost1', true)

  // not sure if there is a better way to fix this
  const { theme: nextTheme } = useTheme()
  const [theme, setTheme] = useState<string | null>(null)
  useEffect(() => {
    if (nextTheme) {
      setTheme(nextTheme)
    }
  }, [nextTheme])

  const { chain, switchCurrentChain } = useContext(ChainContext)

  const {
    data: topSellingCollectionsData,
    collections: collectionsData,
    isValidating,
  } = useTrendingCollections(
    {},
    {
      revalidateOnMount: true,
      refreshInterval: 300000,
    },
    chain?.id
  )

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
        <Link href={`/${chain.routePrefix}/collection/${topCollection?.id}`}>
          <Flex>
            <Flex
              css={{
                '&:hover button': {
                  background: '$gray2',
                },
                minHeight: 540,
                flex: 1,
                overflow: 'hidden',
                position: 'relative',
                gap: '$5',
                p: '$4',
                display: 'none',
                '@md': {
                  p: '$5',
                  gap: '$4',
                  flexDirection: 'column',
                  display: 'flex',
                },
                '@lg': {
                  flexDirection: 'row',
                  p: '$5',
                  gap: '$5',
                  mt: '$4',
                },
                '@xl': {
                  p: '$6',
                  gap: '$6',
                },

                mb: '$6',
                maxWidth: 1820,
                mx: 'auto',
                borderRadius: 16,
                //background: '$gray3',
                backgroundSize: 'cover',
                border: `1px solid $gray5`,
                backgroundImage:
                  theme === 'light'
                    ? `url(${topCollection?.banner?.replace(
                        'w=500',
                        'w=4500'
                      )}) `
                    : '$gray3',
                backgroundColor: '$gray5',
              }}
            >
              <Box
                css={{
                  position: 'absolute',
                  top: 0,
                  display: theme === 'light' ? 'block' : 'none',
                  zIndex: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backdropFilter: 'blur(20px)',
                  background: 'rgba(255, 255, 255, 0.9)',
                }}
              />

              {topSellingCollectionsData?.collections &&
                topSellingCollectionsData.collections.length &&
                topCollection && (
                  <>
                    <Box
                      css={{
                        flex: 2,
                        position: 'relative',
                        zIndex: 5,
                        '@xl': {
                          flex: 3,
                        },
                      }}
                    >
                      <StyledImage
                        src={
                          topCollection?.banner?.replace('w=500', 'w=4500') ??
                          topCollection?.image
                        }
                        css={{
                          width: '100%',
                          borderRadius: 8,
                          height: 320,
                          '@lg': {
                            height: 540,
                          },
                          objectFit: 'cover',
                        }}
                      />
                      <Box
                        css={{
                          position: 'absolute',
                          left: '$4',
                          '@lg': {
                            top: '$4',
                          },
                          bottom: '$4',
                        }}
                      >
                        <Img
                          alt="collection image"
                          width={100}
                          height={100}
                          style={{
                            display: 'block',
                            borderRadius: 8,
                            border: '2px solid rgba(255,255,255,0.6)',
                          }}
                          src={topCollection?.image as string}
                        />
                      </Box>
                    </Box>
                    <Box css={{ flex: 2, zIndex: 4 }}>
                      <Flex direction="column" css={{ height: '100%' }}>
                        <Box css={{ flex: 1 }}>
                          <Text style="h3" css={{ mt: '$3', mb: '$2' }} as="h3">
                            {topCollection.name}
                          </Text>

                          <Text
                            style="body1"
                            as="p"
                            css={{
                              maxWidth: 720,
                              lineHeight: 1.5,
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            <ReactMarkdown
                              children={topCollection?.description || ''}
                            />
                          </Text>

                          <Flex css={{ mt: '$4' }}>
                            <Box css={{ mr: '$5' }}>
                              <Text style="subtitle2" color="subtle">
                                FLOOR
                              </Text>
                              <FormatCryptoCurrency
                                css={{ mt: '$1' }}
                                amount={
                                  topCollection?.floorAsk?.price?.amount
                                    ?.native ?? 0
                                }
                                textStyle={'h4'}
                                logoHeight={24}
                                address={
                                  topCollection?.floorAsk?.price?.currency
                                    ?.contract
                                }
                              />
                            </Box>

                            <Box css={{ mr: '$4' }}>
                              <Text style="subtitle2" color="subtle">
                                24H SALES
                              </Text>
                              <Text style="h4" as="h4" css={{ mt: 2 }}>
                                {topCollection.count?.toLocaleString()}
                              </Text>
                            </Box>
                          </Flex>
                          <Box
                            css={{
                              display: 'none',
                              '@lg': {
                                display: 'block',
                              },
                            }}
                          >
                            <Text
                              style="subtitle2"
                              color="subtle"
                              as="p"
                              css={{ mt: '$4' }}
                            >
                              RECENT SALES
                            </Text>
                            <Flex
                              css={{
                                mt: '$2',
                                gap: '$3',
                              }}
                            >
                              {topCollection?.recentSales
                                ?.slice(0, 3)
                                ?.map((sale: any) => (
                                  <Box css={{ flex: 1, aspectRatio: '1/1' }}>
                                    <img
                                      style={{ borderRadius: 4 }}
                                      src={
                                        sale?.token?.image ||
                                        topCollection.image
                                      }
                                    />
                                  </Box>
                                ))}
                              <Box css={{ flex: 1 }} />
                              <Box css={{ flex: 1 }} />
                            </Flex>
                          </Box>
                        </Box>
                        <Flex css={{ gap: '$4', mt: '$5' }}>
                          {false && (
                            <Button size="large" css={{ background: 'black' }}>
                              Collect for{' '}
                              <FormatCryptoCurrency
                                amount={
                                  topCollection?.floorAsk?.price?.amount?.native
                                }
                                textStyle={'h6'}
                                logoHeight={16}
                                css={{ color: 'white' }}
                                address={
                                  topCollection?.floorAsk?.price?.currency
                                    ?.contract
                                }
                              />
                            </Button>
                          )}
                          <Link
                            href={`/${chain.routePrefix}/collection/${topCollection.id}`}
                          >
                            <Button
                              color="gray4"
                              css={{ background: 'white' }}
                              size="large"
                            >
                              Explore Collection
                            </Button>
                          </Link>
                        </Flex>
                      </Flex>
                    </Box>
                  </>
                )}
            </Flex>
          </Flex>
        </Link>
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
              .map((collection: any) => {
                return (
                  <Link
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
                          collection.recentSales?.[0].token?.image?.length ? (
                            <img
                              src={
                                collection?.banner?.replace(
                                  'w=500',
                                  'w=1200'
                                ) ?? collection.recentSales?.[0].token?.image
                              }
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
                            src={collection?.image as string}
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

                        <Text
                          style="body1"
                          as="p"
                          css={{
                            maxWidth: 720,
                            lineHeight: 1.5,
                            flex: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          <ReactMarkdown
                            children={collection?.description || ''}
                          />
                        </Text>

                        <Flex css={{ mt: '$4' }}>
                          <Box css={{ mr: '$5' }}>
                            <Text style="subtitle2" color="subtle">
                              FLOOR
                            </Text>
                            <FormatCryptoCurrency
                              css={{ mt: '$1' }}
                              amount={
                                collection?.floorAsk?.price?.amount?.native ?? 0
                              }
                              textStyle={'h6'}
                              logoHeight={20}
                              address={
                                collection?.floorAsk?.price?.currency?.contract
                              }
                            />
                          </Box>

                          <Box css={{ mr: '$4' }}>
                            <Text style="subtitle2" color="subtle">
                              24H SALES
                            </Text>
                            <Text style="h6" as="h4" css={{ mt: 2 }}>
                              {collection.count?.toLocaleString()}
                            </Text>
                          </Box>
                        </Flex>
                        {false && (
                          <Button css={{ width: '100%', textAlign: 'center' }}>
                            <Flex justify="center" css={{ width: '100%' }}>
                              <Text style="h6" css={{ color: 'white' }}>
                                Collect for{' '}
                                {collection?.floorAsk?.price?.amount?.native}{' '}
                                ETH
                              </Text>
                            </Flex>
                          </Button>
                        )}
                      </Flex>
                    </Flex>
                  </Link>
                )
              })}
        </Box>
        <Box css={{ my: '$5' }}>
          <Link href={`/${marketplaceChain.routePrefix}/collection-rankings`}>
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

type CollectionSchema =
  paths['/collections/v5']['get']['responses']['200']['schema']
type ChainCollections = Record<string, CollectionSchema>

export default IndexPage
