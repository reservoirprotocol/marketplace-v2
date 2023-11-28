import {
  faChevronLeft,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Flex,
  Text,
  Button,
  Select,
  FormatCryptoCurrency,
  Input,
} from 'components/primitives'
import {
  ComponentPropsWithoutRef,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Currency, Listing, ListModal } from '@reservoir0x/reservoir-kit-ui'
import expirationOptions from 'utils/defaultExpirationOptions'
import { ExpirationOption } from 'types/ExpirationOption'
import { UserToken } from 'pages/portfolio/[[...address]]'
import CryptoCurrencyIcon from 'components/primitives/CryptoCurrencyIcon'
import { useChainCurrency, useMarketplaceChain } from 'hooks'
import BatchListModal from 'components/portfolio/BatchListModal'
import { useMediaQuery } from 'react-responsive'
import { BatchListingsTableHeading } from './BatchListingsTableHeading'
import { BatchListingsTableRow } from './BatchListingsTableRow'
import useOnChainRoyalties, {
  OnChainRoyaltyReturnType,
} from 'hooks/useOnChainRoyalties'
import { formatUnits } from 'viem'

export type BatchListing = {
  token: UserToken
  price: string
  quantity: number
  expirationOption: ExpirationOption
  orderbook: Listing['orderbook']
  orderKind: Listing['orderKind']
  marketplaceFee?: number
}

type ListingCurrencies = ComponentPropsWithoutRef<
  typeof ListModal
>['currencies']

export type Marketplace = {
  name: string
  imageUrl: string
  orderbook: string
  orderKind: string
}

type Props = {
  selectedItems: UserToken[]
  setSelectedItems: Dispatch<SetStateAction<UserToken[]>>
  setShowListingPage: Dispatch<SetStateAction<boolean>>
}

const MINIMUM_AMOUNT = 0.000001

const marketplaces = [
  {
    name: 'Reservoir',
    imageUrl: 'https://api.reservoir.tools/redirect/sources/reservoir/logo/v2',
    orderbook: 'reservoir',
    orderKind: 'seaport-v1.5',
  },
]

