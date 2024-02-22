import { useTrendingMints } from '@reservoir0x/reservoir-kit-ui'
import { paths } from '@reservoir0x/reservoir-sdk'
import { Head } from 'components/Head'
import Layout from 'components/Layout'
import ChainToggle from 'components/common/ChainToggle'
import LoadingSpinner from 'components/common/LoadingSpinner'
import MintTypeSelector, {
  MintTypeOption,
} from 'components/common/MintTypeSelector'
import MintsPeriodDropdown, {
  MintsSortingOption,
} from 'components/common/MintsPeriodDropdown'
import { Box, Flex, Text } from 'components/primitives'
import { MintRankingsTable } from 'components/rankings/MintRankingsTable'
import { ChainContext } from 'context/ChainContextProvider'
import { useMounted } from 'hooks'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { useRouter } from 'next/router'
import { NORMALIZE_ROYALTIES } from 'pages/_app'
import { useContext, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import supportedChains, { DefaultChain } from 'utils/chains'
import fetcher from 'utils/fetcher'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const IndexPage: NextPage<Props> = ({ ssr }) => {
  const router = useRouter()
  const isSSR = typeof window === 'undefined'
  const isMounted = useMounted()
  const compactToggleNames = useMediaQuery({ query: '(max-width: 800px)' })
  const isSmallDevice = useMediaQuery({ maxWidth: 600 })

  const [mintType, setMintType] = useState<MintTypeOption>('any')
  const [sortByPeriod, setSortByPeriod] = useState<MintsSortingOption>('24h')

  let mintQuery: Parameters<typeof useTrendingMints>['0'] = {
    limit: 20,
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
    fallbackData: [ssr.mints],
  })

  let mints = data || []

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
            <MintRankingsTable mints={mints} loading={isValidating} />
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

type MintsSchema =
  paths['/collections/trending-mints/v1']['get']['responses']['200']['schema']

export const getServerSideProps: GetServerSideProps<{
  ssr: {
    mints: MintsSchema
  }
}> = async ({ res, params }) => {
  const mintsQuery: paths['/collections/trending-mints/v1']['get']['parameters']['query'] =
    {
      limit: 20,
      period: '24h',
      type: 'any',
    }

  const chainPrefix = params?.chain || ''

  const { reservoirBaseUrl } =
    supportedChains.find((chain) => chain.routePrefix === chainPrefix) ||
    DefaultChain

  const query = { ...mintsQuery, normalizeRoyalties: NORMALIZE_ROYALTIES }

  const response = await fetcher(
    `${reservoirBaseUrl}/collections/trending-mints/v1`,
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
    props: { ssr: { mints: response.data } },
  }
}

export default IndexPage
