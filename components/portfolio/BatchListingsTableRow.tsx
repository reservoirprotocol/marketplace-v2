import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Flex,
  Text,
  Button,
  Select,
  TableCell,
  TableRow,
  FormatCryptoCurrency,
  Input,
} from 'components/primitives'
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Currency } from '@reservoir0x/reservoir-kit-ui'
import expirationOptions from 'utils/defaultExpirationOptions'
import { ExpirationOption } from 'types/ExpirationOption'
import { UserToken } from 'pages/portfolio/[[...address]]'
import CryptoCurrencyIcon from 'components/primitives/CryptoCurrencyIcon'
import useMarketplaceFees from 'hooks/useOpenseaFees'
import { ToastContext } from 'context/ToastContextProvider'
import { BatchListing, Marketplace } from './BatchListings'
import optimizeImage from 'utils/optimizeImage'

type BatchListingsTableRowProps = {
  listing: BatchListing
  listings: BatchListing[]
  onChainRoyaltiesBps: number
  displayQuantity: boolean
  gridTemplateColumns: string
  setListings: Dispatch<SetStateAction<BatchListing[]>>
  updateListing: (updatedListing: BatchListing) => void
  globalExpirationOption: ExpirationOption
  globalPrice: string
  currency: Currency
  defaultCurrency: Currency
  isLargeDevice: boolean
  selectedItems: UserToken[]
  setSelectedItems: Dispatch<SetStateAction<UserToken[]>>
  selectedMarketplaces: Marketplace[]
}

const MINIMUM_AMOUNT = 0.000001

