import { NextPage } from 'next'
import { Text, Flex, Box } from '../../components/primitives'
import Layout from 'components/Layout'
import { useMediaQuery } from 'react-responsive'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useAccount } from 'wagmi'
import { TabsList, TabsTrigger, TabsContent } from 'components/primitives/Tab'
import * as Tabs from '@radix-ui/react-tabs'
import {
  AcceptBidModal,
  AcceptBidStep,
  useUserCollections,
  useUserTokens,
} from '@reservoir0x/reservoir-kit-ui'
import { useENSResolver, useMounted } from '../../hooks'
import { TokenTable, TokenTableRef } from 'components/portfolio/TokenTable'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import { MobileTokenFilters } from 'components/common/MobileTokenFilters'
import { TokenFilters } from 'components/common/TokenFilters'
import { FilterButton } from 'components/common/FilterButton'
import { ListingsTable } from 'components/portfolio/ListingsTable'
import { OffersTable } from 'components/portfolio/OffersTable'
import { faCopy, faWallet } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ChainToggle from 'components/common/ChainToggle'
import { Head } from 'components/Head'
import BatchActionsFooter from 'components/portfolio/BatchActionsFooter'
import BatchListings from 'components/portfolio/BatchListings'
import { ChainContext } from 'context/ChainContextProvider'
import PortfolioSortDropdown, {
  PortfolioSortingOption,
} from 'components/common/PortfolioSortDropdown'
import { ActivityFilters } from 'components/common/ActivityFilters'
import { MobileActivityFilters } from 'components/common/MobileActivityFilters'
import { UserActivityTable } from 'components/portfolio/UserActivityTable'
import { useCollectionActivity } from '@reservoir0x/reservoir-kit-ui'
import { useRouter } from 'next/router'
import { ItemView, ViewToggle } from 'components/portfolio/ViewToggle'
import { ToastContext } from 'context/ToastContextProvider'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { Avatar } from 'components/primitives/Avatar'
import CopyText from 'components/common/CopyText'

type ActivityTypes = Exclude<
  NonNullable<
    NonNullable<
      Exclude<Parameters<typeof useCollectionActivity>['0'], boolean>
    >['types']
  >,
  string
>

export type UserToken = ReturnType<typeof useUserTokens>['data'][0]

