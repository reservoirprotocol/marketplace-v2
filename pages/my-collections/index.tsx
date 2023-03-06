import { Text, Flex, Box, Button } from 'components/primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderBlank } from '@fortawesome/free-solid-svg-icons'
import Layout from 'components/Layout'
import { paths } from '@nftearth/reservoir-sdk'
import { CollectionCard } from 'components/my-collections/CollectionCard'
import { CollectionGrid } from 'components/my-collections/CollectionGrid'
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import {useMarketplaceChain, useLaunchpads } from 'hooks'
import supportedChains from 'utils/chains'
import { NORMALIZE_ROYALTIES } from 'pages/_app'
import fetcher from 'utils/fetcher'
import {useEffect, useRef} from "react";
import {useIntersectionObserver} from "usehooks-ts";
import {useAccount} from "wagmi";
import ChainToggle from "../../components/home/ChainToggle";
import LoadingSpinner from "../../components/common/LoadingSpinner";

// type Props = InferGetStaticPropsType<typeof getStaticProps>

const MyCollectionsPage: NextPage = () => {
  const { address } = useAccount();
  const marketplaceChain = useMarketplaceChain()
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})

  const launchpadsQuery: Parameters<typeof useLaunchpads>['1'] = {
    creator: address,
    limit: 20,
  }

  const {
    data: launchpads,
    isFetchingPage,
    isValidating,
    fetchNextPage
  } = useLaunchpads(
    marketplaceChain,
    launchpadsQuery,
    {
      revalidateOnMount: true,
      fallbackData: [],
      revalidateFirstPage: true,
    }
  )

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
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
        <Flex justify="between">
          <Flex direction="column">
            <Text css={{ ml: '25px' }} style="h4">
              My Collections
            </Text>
            <Text
              style="subtitle2"
              css={{ marginTop: 4, marginLeft: '25px', color: '$gray11' }}
            >
              Create, curate, and manage collections of unique NFTs to share and
              sell.
            </Text>
          </Flex>
          <Box>
            <ChainToggle compact/>
          </Box>
        </Flex>
        <Flex
          direction="column"
          justify="center"
          css={{
            width: '100%',
            marginTop: 30,
          }}
        >
          <Flex
            justify="start"
            css={{
              color: '$gray8',
              marginLeft: '25px',
              fontSize: 80,
            }}
          >
            <FontAwesomeIcon icon={faFolderBlank} />
          </Flex>
          <Text
            style="subtitle2"
            css={{
              marginTop: 5,
              color: '$gray8',
              marginLeft: '25px',
              textAlign: 'start',
              marginBottom: 10,
            }}
          >
            Create, curate, and manage collections of unique NFTs to share and
            sell.
          </Text>
          <Box>
            <Box css={{ marginLeft: '25px', marginBottom: '20px' }}>
              <Button>Create a collection</Button>
            </Box>
            <CollectionGrid>
              {launchpads?.map((collection, i) => (
                <CollectionCard heroImg="" key={i} collection={collection} routePrefix={marketplaceChain.routePrefix} />
              ))}
              <Box ref={loadMoreRef} css={{ height: 20 }}/>
              {isValidating && (
                <Flex align="center" justify="center" css={{ py: '$5' }}>
                  <LoadingSpinner />
                </Flex>
              )}
            </CollectionGrid>
          </Box>
        </Flex>
      </Box>
    </Layout>
  )
}
//
// type CollectionSchema =
//   paths['/collections/v5']['get']['responses']['200']['schema']
// type ChainCollections = Record<string, CollectionSchema>
//
// export const getStaticProps: GetStaticProps<{
//   ssr: {
//     exploreCollections: ChainCollections
//   }
// }> = async () => {
//   let collectionQuery: paths['/collections/v5']['get']['parameters']['query'] =
//     {
//       sortBy: '1DayVolume',
//       normalizeRoyalties: NORMALIZE_ROYALTIES,
//     }
//
//   const promises: ReturnType<typeof fetcher>[] = []
//   supportedChains.forEach((chain) => {
//     promises.push(
//       fetcher(`${chain.reservoirBaseUrl}/collections/v5`, collectionQuery, {
//         headers: {
//           'x-api-key': chain.apiKey || '',
//         },
//       })
//     )
//   })
//
//   const responses = await Promise.allSettled(promises)
//   const collections: ChainCollections = {}
//   responses.forEach((response, i) => {
//     if (response.status === 'fulfilled') {
//       collections[supportedChains[i].id] = response.value.data
//     }
//   })
//
//   return {
//     props: { ssr: { exploreCollections: collections } },
//     revalidate: 5,
//   }
// }

export default MyCollectionsPage
