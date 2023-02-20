import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { Flex, Box, Button, Text } from 'components/primitives'
import Layout from 'components/Layout'
import { useEffect, useRef, useState } from 'react'
import { useMarketplaceChain } from 'hooks'
import { paths } from '@nftearth/reservoir-sdk'
import { useCollections } from '@nftearth/reservoir-kit-ui'
import fetcher from 'utils/fetcher'
import Link from 'next/link'
import { NORMALIZE_ROYALTIES } from '../_app'
import supportedChains from 'utils/chains'
import { useIntersectionObserver } from 'usehooks-ts'
import { ClaimReward } from 'components/claim/ClaimReward'
import { ClaimRewardHeroBanner } from 'components/claim/ClaimRewardHeroBanner'
import * as Dialog from '@radix-ui/react-dialog'
import { faWarning } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const ClaimPage: NextPage<Props> = ({ ssr }) => {
  const marketplaceChain = useMarketplaceChain()
  const [container, setContainer] = useState(null)

  let collectionQuery: Parameters<typeof useCollections>['0'] = {
    limit: 12,
    normalizeRoyalties: NORMALIZE_ROYALTIES,
    sortBy: 'allTimeVolume',
  }

  const { fetchNextPage, isFetchingPage, isValidating } = useCollections(
    collectionQuery,
    {
      fallbackData: [ssr.exploreCollections[marketplaceChain.id]],
    }
  )

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
      <Box
        css={{
          p: 24,
          height: '100%',
          '@bp800': {
            p: '$6',
          },
        }}
      >
        <Box ref={setContainer} />
        <ClaimRewardHeroBanner
          title="Claim your Rewards"
          description=" Claim your Rewards after listing your NFT on the marketplace. See
          which rewards your are eligible to claim for."
        />
        <Flex css={{ my: '$6', gap: 65 }} direction="column">
          <ClaimReward
            image="https://nftearth.exchange/render-image-1.png"
            title="Claim your $500 deposit bonus"
            description="If you were one of the 1,786 eligible addresses for airdrop 1 and have listed an NFT on NFTEarth, you can claim your $NFTE tokens below."
          />
        </Flex>
      </Box>

      {/* <Dialog.Root defaultOpen>
        <Dialog.Portal container={container}>
          <Dialog.Overlay />
          <Dialog.Content>
            <Flex
              justify="between"
              css={{
                borderTop: '1px solid $gray7',
                borderStyle: 'solid',
                pt: '$5',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 36,
                '@bp600': {
                  flexDirection: 'row',
                  gap: 0,
                },
              }}
            >
              <FontAwesomeIcon icon={faWarning} style={{ marginRight: 5 }} />
              <Text
                style="subtitle1"
                css={{
                  lineHeight: 1.5,
                  color: '$whiteA12',
                  width: '100%',
                  '@lg': { width: '50%' },
                }}
              >
                Have you "Listed" an NFT on the marketplace?
              </Text>
              <Link href="/">
                <Button>Back to Home</Button>
              </Link>
            </Flex>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root> */}
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

export default ClaimPage
