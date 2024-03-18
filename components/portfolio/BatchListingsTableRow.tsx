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
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Currency } from '@reservoir0x/reservoir-kit-ui'
import expirationOptions from 'utils/defaultExpirationOptions'
import { ExpirationOption } from 'types/ExpirationOption'
import { UserToken } from 'pages/portfolio/[[...address]]'
import CryptoCurrencyIcon from 'components/primitives/CryptoCurrencyIcon'
import { BatchListing } from './BatchListings'
import optimizeImage from 'utils/optimizeImage'
import { formatUnits } from 'viem'
import { formatNumber } from 'utils/numbers'

type BatchListingsTableRowProps = {
  listing: BatchListing
  listings: BatchListing[]
  displayQuantity: boolean
  gridTemplateColumns: string
  globalExpirationOption: ExpirationOption
  globalPrice: string
  isLargeDevice: boolean
  selectedItems: UserToken[]
  currencies: Currency[]
  setSelectedItems: Dispatch<SetStateAction<UserToken[]>>
  setListings: Dispatch<SetStateAction<BatchListing[] | null>>
  updateListing: (updatedListing: BatchListing) => void
}

const MINIMUM_AMOUNT = 0.000001
const MAXIMUM_AMOUNT = Infinity

export const BatchListingsTableRow: FC<BatchListingsTableRowProps> = ({
  listing,
  listings,
  selectedItems,
  displayQuantity,
  gridTemplateColumns,
  isLargeDevice,
  globalExpirationOption,
  globalPrice,
  currencies,
  setListings,
  updateListing,
  setSelectedItems,
}) => {
  const [expirationOption, setExpirationOption] = useState<ExpirationOption>(
    globalExpirationOption
  )

  const [price, setPrice] = useState<string>(listing.price)

  const [quantity, setQuantity] = useState<number | undefined>(1)

  const tokenImage = useMemo(() => {
    return optimizeImage(listing.token.token?.image, 250)
  }, [listing.token.token?.image])

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

  const creatorRoyalties =
    (listing?.token?.token?.collection?.royaltiesBps ||
      listing.marketplace.royalties?.maxBps ||
      0) / 10000

  const marketplaceFee = (listing.marketplace?.fee?.bps || 0) / 10000

  const profit =
    Number(price) * listing.quantity -
    marketplaceFee * Number(price) * listing.quantity -
    creatorRoyalties * Number(price) * listing.quantity

  const topTraitPrice = useMemo(() => {
    if (!listing.token.token?.attributes) return undefined

    // Find the highest floor price
    return Math.max(
      ...listing.token.token.attributes.map(
        (attribute) => attribute.floorAskPrice?.amount?.decimal ?? 0
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

  const handleCurrencyChange = useCallback(
    (currency: Currency) => {
      const updatedListing = { ...listing, currency }
      updateListing(updatedListing)
    },
    [listing, updateListing]
  )

  const restrictCurrency =
    listing.exchange?.paymentTokens && listing.exchange.paymentTokens.length > 0

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
    price &&
    Number(price) !== 0 &&
    Number(price) <= maximumAmount &&
    Number(price) >= minimumAmount

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
                    !listing.token?.token?.collection?.floorAsk?.price?.amount
                      ?.decimal
                  }
                  onClick={() => {
                    if (
                      listing.token?.token?.collection?.floorAsk?.price?.amount
                        ?.decimal
                    ) {
                      handlePriceChange(
                        listing.token?.token?.collection?.floorAsk?.price?.amount?.decimal?.toString()
                      )
                    }
                  }}
                >
                  Floor
                </Button>
                {listing.token?.token?.collection?.floorAsk?.price?.amount
                  ?.decimal ? (
                  <Text style="subtitle3" color="subtle">
                    {`${listing.token?.token?.collection?.floorAsk?.price?.amount?.decimal} ${listing.token?.token?.collection?.floorAsk?.price?.currency?.symbol}`}
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
                    {topTraitPrice}{' '}
                    {
                      listing.token?.token?.collection?.floorAsk?.price
                        ?.currency?.symbol
                    }
                  </Text>
                ) : null}
              </Flex>
            </>
          ) : null}

          <Flex align="start" css={{ gap: '$3' }}>
            {restrictCurrency ? (
              <Flex align="center" css={{ width: 130, px: '$4', py: '$3' }}>
                <CryptoCurrencyIcon
                  address={listing.currency.contract}
                  css={{ height: 18 }}
                />
                <Text style="subtitle1" color="subtle" css={{ ml: '$1' }}>
                  {listing.currency.symbol}
                </Text>
              </Flex>
            ) : (
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
                          address={listing.currency.contract}
                          css={{ height: 18 }}
                        />
                        <Text
                          style="subtitle1"
                          color="subtle"
                          css={{ ml: '$1' }}
                        >
                          {listing.currency.symbol}
                        </Text>
                        {currencies && currencies?.length > 1 ? (
                          <Select.DownIcon style={{ marginLeft: 6 }} />
                        ) : null}
                      </Flex>
                    </Select.Value>
                  </Select.Trigger>
                }
                value={listing.currency.contract}
                onValueChange={(value: string) => {
                  const option = currencies?.find(
                    (option) => option.contract == value
                  )
                  if (option) {
                    handleCurrencyChange(option)
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
            )}
            <Flex
              direction="column"
              css={{ gap: '$2', width: 100, '@bp1500': { width: 150 } }}
            >
              <Input
                placeholder="Price"
                type="number"
                value={price}
                onChange={(e) => {
                  handlePriceChange(e.target.value)
                }}
              />
              {price !== undefined &&
                price !== '' &&
                Number(price) !== 0 &&
                !withinPricingBounds && (
                  <Text style="subtitle3" color="error">
                    {maximumAmount !== Infinity
                      ? `Amount must be between ${formatNumber(
                          minimumAmount
                        )} - ${formatNumber(maximumAmount)}`
                      : `Amount must be higher than ${formatNumber(
                          minimumAmount
                        )}`}
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
            address={listing.currency.contract}
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
            address={listing.currency.contract}
            logoHeight={14}
            textStyle="body1"
          />
          <Text style="body1" color="subtle" ellipsify>
            ({(marketplaceFee || 0) * 100}%)
          </Text>
        </Flex>
      </TableCell>
      <TableCell css={{ minWidth: 0, overflow: 'hidden' }}>
        <Flex css={{ mt: '$3' }}>
          <FormatCryptoCurrency
            address={listing.currency.contract}
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
