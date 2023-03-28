import { NextPage } from 'next'
import { Text, Flex, Box } from '../../components/primitives'
import Layout from 'components/Layout'
import { useMediaQuery } from 'react-responsive'
import { useContext, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { TabsList, TabsTrigger, TabsContent } from 'components/primitives/Tab'
import * as Tabs from '@radix-ui/react-tabs'
import {
  useUserCollections,
  useUserTokens,
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
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { COLLECTION_SET_ID, COMMUNITY } from 'pages/_app'
import ChainToggle from 'components/common/ChainToggle'
import { Head } from 'components/Head'
import BatchActionsFooter from 'components/portfolio/BatchActionsFooter'
import BatchListings from 'components/portfolio/BatchListings'
import { ChainContext } from 'context/ChainContextProvider'

export type UserToken = ReturnType<typeof useUserTokens>['data'][0]

const IndexPage: NextPage = () => {
  const { address, isConnected } = useAccount()
  const [tokenFiltersOpen, setTokenFiltersOpen] = useState(true)
  const [filterCollection, setFilterCollection] = useState<string | undefined>(
    undefined
  )
  const isSmallDevice = useMediaQuery({ maxWidth: 905 })
  const isMounted = useMounted()

  let collectionQuery: Parameters<typeof useUserCollections>['1'] = {
    limit: 100,
  }

  if (COLLECTION_SET_ID) {
    collectionQuery.collectionsSetId = COLLECTION_SET_ID
  } else if (COMMUNITY) {
    collectionQuery.community = COMMUNITY
  }

  const { data: collections, isLoading: collectionsLoading } =
    useUserCollections(address as string, collectionQuery)

  // Batch listing logic
  const [showListingPage, setShowListingPage] = useState(false)
  const [selectedItems, setSelectedItems] = useState<UserToken[]>([])

  const { chain } = useContext(ChainContext)

  useEffect(() => {
    setSelectedItems([])
  }, [chain])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Head />
      <Layout>
        <Flex
          direction="column"
          css={{
            px: '$4',
            py: 40,
            '@sm': {
              px: '$5',
            },
          }}
        >
          {isConnected ? (
            <>
              {showListingPage && !isSmallDevice ? (
                <BatchListings
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                  setShowListingPage={setShowListingPage}
                />
              ) : (
                <>
                  <Flex align="center" justify="between" css={{ gap: '$4' }}>
                    <Text style="h4" css={{}}>
                      Portfolio
                    </Text>
                    <ChainToggle />
                  </Flex>
                  <Tabs.Root defaultValue="items">
                    <Flex
                      css={{
                        overflowX: 'scroll',
                        '@sm': { overflowX: 'auto' },
                      }}
                    >
                      <TabsList
                        style={{
                          whiteSpace: 'nowrap',
                          width: '100%',
                        }}
                      >
                        <TabsTrigger value="items">Items</TabsTrigger>
                        <TabsTrigger value="collections">
                          Collections
                        </TabsTrigger>
                        <TabsTrigger value="listings">Listings</TabsTrigger>
                        <TabsTrigger value="offers">Offers Made</TabsTrigger>
                      </TabsList>
                    </Flex>

                    <TabsContent value="items">
                      <Flex
                        css={{
                          gap: tokenFiltersOpen ? '$5' : '0',
                          position: 'relative',
                          pb: 37,
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
                            isLoading={collectionsLoading}
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
                            {!isSmallDevice &&
                              !collectionsLoading &&
                              collections.length > 0 && (
                                <FilterButton
                                  open={tokenFiltersOpen}
                                  setOpen={setTokenFiltersOpen}
                                />
                              )}
                          </Flex>
                          <TokenTable
                            isLoading={collectionsLoading}
                            address={address}
                            filterCollection={filterCollection}
                            selectedItems={selectedItems}
                            setSelectedItems={setSelectedItems}
                          />
                        </Box>
                        {!isSmallDevice && (
                          <BatchActionsFooter
                            selectedItems={selectedItems}
                            setSelectedItems={setSelectedItems}
                            setShowListingPage={setShowListingPage}
                          />
                        )}
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
              )}
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
              <Text css={{ color: '$gray11' }}>
                <FontAwesomeIcon icon={faWallet} size="2xl" />
              </Text>
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
    </>
  )
}

export default IndexPage
