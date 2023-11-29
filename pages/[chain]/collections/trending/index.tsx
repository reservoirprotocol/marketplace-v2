import { useTrendingCollections } from '@reservoir0x/reservoir-kit-ui'
import { paths } from '@reservoir0x/reservoir-sdk'
import { Head } from 'components/Head'
import Layout from 'components/Layout'
import ChainToggle from 'components/common/ChainToggle'
import CollectionsTimeDropdown, {
  CollectionsSortingOption,
} from 'components/common/CollectionsTimeDropdown'
import LoadingSpinner from 'components/common/LoadingSpinner'
import { Box, Flex, Text } from 'components/primitives'
import { CollectionRankingsTable } from 'components/rankings/CollectionRankingsTable'
import { ChainContext } from 'context/ChainContextProvider'
import { useMounted } from 'hooks'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { useRouter } from 'next/router'
import {
  ComponentPropsWithoutRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useMediaQuery } from 'react-responsive'
import { useIntersectionObserver } from 'usehooks-ts'
import supportedChains, { DefaultChain } from 'utils/chains'
import fetcher from 'utils/fetcher'
import { NORMALIZE_ROYALTIES } from '../../../_app'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const IndexPage: NextPage<Props> = ({ ssr }) => {
  const router = useRouter()
  const isSSR = typeof window === 'undefined'
  const isMounted = useMounted()
  const compactToggleNames = useMediaQuery({ query: '(max-width: 800px)' })
  const [sortByTime, setSortByTime] = useState<CollectionsSortingOption>('1d')
  const [offset, setOffset] = useState<number>(20)
  const [isOffsetting, setIsOffsetting] = useState<boolean>(false)

  let collectionQuery: Parameters<typeof useTrendingCollections>['0'] = {
    limit: 1000,
    period: sortByTime,
  }

  const { chain, switchCurrentChain } = useContext(ChainContext)

  useEffect(() => {
    if (router.query.chain) {
      let chainIndex: number | undefined
      for (let i = 0; i < supportedChains.length; i++) {
        if (supportedChains[i].routePrefix == router.query.chain) {
          chainIndex = supportedChains[i].id
        }
      }
      if (chainIndex !== -1 && chainIndex) {
        switchCurrentChain(chainIndex)
      }
    }
  }, [router.query])

  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})

  const { data, isValidating } = useTrendingCollections(
    collectionQuery,
    chain.id,
    {
      fallbackData: [ssr.collection],
    }
  )

  useEffect(() => {
    let isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible && (!isValidating || !isOffsetting)) {
      setIsOffsetting(true)
      setTimeout(() => {
        setOffset(offset + 20)
        setIsOffsetting(false)
      }, 500)
    }
  }, [loadMoreObserver?.isIntersecting, isValidating])

  let volumeKey: ComponentPropsWithoutRef<
    typeof CollectionRankingsTable
  >['volumeKey'] = 'allTime'

  switch (sortByTime) {
    case '30d':
      volumeKey = '30day'
      break
    case '7d':
      volumeKey = '7day'
      break
    case '1d':
      volumeKey = '1day'
      break
  }

  const collections = data || []

  return (
    <Layout>
      <Head />
      <Box
        css={{
          p: 24,
          height: '100%',
          '@bp800': {
            p: '$5',
          },

          '@xl': {
            px: '$6',
          },
        }}
      >
        <Flex direction="column">
          <Flex
            justify="between"
            align="start"
            css={{
              flexDirection: 'column',
              gap: 24,
              mb: '$4',
              '@bp800': {
                alignItems: 'center',
                flexDirection: 'row',
              },
            }}
          >
            <Text style="h4" as="h4">
              Trending Collections
            </Text>
            <Flex align="center" css={{ gap: '$4' }}>
              <CollectionsTimeDropdown
                compact={compactToggleNames && isMounted}
                option={sortByTime}
                onOptionSelected={(option) => {
                  setSortByTime(option)
                }}
              />
              <ChainToggle />
            </Flex>
          </Flex>
          {isSSR || !isMounted ? null : (
            <CollectionRankingsTable
              offset={offset}
              collections={collections}
              volumeKey={volumeKey}
              loading={isValidating}
            />
          )}
          <Box
            ref={loadMoreRef}
            css={{
              display: isValidating && !isOffsetting ? 'none' : 'block',
            }}
          ></Box>
        </Flex>
        {(isValidating || isOffsetting) && (
          <Flex align="center" justify="center" css={{ py: '$4' }}>
            <LoadingSpinner />
          </Flex>
        )}
      </Box>
    </Layout>
  )
}

type CollectionSchema =
  paths['/collections/v7']['get']['responses']['200']['schema']

export const getServerSideProps: GetServerSideProps<{
  ssr: {
    collection: CollectionSchema
  }
}> = async ({ res, params }) => {
  const collectionQuery: paths['/collections/v7']['get']['parameters']['query'] =
    {
      sortBy: '1DayVolume',
      normalizeRoyalties: NORMALIZE_ROYALTIES,
      limit: 20,
    }
  const chainPrefix = params?.chain || ''
  const chain =
    supportedChains.find((chain) => chain.routePrefix === chainPrefix) ||
    DefaultChain
  const query = { ...collectionQuery }
  if (chain.collectionSetId) {
    query.collectionsSetId = chain.collectionSetId
  } else if (chain.community) {
    query.community = chain.community
  }
  const response = await fetcher(
    `${chain.reservoirBaseUrl}/collections/v7`,
    query,
    {
      headers: {
        'x-api-key': process.env.RESERVOIR_API_KEY || '',
      },
    }
  )

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=30, stale-while-revalidate=60'
  )

  return {
    props: { ssr: { collection: response.data } },
  }
}

export default IndexPage