const BatchListings: FC<Props> = ({
  selectedItems,
  setSelectedItems,
  setShowListingPage,
}) => {
  const [listings, setListings] = useState<BatchListing[]>([])

  const [selectedMarketplaces, setSelectedMarketplaces] = useState<
    Marketplace[]
  >([marketplaces[0]])

  const [globalPrice, setGlobalPrice] = useState<string>('')
  const [globalExpirationOption, setGlobalExpirationOption] =
    useState<ExpirationOption>(expirationOptions[5])

  const [totalProfit, setTotalProfit] = useState<number>(0)

  const [listButtonDisabled, setListButtonDisabled] = useState<boolean>(true)

  const isLargeDevice = useMediaQuery({ minWidth: 1400 })

  const chain = useMarketplaceChain()

  const chainCurrency = useChainCurrency()
  const defaultCurrency = {
    contract: chainCurrency.address,
    symbol: chainCurrency.symbol,
  }
  const currencies: ListingCurrencies = chain.listingCurrencies

  const [currency, setCurrency] = useState<Currency>(
    currencies && currencies[0] ? currencies[0] : defaultCurrency
  )
  const royaltyQuery: NonNullable<
    Parameters<typeof useOnChainRoyalties>['0']['tokens']
  > = useMemo(
    () =>
      listings
        .filter((listing) => listing?.token?.token !== undefined)
        .map((listing) => ({
          contract: listing.token.token?.contract as string,
          tokenId: listing.token.token?.tokenId as string,
        })),
    [listings]
  )
  const { data: onChainRoyalties } = useOnChainRoyalties({
    tokens: royaltyQuery,
    chainId: chain.id,
    enabled: royaltyQuery.length > 0,
  })

  const onChainRoyaltiesMap = useMemo(
    () =>
      onChainRoyalties?.reduce((royalties, royaltyData, i) => {
        if (
          royaltyData.status === 'success' &&
          (royaltyData.result as any)[0] &&
          (royaltyData.result as any)[1]
        ) {
          const royaltyBpsList = (
            royaltyData.result as OnChainRoyaltyReturnType
          )[1]
          const id = `${royaltyQuery[i].contract}:${royaltyQuery[i].tokenId}`
          const totalRoyalty = royaltyBpsList
            ? royaltyBpsList.reduce((total, feeBps) => {
                total += parseFloat(
                  formatUnits(feeBps, currency.decimals || 18)
                )
                return total
              }, 0)
            : 0
          if (totalRoyalty) {
            royalties[id] = (totalRoyalty / 1) * 10000
          }
        }
        return royalties
      }, {} as Record<string, number>) || {},
    [onChainRoyalties, chainCurrency]
  )

  const displayQuantity = useCallback(() => {
    return listings.some((listing) => listing?.token?.token?.kind === 'erc1155')
  }, [listings])

  let gridTemplateColumns = displayQuantity()
    ? isLargeDevice
      ? '1.1fr .5fr 2.6fr .8fr repeat(2, .7fr) .5fr .3fr'
      : '1.3fr .6fr 1.6fr 1fr repeat(2, .9fr) .6fr .3fr'
    : isLargeDevice
    ? '1.1fr 2.7fr 1fr repeat(2, .7fr) .5fr .3fr'
    : '1.3fr 1.8fr 1.2fr repeat(2, .9fr) .6fr .3fr'

  const generateListings = useCallback(() => {
    const listings = selectedItems.flatMap((item) => {
      return selectedMarketplaces.map((marketplace) => {
        const listing: BatchListing = {
          token: item,
          quantity: 1,
          price: globalPrice || '0',
          expirationOption: globalExpirationOption,
          //@ts-ignore
          orderbook: marketplace.orderbook,
          //@ts-ignore
          orderKind: marketplace.orderKind,
        }

        return listing
      })
    })

    return listings
  }, [selectedItems, selectedMarketplaces])

  useEffect(() => {
    setListings(generateListings())
  }, [selectedItems, selectedMarketplaces, generateListings])

  useEffect(() => {
    const maxProfit = selectedItems.reduce((total, item) => {
      const itemId = `${item.token?.contract}:${item.token?.tokenId}`
      const itemListings = listings.filter(
        (listing) =>
          `${listing.token.token?.contract}:${listing.token.token?.tokenId}` ===
          itemId
      )

      const onChainRoyaltyBps = onChainRoyaltiesMap[itemId]

      const profits = itemListings.map((listing) => {
        const listingCreatorRoyalties =
          (Number(listing.price) *
            listing.quantity *
            (onChainRoyaltyBps ||
              listing?.token?.token?.collection?.royaltiesBps ||
              0)) /
          10000

        const profit =
          Number(listing.price) * listing.quantity -
          (listing.marketplaceFee || 0) -
          listingCreatorRoyalties

        return profit
      })

      const highestProfit = Math.max(...profits)

      return total + highestProfit
    }, 0)

    setTotalProfit(maxProfit)
  }, [listings, onChainRoyaltiesMap, selectedMarketplaces, globalPrice])

  useEffect(() => {
    const hasInvalidPrice = listings.some(
      (listing) =>
        listing.price === undefined ||
        listing.price === '' ||
        Number(listing.price) < MINIMUM_AMOUNT
    )
    setListButtonDisabled(hasInvalidPrice)
  }, [listings])

  const updateListing = useCallback((updatedListing: BatchListing) => {
    setListings((prevListings) => {
      return prevListings.map((listing) => {
        if (
          listing.token === updatedListing.token &&
          listing.orderbook === updatedListing.orderbook
        ) {
          return updatedListing
        }
        return listing
      })
    })
  }, [])

  const applyFloorPrice = useCallback(() => {
    setListings((prevListings) => {
      return prevListings.map((listing) => {
        if (listing.token.token?.collection?.floorAskPrice?.amount?.native) {
          return {
            ...listing,
            price:
              listing.token.token?.collection?.floorAskPrice?.amount?.native.toString(),
          }
        }
        return listing
      })
    })
    setCurrency(defaultCurrency)
  }, [listings])

  const applyTopTraitPrice = useCallback(() => {
    setListings((prevListings) => {
      return prevListings.map((listing) => {
        if (listing.token.token?.attributes) {
          // Find the highest floor price
          let topTraitPrice = Math.max(
            ...listing.token.token.attributes.map(
              (attribute) => attribute.floorAskPrice ?? 0
            )
          )
          if (topTraitPrice && topTraitPrice > 0) {
            return {
              ...listing,
              price: topTraitPrice.toString(),
            }
          }
        }

        return listing
      })
    })
    setCurrency(defaultCurrency)
  }, [listings])

  return (
    <Flex direction="column" css={{ gap: '$5', width: '100%' }}>
      <Flex align="center" css={{ gap: 24 }}>
        <Button
          color="gray3"
          size="small"
          css={{ justifyContent: 'center', width: '44px', height: '44px' }}
          onClick={() => setShowListingPage(false)}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <Text style="h4">List for Sale</Text>
      </Flex>
      <Flex
        justify="between"
        css={{ border: '1px solid $gray6', borderRadius: 8, p: 24 }}
      >
        <Flex direction="column" css={{ gap: '$3' }}>
          <Text style="h6">Apply to All</Text>
          <Flex align="center" css={{ gap: '$5' }}>
            {isLargeDevice ? (
              <Flex align="center" css={{ gap: '$3' }}>
                <Button
                  color="gray3"
                  corners="pill"
                  size="large"
                  css={{ minWidth: 'max-content' }}
                  onClick={applyFloorPrice}
                >
                  Floor
                </Button>
                <Button
                  color="gray3"
                  corners="pill"
                  size="large"
                  css={{ minWidth: 'max-content' }}
                  onClick={applyTopTraitPrice}
                >
                  Top Trait
                </Button>
              </Flex>
            ) : null}
            <Flex align="center" css={{ gap: '$3' }}>
              <Select
                trigger={
                  <Select.Trigger
                    css={{
                      width: 130,
                    }}
                  >
                    <Select.Value asChild>
                      <Flex align="center" justify="center">
                        <CryptoCurrencyIcon
                          address={currency.contract}
                          css={{ height: 18 }}
                        />
                        <Text
                          style="subtitle1"
                          color="subtle"
                          css={{ ml: '$1' }}
                        >
                          {currency.symbol}
                        </Text>
                        {currencies && currencies?.length > 1 ? (
                          <Select.DownIcon style={{ marginLeft: 6 }} />
                        ) : null}
                      </Flex>
                    </Select.Value>
                  </Select.Trigger>
                }
                value={currency.contract}
                onValueChange={(value: string) => {
                  const option = currencies?.find(
                    (option) => option.contract == value
                  )
                  if (option) {
                    setCurrency(option)
                  }
                }}
              >
                {currencies?.map((option) => (
                  <Select.Item key={option.contract} value={option.contract}>
                    <Select.ItemText>
                      <Flex align="center" css={{ gap: '$1' }}>
                        <CryptoCurrencyIcon
                          address={option.contract}
                          css={{ height: 18 }}
                        />
                        {option.symbol}
                      </Flex>
                    </Select.ItemText>
                  </Select.Item>
                ))}
              </Select>
              <Input
                placeholder="Set Price for All"
                type="number"
                value={globalPrice}
                onChange={(e) => {
                  setGlobalPrice(e.target.value)
                }}
              />
            </Flex>
            <Flex align="center" css={{ gap: '$3' }}>
              <Select
                css={{
                  flex: 1,
                  width: 200,
                }}
                value={globalExpirationOption?.text || ''}
                onValueChange={(value: string) => {
                  const option = expirationOptions.find(
                    (option) => option.value == value
                  )
                  if (option) {
                    setGlobalExpirationOption(option)
                  }
                }}
              >
                {expirationOptions.map((option) => (
                  <Select.Item key={option.text} value={option.value}>
                    <Select.ItemText>{option.text}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      {listings.length > 0 ? (
        <Flex direction="column" css={{ width: '100%', pb: 37 }}>
          <BatchListingsTableHeading
            displayQuantity={displayQuantity()}
            gridTemplateColumns={gridTemplateColumns}
          />
          {listings.map((listing, i) => (
            <BatchListingsTableRow
              listing={listing}
              listings={listings}
              onChainRoyaltiesBps={
                onChainRoyaltiesMap[
                  `${listing.token.token?.contract}:${listing.token.token?.tokenId}`
                ]
              }
              setListings={setListings}
              updateListing={updateListing}
              setSelectedItems={setSelectedItems}
              selectedItems={selectedItems}
              displayQuantity={displayQuantity()}
              gridTemplateColumns={gridTemplateColumns}
              isLargeDevice={isLargeDevice}
              globalExpirationOption={globalExpirationOption}
              globalPrice={globalPrice}
              currency={currency}
              defaultCurrency={defaultCurrency}
              selectedMarketplaces={selectedMarketplaces}
              key={`${listing.token.token?.collection?.id}:${listing.token.token?.tokenId}:${listing.orderbook}`}
            />
          ))}
          <Flex
            align="center"
            justify="between"
            css={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              px: '$5',
              py: '$4',
              borderTop: '1px solid $gray7',
              backgroundColor: '$neutralBg',
            }}
          >
            <Flex align="center" css={{ gap: 24, marginLeft: 'auto' }}>
              <Text style="body1">Max Profit</Text>
              <FormatCryptoCurrency
                amount={totalProfit}
                logoHeight={18}
                textStyle={'h6'}
                css={{
                  width: 'max-content',
                }}
              />
              <BatchListModal
                listings={listings}
                onChainRoyalties={onChainRoyalties}
                disabled={listButtonDisabled}
                currency={currency}
                selectedMarketplaces={selectedMarketplaces}
                onCloseComplete={() => {
                  setShowListingPage(false)
                  setSelectedItems([])
                  setListings([])
                }}
              />
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <Flex
          direction="column"
          align="center"
          css={{ py: '$6', gap: '$4', width: '100%' }}
        >
          <Text css={{ color: '$gray11' }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} size="2xl" />
          </Text>
          <Text css={{ color: '$gray11' }}>No items selected</Text>
        </Flex>
      )}
    </Flex>
  )
}

export default BatchListings
