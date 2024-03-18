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
import { useChainCurrency, useMarketplaceChain } from 'hooks'
import BatchListModal from 'components/portfolio/BatchListModal'
import { useMediaQuery } from 'react-responsive'
import { BatchListingsTableHeading } from './BatchListingsTableHeading'
import { BatchListingsTableRow } from './BatchListingsTableRow'
import { formatUnits } from 'viem'
import { useMultiMarketplaceConfigs } from '../../hooks'
import {
  Exchange,
  Marketplace as MarketplaceConfig,
} from 'hooks/useMultiMarketplaceConfigs'
import LoadingSpinner from 'components/common/LoadingSpinner'

export type BatchListing = {
  token: UserToken
  price: string
  quantity: number
  expirationOption: ExpirationOption
  orderbook: Listing['orderbook']
  orderKind: Listing['orderKind']
  marketplaceFee?: number
  currency: Currency
  exchange: Exchange
  marketplace: MarketplaceConfig
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
const MAXIMUM_AMOUNT = Infinity

const BatchListings: FC<Props> = ({
  selectedItems,
  setSelectedItems,
  setShowListingPage,
}) => {
  const [listings, setListings] = useState<BatchListing[] | null>(null)

  const [globalPrice, setGlobalPrice] = useState<string>('')
  const [globalExpirationOption, setGlobalExpirationOption] =
    useState<ExpirationOption>(expirationOptions[5])

  const isLargeDevice = useMediaQuery({ minWidth: 1400 })

  const chain = useMarketplaceChain()
  const { tokenExchanges } = useMultiMarketplaceConfigs(
    selectedItems.map(
      (item) => `${item.token?.collection?.id}:${item.token?.tokenId}`
    )
  )

  const chainCurrency = useChainCurrency()
  const defaultCurrency = {
    contract: chainCurrency.address,
    symbol: chainCurrency.symbol,
    decimals: chainCurrency.decimals,
  }
  const currencies: ListingCurrencies = chain.listingCurrencies

  const displayQuantity = useMemo(
    () =>
      listings?.some((listing) => listing?.token?.token?.kind === 'erc1155')
        ? true
        : false,
    [listings]
  )

  let gridTemplateColumns = displayQuantity
    ? isLargeDevice
      ? '1.1fr .5fr 2.6fr .8fr repeat(2, .7fr) .5fr .3fr'
      : '1.3fr .6fr 1.6fr 1fr repeat(2, .9fr) .6fr .3fr'
    : isLargeDevice
    ? '1.1fr 2.7fr 1fr repeat(2, .7fr) .5fr .3fr'
    : '1.3fr 1.8fr 1.2fr repeat(2, .9fr) .6fr .3fr'

  useEffect(() => {
    const newListings: BatchListing[] = selectedItems
      .filter(
        (item) =>
          tokenExchanges[
            `${item.token?.collection?.id}:${item.token?.tokenId}`
          ] !== undefined
      )
      .map((item) => {
        const { exchange, marketplace } =
          tokenExchanges[`${item.token?.collection?.id}:${item.token?.tokenId}`]

        return {
          token: item,
          quantity: 1,
          price: globalPrice || '0',
          expirationOption: globalExpirationOption,
          currency: exchange.paymentTokens
            ? {
                contract: exchange.paymentTokens[0].address as string,
                symbol: exchange.paymentTokens[0].symbol as string,
                decimals: exchange.paymentTokens[0].decimals as number,
              }
            : defaultCurrency,
          orderbook: 'reservoir',
          orderKind: exchange.orderKind as any,
          marketplace: marketplace,
          exchange: exchange,
        }
      })
    setListings(newListings.length > 0 ? newListings : null)
  }, [selectedItems, tokenExchanges])

  const totalProfit = useMemo(() => {
    return selectedItems.reduce((total, item) => {
      const itemId = `${item.token?.contract}:${item.token?.tokenId}`
      const itemListings = listings?.filter(
        (listing) =>
          `${listing.token.token?.contract}:${listing.token.token?.tokenId}` ===
          itemId
      )

      const profits =
        itemListings?.map((listing) => {
          const listingCreatorRoyalties =
            (Number(listing.price) *
              listing.quantity *
              (listing?.token?.token?.collection?.royaltiesBps ||
                listing.marketplace.royalties?.maxBps ||
                0)) /
            10000
          const marketplaceFee =
            ((listing.marketplace?.fee?.bps || 0) / 10000) *
            Number(listing.price) *
            listing.quantity

          const profit =
            Number(listing.price) * listing.quantity -
            marketplaceFee -
            listingCreatorRoyalties

          return profit
        }) ?? []

      const highestProfit = Math.max(...profits)

      return total + highestProfit
    }, 0)
  }, [listings, globalPrice])

  const listButtonDisabled = useMemo(() => {
    const hasInvalidPrice = listings?.some((listing) => {
      const minimumAmount = listing.exchange?.minPriceRaw
        ? Number(
            formatUnits(
              BigInt(listing.exchange.minPriceRaw),
              listing.currency?.decimals || 18
            )
          )
        : MINIMUM_AMOUNT
      const maximumAmount = listing.exchange?.maxPriceRaw
        ? Number(
            formatUnits(
              BigInt(listing.exchange.maxPriceRaw),
              listing.currency?.decimals || 18
            )
          )
        : MAXIMUM_AMOUNT

      const withinPricingBounds =
        listing.price &&
        Number(listing.price) !== 0 &&
        Number(listing.price) <= maximumAmount &&
        Number(listing.price) >= minimumAmount
      return !withinPricingBounds
    })
    return hasInvalidPrice ? true : false
  }, [listings])

  const updateListing = useCallback((updatedListing: BatchListing) => {
    setListings((prevListings) => {
      return (
        prevListings?.map((listing) => {
          if (
            listing.token === updatedListing.token &&
            listing.orderbook === updatedListing.orderbook
          ) {
            return updatedListing
          }
          return listing
        }) ?? null
      )
    })
  }, [])

  const applyFloorPrice = useCallback(() => {
    setListings((prevListings) => {
      return (
        prevListings?.map((listing) => {
          if (
            listing.token.token?.collection?.floorAsk?.price?.amount?.decimal &&
            listing.token.token?.collection?.floorAsk?.price?.currency
          ) {
            return {
              ...listing,
              price:
                listing.token.token.collection?.floorAsk?.price?.amount.decimal.toString(),
              currency: listing.token.token?.collection?.floorAsk?.price
                .currency as Currency,
            }
          }
          return listing
        }) ?? []
      )
    })
  }, [listings])

  const applyTopTraitDisabled = useMemo(
    () =>
      listings?.every(
        (listing) =>
          (listing?.exchange?.paymentTokens?.length &&
            listing.exchange.paymentTokens.length > 0) ||
          listing.token.token?.attributes?.every(
            (attribute) => !attribute.floorAskPrice
          )
      ),
    [listings]
  )

  const applyTopTraitPrice = useCallback(() => {
    setListings((prevListings) => {
      return (
        prevListings?.map((listing) => {
          if (
            listing.token.token?.attributes &&
            !listing.exchange?.paymentTokens?.length
          ) {
            // Find the highest floor price
            let topTraitPrice = Math.max(
              ...listing.token.token.attributes.map(
                (attribute) => attribute.floorAskPrice?.amount?.decimal ?? 0
              )
            )
            if (topTraitPrice && topTraitPrice > 0) {
              return {
                ...listing,
                price: topTraitPrice.toString(),
                currency: defaultCurrency,
              }
            }
          }

          return listing
        }) ?? []
      )
    })
  }, [listings, defaultCurrency])

  const globalPriceEnabled = !listings?.some(
    (listing) =>
      listing.exchange.paymentTokens &&
      listing.exchange.paymentTokens.length > 0
  )

  const displayMaxProfit = useMemo(() => {
    const currencies: string[] = []
    const mixedCurrencies = listings?.find((listing) => {
      if (!currencies.includes(listing.currency.contract)) {
        currencies.push(listing.currency.contract)
      }
      if (currencies.length > 1) {
        return true
      }
    })
    return !mixedCurrencies
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
                {!applyTopTraitDisabled && (
                  <Button
                    color="gray3"
                    corners="pill"
                    size="large"
                    css={{ minWidth: 'max-content' }}
                    onClick={applyTopTraitPrice}
                  >
                    Top Trait
                  </Button>
                )}
              </Flex>
            ) : null}
            <Flex align="center" css={{ gap: '$3' }}>
              {globalPriceEnabled ? (
                <Input
                  placeholder="Set Price for All"
                  type="number"
                  value={globalPrice}
                  onChange={(e) => {
                    setGlobalPrice(e.target.value)
                  }}
                />
              ) : null}
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
      {listings && listings?.length > 0 ? (
        <Flex direction="column" css={{ width: '100%', pb: 37 }}>
          <BatchListingsTableHeading
            displayQuantity={displayQuantity}
            gridTemplateColumns={gridTemplateColumns}
          />
          {listings?.map((listing, i) => (
            <BatchListingsTableRow
              listing={listing}
              listings={listings}
              setListings={setListings}
              updateListing={updateListing}
              setSelectedItems={setSelectedItems}
              selectedItems={selectedItems}
              displayQuantity={displayQuantity}
              gridTemplateColumns={gridTemplateColumns}
              isLargeDevice={isLargeDevice}
              globalExpirationOption={globalExpirationOption}
              globalPrice={globalPrice}
              currencies={currencies || []}
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
              {displayMaxProfit ? (
                <>
                  <Text style="body1">Max Profit</Text>
                  <FormatCryptoCurrency
                    amount={totalProfit}
                    address={listings[0].currency.contract}
                    logoHeight={18}
                    textStyle={'h6'}
                    css={{
                      width: 'max-content',
                    }}
                  />
                </>
              ) : null}
              <BatchListModal
                listings={listings}
                disabled={listButtonDisabled}
                onCloseComplete={() => {
                  setShowListingPage(false)
                  setSelectedItems([])
                  setListings(null)
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
          {!listings ? (
            <LoadingSpinner css={{ justifySelf: 'center' }} />
          ) : (
            <>
              <Text css={{ color: '$gray11' }}>
                <FontAwesomeIcon icon={faMagnifyingGlass} size="2xl" />
              </Text>
              <Text css={{ color: '$gray11' }}>No items selected</Text>
            </>
          )}
        </Flex>
      )}
    </Flex>
  )
}

export default BatchListings
