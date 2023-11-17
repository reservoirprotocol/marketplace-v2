import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { Text, Flex, Box } from 'components/primitives'
import Layout from 'components/Layout'
import { useContext, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useMounted } from 'hooks'
import { paths } from '@reservoir0x/reservoir-sdk'
import { useCollections, useTrendingMints } from '@reservoir0x/reservoir-kit-ui'
import fetcher from 'utils/fetcher'
import { NORMALIZE_ROYALTIES } from '../../../_app'
import supportedChains, { DefaultChain } from 'utils/chains'
import { CollectionRankingsTable } from 'components/rankings/CollectionRankingsTable'
import { useIntersectionObserver } from 'usehooks-ts'
import LoadingSpinner from 'components/common/LoadingSpinner'
import CollectionsTimeDropdown, {
  CollectionsSortingOption,
} from 'components/common/CollectionsTimeDropdown'
import ChainToggle from 'components/common/ChainToggle'
import { Head } from 'components/Head'
import { ChainContext } from 'context/ChainContextProvider'
import { useRouter } from 'next/router'
import MintTypeSelector, {
  MintTypeOption,
} from 'components/common/MintTypeSelector'
import MintsPeriodDropdown, {
  MintsSortingOption,
} from 'components/common/MintsPeriodDropdown'
import { MintRankingsTable } from 'components/rankings/MintRankingsTable'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const IndexPage: NextPage<Props> = ({ ssr }) => {
  const router = useRouter()
  const isSSR = typeof window === 'undefined'
  const isMounted = useMounted()
  const compactToggleNames = useMediaQuery({ query: '(max-width: 800px)' })
  const isSmallDevice = useMediaQuery({ maxWidth: 600 })
  const [sortByTime, setSortByTime] =
    useState<CollectionsSortingOption>('1DayVolume')

  const [mintType, setMintType] = useState<MintTypeOption>('any')
  const [sortByPeriod, setSortByPeriod] = useState<MintsSortingOption>('24h')

  let mintQuery: Parameters<typeof useTrendingMints>['0'] = {
    limit: 50,
    period: sortByPeriod,
    type: mintType,
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

  const { data, isValidating } = useTrendingMints(mintQuery, chain.id, {
    fallbackData: [ssr.mint],
  })

  let mints = data || []

  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})

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
              Trending Mints
            </Text>
            <Flex align="center" css={{ gap: '$4' }}>
              {!isSmallDevice && (
                <MintTypeSelector
                  option={mintType}
                  onOptionSelected={setMintType}
                />
              )}
              <MintsPeriodDropdown
                compact={compactToggleNames && isMounted}
                option={sortByPeriod}
                onOptionSelected={(option) => {
                  setSortByPeriod(option)
                }}
              />
              <ChainToggle />
            </Flex>
            {isSmallDevice && (
              <MintTypeSelector
                option={mintType}
                onOptionSelected={setMintType}
              />
            )}
          </Flex>
          {isSSR || !isMounted ? null : (
            <MintRankingsTable
              mints={mints}
              loading={isValidating}
              volumeKey="1day"
            />
          )}
        </Flex>
        {isValidating && (
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

type MintsSchema =
  paths['/collections/trending-mints/v1']['get']['responses']['200']['schema']

export const getServerSideProps: GetServerSideProps<{
  ssr: {
    mint: MintsSchema
  }
}> = async ({ res, params }) => {
  const mintsQuery: paths['/collections/trending-mints/v1']['get']['parameters']['query'] =
    {
      period: '24h',
      limit: 50,
    }
  const chainPrefix = params?.chain || ''
  const chain =
    supportedChains.find((chain) => chain.routePrefix === chainPrefix) ||
    DefaultChain
  const query = { ...mintsQuery }

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
    props: { ssr: { mint: response.data } },
  }
}

export default IndexPage
