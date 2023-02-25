import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { Text, Flex, Box } from 'components/primitives'
import Layout from 'components/Layout'
import { useEffect, useRef } from 'react'
import { useMarketplaceChain, useMounted } from 'hooks'
import { paths } from '@nftearth/reservoir-sdk'
import { useCollections } from '@nftearth/reservoir-kit-ui'
import fetcher from 'utils/fetcher'
import { NORMALIZE_ROYALTIES } from '../_app'
import supportedChains from 'utils/chains'
import { useIntersectionObserver } from 'usehooks-ts'
import HeroSection from 'components/HeroSection'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import { QuestsGrid } from 'components/quests/QuestsGrid'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const QuestsPage: NextPage<Props> = ({ ssr }) => {
  const isMounted = useMounted()
  const marketplaceChain = useMarketplaceChain()

  let collectionQuery: Parameters<typeof useCollections>['0'] = {
    limit: 12,
    normalizeRoyalties: NORMALIZE_ROYALTIES,
    sortBy: 'allTimeVolume',
  }

  const { data, hasNextPage, fetchNextPage, isFetchingPage, isValidating } =
    useCollections(collectionQuery, {
      fallbackData: [ssr.exploreCollections[marketplaceChain.id]],
    }, marketplaceChain.id)

  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})

  useEffect(() => {
    let isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      fetchNextPage()
    }
  }, [loadMoreObserver?.isIntersecting, isFetchingPage])

  return (
    <Layout>
      {/* <Box
        css={{
          p: 24,
          height: '100%',
          '@bp800': {
            p: '$6',
          },
        }}
      >
        <HeroSection hideLink />
        <Flex css={{ my: '$6', gap: 65 }} direction="column">
          <Flex
            justify="between"
            align="start"
            css={{
              flexDirection: 'column',
              gap: 24,
              '@bp800': {
                alignItems: 'center',
                flexDirection: 'row',
              },
            }}
          >
            <Box css={{ width: '100%' }}>
              <Text
                style="h4"
                as="h4"
                css={{ marginBottom: '15px', marginLeft: '5px' }}
              >
                My Points
              </Text>
              <Flex
                css={{
                  flexDirection: 'row',
                  background: '$gray4',
                  width: '100%',
                  borderRadius: '20px',
                  padding: '10px',
                }}
              >
                <Box css={{ marginLeft: 'auto', marginRight: 'auto' }}>
                  <Text
                    css={{ marginBottom: '15px', marginLeft: '5px' }}
                    style="h4"
                    as="h4"
                  >
                    Connect your Wallet
                  </Text>
                  <Box css={{ marginLeft: '100px', marginRight: 'auto' }}>
                    <ConnectWalletButton />
                  </Box>
                </Box>
              </Flex>
            </Box>
          </Flex>
          <Box>
            <Text
              css={{ marginBottom: '15px', marginLeft: '5px' }}
              style="h4"
              as="h4"
            >
              One-Time Quest
            </Text>
            {isMounted && <QuestsGrid />}
          </Box>
          <Box>
            <Text
              css={{ marginBottom: '15px', marginLeft: '5px' }}
              style="h4"
              as="h4"
            >
              Daily Quest
            </Text>
            {isMounted && <QuestsGrid />}
          </Box>
          <Box>
            <Text
              css={{ marginBottom: '15px', marginLeft: '5px' }}
              style="h4"
              as="h4"
            >
              Special Quest
            </Text>
            {isMounted && <QuestsGrid />}
          </Box>
          <Box>
            <Text
              css={{ marginBottom: '15px', marginLeft: '5px' }}
              style="h4"
              as="h4"
            >
              Finished Quest
            </Text>
            {isMounted && <QuestsGrid />}
          </Box>
          <Box>
            <Text
              css={{ marginBottom: '15px', marginLeft: '5px' }}
              style="h4"
              as="h4"
            >
              Claimable Reward(s)
            </Text>
            {isMounted && <QuestsGrid />}
          </Box>
          <Box>
            <Text
              css={{ marginBottom: '15px', marginLeft: '5px' }}
              style="h4"
              as="h4"
            >
              Claimed Reward(s)
            </Text>
            {isMounted && <QuestsGrid />}
          </Box>
        </Flex>
      </Box> */}
      <Box
        css={{
          p: 24,
          height: 'calc(100vh - 80px)',
          '@bp800': {
            p: '$6',
          },
        }}
      >
        <Flex
          align="center"
          justify="center"
          direction="column"
          css={{
            height: '100%',
            width: '100%',
          }}
        >
          <Text
            style={{
              '@initial': 'h3',
              '@lg': 'h2',
            }}
            css={{ lineHeight: 1.2, letterSpacing: 2, color: '$gray10' }}
          >
            COMING SOON
          </Text>
          <Text css={{ color: '$gray10' }}>
            This page is under construction
          </Text>
        </Flex>
      </Box>
    </Layout>
  )
}

type CollectionSchema =
  paths['/collections/v5']['get']['responses']['200']['schema']
type ChainCollections = Record<string, CollectionSchema>

export const getStaticProps: GetStaticProps<{
  ssr: {
    exploreCollections: ChainCollections
  }
}> = async () => {
  let collectionQuery: paths['/collections/v5']['get']['parameters']['query'] =
    {
      sortBy: '1DayVolume',
      normalizeRoyalties: NORMALIZE_ROYALTIES,
      limit: 12,
    }

  const promises: ReturnType<typeof fetcher>[] = []
  supportedChains.forEach((chain) => {
    promises.push(
      fetcher(`${chain.reservoirBaseUrl}/collections/v5`, collectionQuery, {
        headers: {
          'x-api-key': chain.apiKey || '',
        },
      })
    )
  })

  const responses = await Promise.allSettled(promises)
  const collections: ChainCollections = {}
  responses.forEach((response, i) => {
    if (response.status === 'fulfilled') {
      collections[supportedChains[i].id] = response.value.data
    }
  })

  return {
    props: { ssr: { exploreCollections: collections } },
    revalidate: 5,
  }
}

export default QuestsPage