const IndexPage: NextPage = () => {
  const router = useRouter()
  const { address: accountAddress, isConnected } = useAccount()
  const address = router.query.address
    ? (router.query.address[0] as `0x${string}`)
    : accountAddress
  const [tabValue, setTabValue] = useState('items')
  const [itemView, setItemView] = useState<ItemView>('list')

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
  const { addToast } = useContext(ToastContext)
  const isOwner =
    !router.query.address || router.query.address[0] === accountAddress

  const {
    avatar: ensAvatar,
    name: resolvedEnsName,
    shortAddress,
  } = useENSResolver(address)

  let collectionQuery: Parameters<typeof useUserCollections>['1'] = {
    limit: 100,
  }

  const { chain } = useContext(ChainContext)

  if (chain.collectionSetId) {
    collectionQuery.collectionsSetId = chain.collectionSetId
  } else if (chain.community) {
    collectionQuery.community = chain.community
  }

  const {
    data: collections,
    isLoading: collectionsLoading,
    fetchNextPage,
  } = useUserCollections(address as string, collectionQuery)

  // Batch listing logic
  const [showListingPage, setShowListingPage] = useState(false)
  const [batchAcceptBidModalOpen, setBatchAcceptBidModalOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<UserToken[]>([])

  const sellableItems = useMemo(
    () =>
      selectedItems
        .filter((item) => item.token?.topBid?.id !== null)
        .map((item) => ({
          tokenId: item.token?.tokenId as string,
          collectionId: item.token?.collection?.id as string,
        })),
    [selectedItems]
  )

  const tokenTableRef = useRef<TokenTableRef>(null)

  useEffect(() => {
    setSelectedItems([])
  }, [chain])

  useEffect(() => {
    setSelectedItems([])
    setShowListingPage(false)
    setBatchAcceptBidModalOpen(false)
  }, [address])

  useEffect(() => {
    let tab = tabValue

    let deeplinkTab: string | null = null
    if (typeof window !== 'undefined') {
      const params = new URL(window.location.href).searchParams
      deeplinkTab = params.get('tab')
    }

    if (deeplinkTab) {
      switch (deeplinkTab) {
        case 'items':
          tab = 'items'
          break
        case 'collections':
          tab = 'collections'
          break
        case 'listings':
          tab = 'listings'
          break
        case 'offers':
          tab = 'offers'
          break
        case 'activity':
          tab = 'activity'
          break
      }
    }
    setTabValue(tab)
  }, [isSmallDevice, router.asPath])

  useEffect(() => {
    router.query.tab = tabValue
    router.push(router, undefined, { shallow: true })
  }, [tabValue])

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
          {!isOwner || isConnected ? (
            <>
              {showListingPage && !isSmallDevice ? (
                <BatchListings
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                  setShowListingPage={setShowListingPage}
                />
              ) : (
                <>
                  <Flex
                    align="center"
                    justify="between"
                    css={{
                      gap: '$4',
                      flexDirection: 'column',
                      alignItems: 'start',
                      '@sm': { flexDirection: 'row', alignItems: 'center' },
                    }}
                  >
                    <Flex align="center">
                      {ensAvatar ? (
                        <Avatar size="xxl" src={ensAvatar} />
                      ) : (
                        <Jazzicon
                          diameter={64}
                          seed={jsNumberForAddress(address as string)}
                        />
                      )}
                      <Flex direction="column" css={{ ml: '$4' }}>
                        <Text style="h5">
                          {resolvedEnsName ? resolvedEnsName : shortAddress}
                        </Text>
                        <CopyText text={address as string}>
                          <Flex align="center" css={{ cursor: 'pointer' }}>
                            <Text
                              style="subtitle1"
                              color="subtle"
                              css={{ mr: '$3' }}
                            >
                              {shortAddress}
                            </Text>
                            <Box css={{ color: '$gray10' }}>
                              <FontAwesomeIcon
                                icon={faCopy}
                                width={16}
                                height={16}
                              />
                            </Box>
                          </Flex>
                        </CopyText>
                      </Flex>
                    </Flex>
                    <ChainToggle />
                  </Flex>
                  <Tabs.Root
                    defaultValue="items"
                    value={tabValue}
                    onValueChange={(value) => setTabValue(value)}
                  >
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
                          pb: 37,
                        }}
                      >
                        {isSmallDevice ? (
                          <MobileTokenFilters
                            collections={collections}
                            filterCollection={filterCollection}
                            setFilterCollection={setFilterCollection}
                            loadMoreCollections={fetchNextPage}
                          />
                        ) : (
                          <TokenFilters
                            isLoading={collectionsLoading}
                            isOwner={isOwner}
                            open={tokenFiltersOpen}
                            setOpen={setTokenFiltersOpen}
                            collections={collections}
                            filterCollection={filterCollection}
                            setFilterCollection={setFilterCollection}
                            loadMoreCollections={fetchNextPage}
                          />
                        )}
                        <Box
                          css={{
                            flex: 1,
                            maxWidth: '100%',
                          }}
                        >
                          {isSmallDevice && (
                            <Flex justify="between" css={{ gap: '$3' }}>
                              <PortfolioSortDropdown
                                option={sortByType}
                                onOptionSelected={(option) => {
                                  setSortByType(option)
                                }}
                              />
                              <ViewToggle
                                itemView={itemView}
                                setItemView={setItemView}
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
                              <Flex
                                align="center"
                                justify="between"
                                css={{ gap: '$3' }}
                              >
                                <PortfolioSortDropdown
                                  option={sortByType}
                                  onOptionSelected={(option) => {
                                    setSortByType(option)
                                  }}
                                />
                                <ViewToggle
                                  itemView={itemView}
                                  setItemView={setItemView}
                                />
                              </Flex>
                            )}
                          </Flex>
                          <TokenTable
                            ref={tokenTableRef}
                            isLoading={collectionsLoading}
                            address={address}
                            filterCollection={filterCollection}
                            sortBy={sortByType}
                            selectedItems={selectedItems}
                            setSelectedItems={setSelectedItems}
                            isOwner={isOwner}
                            itemView={itemView}
                          />
                        </Box>
                        {!isSmallDevice && (
                          <BatchActionsFooter
                            selectedItems={selectedItems}
                            setSelectedItems={setSelectedItems}
                            setShowListingPage={setShowListingPage}
                            setOpenAcceptBidModal={setBatchAcceptBidModalOpen}
                            isOwner={isOwner}
                          />
                        )}
                      </Flex>
                    </TabsContent>
                    <TabsContent value="listings">
                      <ListingsTable address={address} isOwner={isOwner} />
                    </TabsContent>
                    <TabsContent value="offers">
                      <OffersTable address={address} isOwner={isOwner} />
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
        <AcceptBidModal
          trigger={null}
          openState={[batchAcceptBidModalOpen, setBatchAcceptBidModalOpen]}
          tokens={sellableItems}
          onClose={(data, stepData, currentStep) => {
            if (tokenTableRef && currentStep == AcceptBidStep.Complete) {
              tokenTableRef.current?.mutate()
              setSelectedItems([])
            }
          }}
          onBidAcceptError={(error: any) => {
            if (error?.type === 'price mismatch') {
              addToast?.({
                title: 'Could not accept offer',
                description: 'Offer was lower than expected.',
              })
              return
            }
            // Handle user rejection
            if (error?.code === 4001) {
              addToast?.({
                title: 'User canceled transaction',
                description: 'You have canceled the transaction.',
              })
              return
            }
            addToast?.({
              title: 'Could not accept offer',
              description: 'The transaction was not completed.',
            })
          }}
        />
      </Layout>
    </>
  )
}

export default IndexPage
