import { faWallet } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Tabs from '@radix-ui/react-tabs'
import {
  useCollectionActivity,
  useUserCollections,
} from '@reservoir0x/reservoir-kit-ui'
import { ActivityFilters } from 'components/common/ActivityFilters'
import ChainToggle from 'components/common/ChainToggle'
import { FilterButton } from 'components/common/FilterButton'
import { MobileActivityFilters } from 'components/common/MobileActivityFilters'
import { MobileTokenFilters } from 'components/common/MobileTokenFilters'
import PortfolioSortDropdown, {
  PortfolioSortingOption,
} from 'components/common/PortfolioSortDropdown'
import { TokenFilters } from 'components/common/TokenFilters'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import { Head } from 'components/Head'
import Layout from 'components/Layout'
import { CollectionsTable } from 'components/portfolio/CollectionsTable'
import { ListingsTable } from 'components/portfolio/ListingsTable'
import { OffersTable } from 'components/portfolio/OffersTable'
import { TokenTable } from 'components/portfolio/TokenTable'
import { TabsContent, TabsList, TabsTrigger } from 'components/primitives/Tab'
import { UserActivityTable } from 'components/profile/UserActivityTable'
import { ChainContext } from 'context/ChainContextProvider'
import { NextPage } from 'next'
import { useContext, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useAccount } from 'wagmi'
import { Box, Flex, Text } from '../../components/primitives'
import { useMounted } from '../../hooks'

type ActivityTypes = Exclude<
  NonNullable<
    NonNullable<
      Exclude<Parameters<typeof useCollectionActivity>['0'], boolean>
    >['types']
  >,
  string
>

const IndexPage: NextPage = () => {
  const { address, isConnected } = useAccount()

  const [activityTypes, setActivityTypes] = useState<ActivityTypes>(['sale'])
  const [activityFiltersOpen, setActivityFiltersOpen] = useState(true)
  const [tokenFiltersOpen, setTokenFiltersOpen] = useState(true)
  const [filterCollection, setFilterCollection] = useState<string | undefined>(
    undefined
  )
  const [sortByType, setSortByType] =
    useState<PortfolioSortingOption>('acquiredAt')
  const isSmallDevice = useMediaQuery({ maxWidth: 905 })
  const isMounted = useMounted()

  let collectionQuery: Parameters<typeof useUserCollections>['1'] = {
    limit: 100,
  }

  const { chain } = useContext(ChainContext)

  if (chain.collectionSetId) {
    collectionQuery.collectionsSetId = chain.collectionSetId
  } else if (chain.community) {
    collectionQuery.community = chain.community
  }

  const { data: collections, isLoading: collectionsLoading } =
    useUserCollections(address as string, collectionQuery)

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
              <Flex align="center" justify="between" css={{ gap: '$4' }}>
                <Text style="h4" css={{}}>
                  Portfolio
                </Text>
                <ChainToggle />
              </Flex>
              <Tabs.Root defaultValue="items">
                <Flex
                  css={{ overflowX: 'scroll', '@sm': { overflowX: 'auto' } }}
                >
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
                    <TabsTrigger value="activity">Activity</TabsTrigger>
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
                      {isSmallDevice && (
                        <Flex justify="center">
                          <PortfolioSortDropdown
                            option={sortByType}
                            onOptionSelected={(option) => {
                              setSortByType(option)
                            }}
                          />
                        </Flex>
                      )}
                      <Flex justify="between" css={{ marginBottom: '$4' }}>
                        {!isSmallDevice &&
                          !collectionsLoading &&
                          collections.length > 0 && (
                            <FilterButton
                              open={tokenFiltersOpen}
                              setOpen={setTokenFiltersOpen}
                            />
                          )}
                        {!isSmallDevice && !collectionsLoading && (
                          <PortfolioSortDropdown
                            option={sortByType}
                            onOptionSelected={(option) => {
                              setSortByType(option)
                            }}
                          />
                        )}
                      </Flex>
                      <TokenTable
                        isLoading={collectionsLoading}
                        address={address}
                        sortBy={sortByType}
                        filterCollection={filterCollection}
                      />
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
                <TabsContent value="activity">
                  <Flex
                    css={{
                      gap: activityFiltersOpen ? '$5' : '',
                      position: 'relative',
                    }}
                  >
                    {!isSmallDevice && (
                      <ActivityFilters
                        open={activityFiltersOpen}
                        setOpen={setActivityFiltersOpen}
                        activityTypes={activityTypes}
                        setActivityTypes={setActivityTypes}
                      />
                    )}
                    <Box
                      css={{
                        flex: 1,
                        gap: '$4',
                        pb: '$5',
                      }}
                    >
                      {isSmallDevice ? (
                        <MobileActivityFilters
                          activityTypes={activityTypes}
                          setActivityTypes={setActivityTypes}
                        />
                      ) : (
                        <FilterButton
                          open={activityFiltersOpen}
                          setOpen={setActivityFiltersOpen}
                        />
                      )}
                      <UserActivityTable
                        user={address}
                        activityTypes={activityTypes}
                      />
                    </Box>
                  </Flex>
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