export const BatchListingsTableRow: FC<BatchListingsTableRowProps> = ({
  listing,
  listings,
  onChainRoyaltiesBps,
  setListings,
  updateListing,
  selectedItems,
  displayQuantity,
  gridTemplateColumns,
  isLargeDevice,
  setSelectedItems,
  globalExpirationOption,
  globalPrice,
  currency,
  defaultCurrency,
  selectedMarketplaces,
}) => {
  const [expirationOption, setExpirationOption] = useState<ExpirationOption>(
    globalExpirationOption
  )

  const [price, setPrice] = useState<string>(listing.price)

  const [quantity, setQuantity] = useState<number | undefined>(1)
  const [marketplaceFee, setMarketplaceFee] = useState<number>(0)
  const [marketplaceFeePercent, setMarketplaceFeePercent] = useState<number>(0)

  const tokenImage = useMemo(() => {
    return optimizeImage(listing.token.token?.image, 250)
  }, [listing.token.token?.image])

  const { addToast } = useContext(ToastContext)

  const marketplace = selectedMarketplaces.find(
    (m) => m.orderbook === listing.orderbook
  )

  const handleMarketplaceFeeChange = useCallback(
    (marketplaceFee: number) => {
      setMarketplaceFee(marketplaceFee)
      const updatedListing = { ...listing, marketplaceFee: marketplaceFee }
      updateListing(updatedListing)
    },
    [listing, updateListing]
  )

  const removeListing = useCallback(
    (token: string, orderbook: string) => {
      const updatedListings = listings.filter(
        (listing) =>
          `${listing.token.token?.contract}:${listing.token.token?.tokenId}` !==
            token || listing.orderbook !== orderbook
      )

      // Update selectedItems
      const selectedItemIndex = selectedItems.findIndex(
        (item) => `${item?.token?.contract}:${item?.token?.tokenId}` === token
      )

      if (
        selectedItemIndex !== -1 &&
        !updatedListings.some(
          (listing) =>
            `${listing.token.token?.contract}:${listing.token.token?.tokenId}` ===
            token
        )
      ) {
        const updatedSelectedItems = [...selectedItems]
        updatedSelectedItems.splice(selectedItemIndex, 1)
        setSelectedItems(updatedSelectedItems)
      }

      setListings(updatedListings)
    },
    [listings]
  )

  let openseaFees = useMarketplaceFees(
    listing.orderbook == 'opensea'
      ? (listing.token.token?.collection?.id as string)
      : undefined
  )

  useEffect(() => {
    if (
      openseaFees &&
      openseaFees.fee &&
      openseaFees.fee.bps &&
      listing.orderbook == 'opensea'
    ) {
      // Remove listing and emit toast if listing not enabled
      if (!openseaFees.listingEnabled) {
        addToast?.({
          title: 'Listing not enabled',
          description: `Cannnot list ${listing.token.token?.name} on OpenSea`,
        })
        removeListing(
          `${listing.token.token?.contract}:${listing.token.token?.tokenId}`,
          listing.orderbook as string
        )
      }

      setMarketplaceFeePercent(openseaFees.fee.bps / 100 || 0)
      handleMarketplaceFeeChange(
        (openseaFees.fee.bps / 10000) * Number(price) * listing.quantity || 0
      )
    }
  }, [openseaFees, price, quantity, marketplace])

  const creatorRoyalties =
    (onChainRoyaltiesBps ||
      listing?.token?.token?.collection?.royaltiesBps ||
      0) / 10000

  const profit =
    Number(price) * listing.quantity -
    marketplaceFee -
    creatorRoyalties * Number(price) * listing.quantity

  const topTraitPrice = useMemo(() => {
    if (!listing.token.token?.attributes) return undefined

    // Find the highest floor price
    return Math.max(
      ...listing.token.token.attributes.map(
        (attribute) => attribute.floorAskPrice ?? 0
      )
    )
  }, [])

  useEffect(() => {
    handlePriceChange(globalPrice)
  }, [globalPrice])

  useEffect(() => {
    if (listing.price != price && Number(listing.price) != 0) {
      handlePriceChange(listing.price)
    }
  }, [listing.price])

  useEffect(() => {
    handleExpirationChange(globalExpirationOption.value)
  }, [globalExpirationOption])

  const handleExpirationChange = useCallback(
    (value: string) => {
      const option = expirationOptions.find((option) => option.value === value)
      if (option) {
        setExpirationOption(option)
        const updatedListing = { ...listing, expirationOption: option }
        updateListing(updatedListing)
      }
    },
    [listing, updateListing]
  )

  const handlePriceChange = useCallback(
    (value: string) => {
      setPrice(value)
      const updatedListing = { ...listing, price: value }
      updateListing(updatedListing)
    },
    [listing, updateListing]
  )

  const handleQuantityChange = useCallback(
    (quantity: number) => {
      setQuantity(quantity)
      const updatedListing = { ...listing, quantity: quantity }
      updateListing(updatedListing)
    },
    [listing, updateListing]
  )
  return (
    <TableRow
      css={{
        gridTemplateColumns: gridTemplateColumns,
        alignItems: 'stretch',
        py: '$2',
        '&:last-child': {
          borderBottom: 'none',
        },
      }}
    >
      <TableCell css={{ overflow: 'hidden', minWidth: 0 }}>
        <Flex align="center" css={{ gap: '$3' }}>
          <img
            src={tokenImage}
            style={{
              width: 48,
              height: 48,
              borderRadius: 4,
              aspectRatio: '1/1',
            }}
          />
          <Flex direction="column" css={{ minWidth: 0 }}>
            <Text style="subtitle3" color="subtle" ellipsify>
              {listing?.token?.token?.collection?.name}
            </Text>
            <Text ellipsify>#{listing?.token?.token?.tokenId}</Text>
          </Flex>
        </Flex>
      </TableCell>
      {displayQuantity ? (
        <TableCell css={{ minWith: 0, overflow: 'hidden' }}>
          <Flex
            direction="column"
            align="start"
            css={{ gap: '$2', minWidth: 0, overflow: 'hidden' }}
          >
            <Input
              type="number"
              value={quantity}
              onChange={(e) => {
                const inputValue = Number(e.target.value)
                const max = Number(listing.token.ownership?.tokenCount)

                if (e.target.value === '') {
                  setQuantity(undefined)
                } else if (inputValue > max) {
                  handleQuantityChange(max)
                } else {
                  handleQuantityChange(inputValue)
                }
              }}
              onBlur={() => {
                if (quantity === undefined || quantity <= 0) {
                  handleQuantityChange(1)
                }
              }}
              css={{ maxWidth: 45 }}
              disabled={
                listing.token.token?.kind !== 'erc1155' ||
                Number(listing?.token?.ownership?.tokenCount) <= 1
              }
            />
            <Text
              style="subtitle3"
              color="subtle"
              ellipsify
              css={{ width: '100%' }}
            >
              {listing.token.ownership?.tokenCount} available
            </Text>
          </Flex>
        </TableCell>
      ) : null}
      <TableCell>
        <Flex align="start" css={{ gap: '$3' }}>
          {isLargeDevice ? (
            <>
              <Flex direction="column" align="center" css={{ gap: '$2' }}>
                <Button
                  color="gray3"
                  corners="pill"
                  size="large"
                  css={{ minWidth: 'max-content', minHeight: 48, py: 14 }}
                  disabled={
                    !listing.token?.token?.collection?.floorAskPrice?.amount
                      ?.native
                  }
                  onClick={() => {
                    if (
                      listing.token?.token?.collection?.floorAskPrice?.amount
                        ?.native
                    ) {
                      handlePriceChange(
                        listing.token?.token?.collection?.floorAskPrice?.amount?.native?.toString()
                      )
                    }
                  }}
                >
                  Floor
                </Button>
                {listing.token?.token?.collection?.floorAskPrice?.amount
                  ?.native ? (
                  <Text style="subtitle3" color="subtle">
                    {`${listing.token?.token?.collection?.floorAskPrice?.amount?.native} ${defaultCurrency.symbol}`}
                  </Text>
                ) : null}
              </Flex>
              <Flex direction="column" align="center" css={{ gap: '$2' }}>
                <Button
                  color="gray3"
                  corners="pill"
                  size="large"
                  css={{ minWidth: 'max-content', minHeight: 48, py: 14 }}
                  onClick={() =>
                    handlePriceChange((topTraitPrice as number).toString())
                  }
                  disabled={!topTraitPrice || topTraitPrice <= 0}
                >
                  Top Trait
                </Button>
                {topTraitPrice && topTraitPrice > 0 ? (
                  <Text style="subtitle3" color="subtle">
                    {topTraitPrice} {defaultCurrency.symbol}
                  </Text>
                ) : null}
              </Flex>
            </>
          ) : null}

          <Flex align="start" css={{ gap: '$3' }}>
            <Flex align="center" css={{ mt: 12 }}>
              <CryptoCurrencyIcon
                address={currency.contract}
                css={{ height: 18 }}
              />
              <Text style="subtitle1" color="subtle" css={{ ml: '$1' }}>
                {currency.symbol}
              </Text>
            </Flex>
            <Flex direction="column" align="center" css={{ gap: '$2' }}>
              <Input
                placeholder="Price"
                type="number"
                value={price}
                onChange={(e) => {
                  handlePriceChange(e.target.value)
                }}
                css={{ width: 100, '@bp1500': { width: 150 } }}
              />
              {price !== undefined &&
                price !== '' &&
                Number(price) !== 0 &&
                Number(price) < MINIMUM_AMOUNT && (
                  <Text style="subtitle3" color="error">
                    Must exceed {MINIMUM_AMOUNT}
                  </Text>
                )}
            </Flex>
          </Flex>
        </Flex>
      </TableCell>
      <TableCell>
        <Select
          css={{
            flex: 1,
            width: '100%',
            whiteSpace: 'nowrap',
          }}
          value={expirationOption?.text || ''}
          onValueChange={handleExpirationChange}
        >
          {expirationOptions.map((option) => (
            <Select.Item key={option.text} value={option.value}>
              <Select.ItemText css={{ whiteSpace: 'nowrap' }}>
                {option.text}
              </Select.ItemText>
            </Select.Item>
          ))}
        </Select>
      </TableCell>
      <TableCell css={{ minWidth: 0, overflow: 'hidden' }}>
        <Flex
          align="center"
          css={{
            gap: '$2',
            minWidth: 0,
            width: '100%',
            boxSizing: 'border-box',
            mt: '$3',
          }}
        >
          <FormatCryptoCurrency
            amount={creatorRoyalties * Number(price)}
            logoHeight={14}
            textStyle="body1"
            css={{
              width: '100%',
            }}
          />
          <Text style="body1" color="subtle" ellipsify>
            ({creatorRoyalties * 100}%)
          </Text>
        </Flex>
      </TableCell>
      <TableCell css={{ minWidth: 0, overflow: 'hidden' }}>
        <Flex align="center" css={{ gap: '$2', mt: '$3' }}>
          <FormatCryptoCurrency
            amount={marketplaceFee}
            logoHeight={14}
            textStyle="body1"
          />
          <Text style="body1" color="subtle" ellipsify>
            ({marketplaceFeePercent || 0}%)
          </Text>
        </Flex>
      </TableCell>
      <TableCell css={{ minWidth: 0, overflow: 'hidden' }}>
        <Flex css={{ mt: '$3' }}>
          <FormatCryptoCurrency
            amount={profit}
            logoHeight={14}
            textStyle="body1"
          />
        </Flex>
      </TableCell>
      <TableCell css={{ marginLeft: 'auto' }}>
        <Button
          color="gray3"
          size="small"
          css={{ justifyContent: 'center', width: '44px', height: '44px' }}
          onClick={() =>
            removeListing(
              `${listing.token.token?.contract}:${listing.token.token?.tokenId}`,
              listing.orderbook as string
            )
          }
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </TableCell>
    </TableRow>
  )
}
