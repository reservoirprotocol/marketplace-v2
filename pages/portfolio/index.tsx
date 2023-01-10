import { NextPage } from 'next'
import { Text, Flex, Box } from '../../components/primitives'
import Image from 'next/image'
import Layout from 'components/Layout'
import { useIntersectionObserver } from 'usehooks-ts'
import { useMediaQuery } from 'react-responsive'
import { useEffect, useRef, useState } from 'react'
import { useAccount } from 'wagmi'
import { TabsList, TabsTrigger, TabsContent } from 'components/primitives/Tab'
import * as Tabs from '@radix-ui/react-tabs'
import {
  useUserTokens,
  useUserCollections,
} from '@reservoir0x/reservoir-kit-ui'
import { useMounted } from '../../hooks'
import { TokenTable } from 'components/portfolio/TokenTable'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import { MobileTokenFilters } from 'components/common/MobileTokenFilters'
import { TokenFilters } from 'components/common/TokenFilters'
import { FilterButton } from 'components/common/FilterButton'
import { ListingsTable } from 'components/portfolio/ListingsTable'
import { OffersTable } from 'components/portfolio/OffersTable'
import { CollectionsTable } from 'components/portfolio/CollectionsTable'

const IndexPage: NextPage = () => {
  const { address, isConnected } = useAccount()
  const [tokenFiltersOpen, setTokenFiltersOpen] = useState(false)
  const [filterCollection, setFilterCollection] = useState<string | undefined>(
    undefined
  )
  const isSmallDevice = useMediaQuery({ maxWidth: 905 })
  const isMounted = useMounted()

  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {
    rootMargin: '0px 0px 300px 0px',
  })

  let tokenQuery: Parameters<typeof useUserTokens>['1'] = {
    limit: 20,
    collection: filterCollection,
    includeTopBid: true,
  }
  const tokensData = useUserTokens(address, tokenQuery, {})

  const { data: collections } = useUserCollections(address as string, {
    limit: 100,
  })

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      tokensData.fetchNextPage()
    }
  }, [loadMoreObserver?.isIntersecting])

  if (!isMounted) {
    return null
  }

  return (
    <Layout>
      <Flex
        direction="column"
        css={{
          px: '$4',
          py: '$5',
          '@sm': {
            px: '$5',
          },
        }}
      >
        {isConnected ? (
          <>
            <Text style="h4" css={{}}>
              Portfolio
            </Text>
            <Tabs.Root defaultValue="items">
              <Flex css={{ overflowX: 'scroll' }}>
                <TabsList
                  style={{
                    whiteSpace: 'nowrap',
                    width: '100%',
                  }}
                >
                  <TabsTrigger value="items">Items</TabsTrigger>
                  <TabsTrigger value="collections">Collections</TabsTrigger>
                  <TabsTrigger value="listings">Listings</TabsTrigger>
                  <TabsTrigger value="offers">Offers Made</TabsTrigger>
                </TabsList>
              </Flex>

              <TabsContent value="items">
                <Flex
                  css={{
                    gap: tokenFiltersOpen ? '$5' : '0',
                    position: 'relative',
                  }}
                >
                  {isSmallDevice ? (
                    <MobileTokenFilters
                      collections={collections}
                      filterCollection={filterCollection}
                      setFilterCollection={setFilterCollection}
                    />
                  ) : (
                    <TokenFilters
                      open={tokenFiltersOpen}
                      setOpen={setTokenFiltersOpen}
                      collections={collections}
                      filterCollection={filterCollection}
                      setFilterCollection={setFilterCollection}
                    />
                  )}
                  <Box
                    css={{
                      flex: 1,
                      maxWidth: '100%',
                    }}
                  >
                    <Flex justify="between" css={{ marginBottom: '$4' }}>
                      {collections &&
                        collections.length > 0 &&
                        !isSmallDevice && (
                          <FilterButton
                            open={tokenFiltersOpen}
                            setOpen={setTokenFiltersOpen}
                          />
                        )}
                    </Flex>
                    <TokenTable data={tokensData} />
                  </Box>
                </Flex>
              </TabsContent>
              <TabsContent value="collections">
                <CollectionsTable address={address} />
              </TabsContent>
              <TabsContent value="listings">
                <ListingsTable address={address} />
              </TabsContent>
              <TabsContent value="offers">
                <OffersTable address={address} />
              </TabsContent>
            </Tabs.Root>
          </>
        ) : (
          <Flex
            direction="column"
            align="center"
            css={{ mx: 'auto', py: '120px', maxWidth: '350px', gap: '$4' }}
          >
            <Text style="h4" css={{ mb: '$3' }}>
              Sell your NFT instantly
            </Text>
            <Image
              src="/wallet-icon.svg"
              width={32}
              height={32}
              alt="Wallet Icon"
            />
            <Text
              style="body1"
              css={{ color: '$gray11', textAlign: 'center', mb: '$4' }}
            >
              Connect wallet to instant sell your token across all major
              marketplaces.
            </Text>
            <ConnectWalletButton />
          </Flex>
        )}
      </Flex>
    </Layout>
  )
}

export default IndexPage
