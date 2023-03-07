import {useEffect, useRef} from "react";
import {  NextPage } from 'next'
import {useAccount} from "wagmi";
import Link from "next/link";
import {useIntersectionObserver} from "usehooks-ts";
import Layout from 'components/Layout'
import { Text, Flex, Box, Button } from 'components/primitives'
import ChainToggle from "components/home/ChainToggle";
import LoadingSpinner from "components/common/LoadingSpinner";
import { CollectionCard } from 'components/my-project/CollectionCard'
import { CollectionGrid } from 'components/my-project/CollectionGrid'
import { useMarketplaceChain, useLaunchpads } from 'hooks'

const MyProjectPage: NextPage = () => {
  const { address } = useAccount();
  const marketplaceChain = useMarketplaceChain()
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})

  const {
    data: launchpads,
    isFetchingPage,
    isValidating,
    mutate,
    fetchNextPage
  } = useLaunchpads(
    marketplaceChain,
    {
      creator: address,
      limit: 20,
    },
  )

  useEffect(() => {
    if (address) {
      mutate?.();
    }
  }, [address])

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
              My Projects
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
          <Box>
            <Link href="/launch">
              <Box css={{ marginLeft: '25px', marginBottom: '20px' }}>
                <Button>Create a project</Button>
              </Box>
            </Link>
            <CollectionGrid>
              {launchpads?.map((launchpad, i) => (
                <CollectionCard heroImg="" key={i} collection={launchpad} routePrefix={marketplaceChain.routePrefix} />
              ))}
              <Box ref={loadMoreRef} css={{ height: 20 }}/>
              {(isValidating) && (
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

export default MyProjectPage
