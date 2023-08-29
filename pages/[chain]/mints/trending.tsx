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
      limit: 40,
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
            `${c.reservoirBaseUrl}/collections/top-selling/v2?period=1h&includeRecentSales=true&limit=40&fillType=mint`,
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
          css={{ flexWrap: 'wrap', mb: '$4', gap: '$3' }}
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
            topSellingCollectionsData.collections.map((collection) => {
              console.log(collection)
              return (
                <Link
                  key={collection.id}
                  href={`/${marketplaceChain.routePrefix}/collection/${collection.id}`}
                  style={{ display: 'grid' }}
                ></Link>
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
