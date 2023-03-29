import {
  faChevronLeft,
  faMagnifyingGlass,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Flex,
  Text,
  Button,
  Select,
  HeaderRow,
  TableCell,
  TableRow,
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
  useState,
} from 'react'
import { Currency, Listings, ListModal } from '@reservoir0x/reservoir-kit-ui'
import useMarketplaces, { Marketplace } from 'hooks/useMarketplaces'
import expirationOptions from 'utils/defaultExpirationOptions'
import { ExpirationOption } from 'types/ExpirationOption'
import { UserToken } from 'pages/portfolio'
import { NAVBAR_HEIGHT } from 'components/navbar'
import CryptoCurrencyIcon from 'components/primitives/CryptoCurrencyIcon'
import { useChainCurrency } from 'hooks'
import BatchList from 'components/buttons/BatchList'

export type BatchListing = {
  token: UserToken
  price: string
  quantity: number
  expirationOption: ExpirationOption
  orderbook: Listings[0]['orderbook']
  orderKind: Listings[0]['orderKind']
}

type ListingCurrencies = ComponentPropsWithoutRef<
  typeof ListModal
>['currencies']

type Props = {
  selectedItems: UserToken[]
  setSelectedItems: Dispatch<SetStateAction<UserToken[]>>
  setShowListingPage: Dispatch<SetStateAction<boolean>>
}

const BatchListings: FC<Props> = ({
  selectedItems,
  setSelectedItems,
  setShowListingPage,
}) => {
  const [listings, setListings] = useState<BatchListing[]>([])
  const [allMarketplaces] = useMarketplaces()
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([])
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<
    Marketplace[]
  >([])

  const [globalPrice, setGlobalPrice] = useState<string>('')
  const [globalExpirationOption, setGlobalExpirationOption] =
    useState<ExpirationOption>(expirationOptions[5])

  const [totalProfit, setTotalProfit] = useState<number>(0)

  const [isListButtonDisabled, setIsListButtonDisabled] =
    useState<boolean>(true)

  const chainCurrency = useChainCurrency()
  const defaultCurrency = {
    contract: chainCurrency.address,
    symbol: chainCurrency.symbol,
  }
  // CONFIGURABLE: Here you can configure which currencies you would like to support for batch listing
  const currencies: ListingCurrencies = [
    { ...defaultCurrency },
    {
      contract: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
      decimals: 18,
      coinGeckoId: 'weth',
      symbol: 'WETH',
    },
  ]

  const [currency, setCurrency] = useState<Currency>(
    currencies && currencies[0] ? currencies[0] : defaultCurrency
  )

  const displayQuantity = useCallback(() => {
    return listings.some((listing) => listing?.token?.token?.kind === 'erc1155')
  }, [listings])

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

  const updateSelectedItems = useCallback(
    (updatedListings: BatchListing[], removingListing: boolean = false) => {
      const updatedSelectedItems = selectedItems.filter((item) => {
        const tokenString = `${item?.token?.contract}:${item?.token?.tokenId}`
        return updatedListings.some((listing) => {
          let listingTokenString = `${listing.token.token?.contract}:${listing.token.token?.tokenId}`
          return listingTokenString === tokenString
        })
      })

      setSelectedItems(updatedSelectedItems)

      if (!removingListing) {
        const updatedSelectedTokens = updatedSelectedItems.map(
          (item) => `${item?.token?.contract}:${item?.token?.tokenId}`
        )

        const listings = updatedSelectedTokens.flatMap((tokenString) => {
          const item = selectedItems.find(
            (item) =>
              `${item?.token?.contract}:${item?.token?.tokenId}` === tokenString
          )
          return selectedMarketplaces.map((marketplace) => {
            const listing: BatchListing = {
              token: { ...item },
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

        setListings(listings)
      }
    },
    [selectedItems, selectedMarketplaces, globalPrice, globalExpirationOption]
  )

  useEffect(() => {
    let filteredMarketplaces = allMarketplaces.filter(
      (marketplace) =>
        marketplace.orderbook === 'reservoir' ||
        marketplace.orderbook === 'opensea'
    )
    setMarketplaces(filteredMarketplaces)

    // Initialize selectedMarketplaces
    const reservoirMarketplace = allMarketplaces.find(
      (marketplace) => marketplace.orderbook === 'reservoir'
    )
    if (reservoirMarketplace) {
      setSelectedMarketplaces([reservoirMarketplace])
    }
  }, [allMarketplaces])

  useEffect(() => {
    const totalProfit = listings.reduce((total, listing) => {
      const marketplace = selectedMarketplaces.find(
        (m) => m.orderbook === listing.orderbook
      )

      const marketplaceFee = marketplace?.feeBps
        ? (marketplace?.feeBps / 10000) * Number(listing.price)
        : 0

      const profit =
        Number(listing.price) * listing.quantity - (marketplaceFee || 0)
      return total + profit
    }, 0)

    setTotalProfit(totalProfit)
  }, [listings, selectedMarketplaces])

  useEffect(() => {
    const hasInvalidPrice = listings.some(
      (listing) => listing.price === undefined || Number(listing.price) <= 0
    )
    setIsListButtonDisabled(hasInvalidPrice)
  }, [listings])

  const removeMarketplaceListings = useCallback(
    (orderbook: string) => {
      let updatedListings = listings.filter(
        (listing) => listing.orderbook === orderbook
      )
      setListings(updatedListings)
    },
    [listings]
  )

  const addMarketplaceListings = useCallback(
    (orderbook: string, orderKind: string) => {
      setListings((prevListings) => {
        const updatedListings = [...prevListings]

        selectedItems.forEach((item) => {
          const existingListingIndex = updatedListings.findIndex(
            (listing) =>
              listing.token === item && listing.orderbook === orderbook
          )

          if (existingListingIndex === -1) {
            const newListing: BatchListing = {
              token: item,
              quantity: 1,
              price: globalPrice || '0',
              expirationOption: globalExpirationOption,
              //@ts-ignore
              orderbook: orderbook,
              //@ts-ignore
              orderKind: orderKind,
            }
            updatedListings.push(newListing)
          }
        })

        return updatedListings
      })
    },
    [selectedItems, globalPrice, globalExpirationOption]
  )

  const handleMarketplaceSelection = useCallback(
    (marketplace: Marketplace) => {
      const isSelected = selectedMarketplaces.some(
        (selected) => selected.orderbook === marketplace.orderbook
      )

      if (isSelected) {
        setSelectedMarketplaces((prevSelected) =>
          prevSelected.filter(
            (selected) => selected.orderbook !== marketplace.orderbook
          )
        )
        removeMarketplaceListings(marketplace.orderbook as string)
      } else {
        setSelectedMarketplaces((prevSelected) => [
          ...prevSelected,
          marketplace,
        ])
        addMarketplaceListings(
          marketplace.orderbook as string,
          marketplace.orderKind as string
        )
      }
    },
    [selectedMarketplaces, addMarketplaceListings, removeMarketplaceListings]
  )

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
          <Text style="h6">Select Marketplaces</Text>
          <Flex align="center" css={{ gap: '$3' }}>
            {marketplaces.map((marketplace) => {
              const isSelected = selectedMarketplaces.some(
                (selected) => selected.orderbook === marketplace.orderbook
              )

              return (
                <Flex
                  key={marketplace.name}
                  align="center"
                  css={{
                    border: isSelected
                      ? '1px solid $primary7'
                      : '1px solid $gray6',
                    borderRadius: 8,
                    gap: '$3',
                    p: '$3',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleMarketplaceSelection(marketplace)}
                >
                  <img
                    src={marketplace.imageUrl}
                    alt={marketplace.name}
                    style={{ width: 32, height: 32 }}
                  />
                  <Text style="subtitle2">{marketplace.name}</Text>
                </Flex>
              )
            })}
          </Flex>
        </Flex>
        <Flex direction="column" css={{ gap: '$3' }}>
          <Text style="h6">Apply to All</Text>
          <Flex align="center" css={{ gap: '$5' }}>
            <Flex align="center" css={{ gap: '$3' }}>
              <Button
                color="gray3"
                corners="pill"
                size="large"
                css={{ minWidth: 'max-content' }}
              >
                Floor
              </Button>
              <Button
                color="gray3"
                corners="pill"
                size="large"
                css={{ minWidth: 'max-content' }}
              >
                Top Trait
              </Button>
            </Flex>
            <Flex align="center" css={{ gap: '$3' }}>
              <Select
                trigger={
                  <Select.Trigger
                    css={{
                      width: 115,
                    }}
                  >
                    <Select.Value asChild>
                      <Flex align="center">
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
                placeholder="Enter a custom price"
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
          <TableHeading displayQuantity={displayQuantity()} />
          {listings.map((listing, i) => (
            <ListingsTableRow
              listing={listing}
              listings={listings}
              setListings={setListings}
              updateListing={updateListing}
              updateSelectedItems={updateSelectedItems}
              setSelectedItems={setSelectedItems}
              selectedItems={selectedItems}
              displayQuantity={displayQuantity()}
              globalExpirationOption={globalExpirationOption}
              globalPrice={globalPrice}
              currency={currency}
              selectedMarketplaces={selectedMarketplaces}
              key={
                `${listing.token.token?.collection?.id}:${listing.token.token?.tokenId}` +
                i
              }
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
              <Text style="body1">Total Profit</Text>
              <FormatCryptoCurrency
                amount={totalProfit}
                logoHeight={18}
                textStyle={'h6'}
                css={{ width: 'max-content' }}
                maximumFractionDigits={2}
              />
              <BatchList
                listings={listings}
                disabled={isListButtonDisabled}
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

type ListingsTableRowProps = {
  listing: BatchListing
  listings: BatchListing[]
  displayQuantity: boolean
  setListings: Dispatch<SetStateAction<BatchListing[]>>
  updateListing: (updatedListing: BatchListing) => void
  globalExpirationOption: ExpirationOption
  globalPrice: string
  currency: Currency
  selectedItems: UserToken[]
  setSelectedItems: Dispatch<SetStateAction<UserToken[]>>
  selectedMarketplaces: Marketplace[]
  updateSelectedItems: (
    updatedListings: BatchListing[],
    removingListing?: boolean
  ) => void
}

const ListingsTableRow: FC<ListingsTableRowProps> = ({
  listing,
  listings,
  setListings,
  updateListing,
  selectedItems,
  displayQuantity,
  setSelectedItems,
  globalExpirationOption,
  globalPrice,
  currency,
  selectedMarketplaces,
}) => {
  const [expirationOption, setExpirationOption] = useState<ExpirationOption>(
    globalExpirationOption
  )

  const [price, setPrice] = useState<string>(listing.price)

  const [quantity, setQuantity] = useState<number | undefined>(1)

  const marketplace = selectedMarketplaces.find(
    (m) => m.orderbook === listing.orderbook
  )

  const marketplaceFee = marketplace?.feeBps
    ? (marketplace?.feeBps / 10000) * Number(price)
    : 0

  const profit = Number(price) * listing.quantity - marketplaceFee

  useEffect(() => {
    handlePriceChange(globalPrice)
  }, [globalPrice])

  useEffect(() => {
    handleExpirationChange(globalExpirationOption.value)
  }, [globalExpirationOption])

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
        gridTemplateColumns: displayQuantity
          ? '1.1fr .5fr 2.6fr .8fr repeat(2, .7fr) .5fr .3fr'
          : '1.1fr 2.5fr 1.2fr repeat(2, .7fr) .5fr .3fr',
        alignItems: 'stretch',
        py: '$2',
        '&:last-child': {
          borderBottom: 'none',
        },
      }}
    >
      <TableCell>
        <Flex align="center" css={{ gap: '$3' }}>
          <img
            src={marketplace?.imageUrl}
            alt={marketplace?.name}
            style={{
              width: 32,
              height: 32,
              borderRadius: 4,
              aspectRatio: '1/1',
              visibility: marketplace?.imageUrl ? 'visible' : 'hidden',
            }}
          />
          <img
            src={listing.token.token?.image}
            style={{
              width: 48,
              height: 48,
              borderRadius: 4,
              aspectRatio: '1/1',
            }}
          />
          <Flex direction="column" css={{}}>
            <Text style="subtitle3" color="subtle">
              {listing?.token?.token?.collection?.name}
            </Text>
            <Text>#{listing?.token?.token?.tokenId}</Text>
          </Flex>
        </Flex>
      </TableCell>
      {displayQuantity ? (
        <TableCell>
          <Flex direction="column" align="center" css={{ gap: '$2' }}>
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
              disabled={listing.token.token?.kind !== 'erc1155'}
            />
            <Text style="subtitle3" color="subtle">
              {listing.token.ownership?.tokenCount} available
            </Text>
          </Flex>
        </TableCell>
      ) : null}
      <TableCell>
        <Flex align="start" css={{ gap: '$3' }}>
          <Flex direction="column" align="center" css={{ gap: '$2' }}>
            <Button
              color="gray3"
              corners="pill"
              size="large"
              css={{ minWidth: 'max-content' }}
              disabled={!listing.token?.token?.collection?.floorAskPrice}
              onClick={() => {
                if (listing.token?.token?.collection?.floorAskPrice) {
                  handlePriceChange(
                    listing.token?.token?.collection?.floorAskPrice?.toString()
                  )
                }
              }}
            >
              Floor
            </Button>
            <Text style="subtitle3" color="subtle">
              {listing.token?.token?.collection?.floorAskPrice}
            </Text>
          </Flex>
          <Flex direction="column" align="center" css={{ gap: '$2' }}>
            <Button
              color="gray3"
              corners="pill"
              size="large"
              css={{ minWidth: 'max-content' }}
            >
              Top Trait
            </Button>
            <Text style="subtitle3" color="subtle">
              0.002 ETH
            </Text>
          </Flex>
          <Flex css={{ gap: '$3' }}>
            <Flex align="center">
              <CryptoCurrencyIcon
                address={currency.contract}
                css={{ height: 18 }}
              />
              <Text style="subtitle1" color="subtle" css={{ ml: '$1' }}>
                {currency.symbol}
              </Text>
            </Flex>
            <Input
              placeholder="Price"
              type="number"
              value={price}
              onChange={(e) => {
                handlePriceChange(e.target.value)
              }}
            />
          </Flex>
        </Flex>
      </TableCell>
      <TableCell>
        <Select
          css={{
            flex: 1,
            width: '100%',
          }}
          value={expirationOption?.text || ''}
          onValueChange={handleExpirationChange}
        >
          {expirationOptions.map((option) => (
            <Select.Item key={option.text} value={option.value}>
              <Select.ItemText>{option.text}</Select.ItemText>
            </Select.Item>
          ))}
        </Select>
      </TableCell>
      <TableCell></TableCell>
      <TableCell>
        <Flex align="center" css={{ gap: '$2' }}>
          <FormatCryptoCurrency
            amount={marketplaceFee}
            logoHeight={14}
            textStyle="body1"
            // TODO: add correct address
          />
          <Text style="body1" color="subtle">
            ({marketplace?.fee?.percent || 0})%
          </Text>
        </Flex>
      </TableCell>
      <TableCell>
        <FormatCryptoCurrency
          amount={profit}
          logoHeight={14}
          textStyle="body1"
          // TODO: add correct address
        />
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

type TableHeadingProps = {
  displayQuantity: boolean
}

const TableHeading: FC<TableHeadingProps> = ({ displayQuantity }) => (
  <HeaderRow
    css={{
      display: 'none',
      '@md': { display: 'grid' },
      gridTemplateColumns: displayQuantity
        ? '1.1fr .5fr 2.6fr .8fr repeat(2, .7fr) .5fr .3fr'
        : '1.1fr 2.5fr 1.2fr repeat(2, .7fr) .5fr .3fr',
      position: 'sticky',
      top: NAVBAR_HEIGHT,
      backgroundColor: '$neutralBg',
    }}
  >
    <TableCell>
      <Text style="subtitle3" color="subtle">
        Items
      </Text>
    </TableCell>
    {displayQuantity ? (
      <TableCell>
        <Text style="subtitle3" color="subtle">
          Quantity
        </Text>
      </TableCell>
    ) : null}
    <TableCell>
      <Text style="subtitle3" color="subtle">
        Price
      </Text>
    </TableCell>
    <TableCell>
      <Text style="subtitle3" color="subtle">
        Expiration
      </Text>
    </TableCell>
    <TableCell>
      <Text style="subtitle3" color="subtle">
        Creator Royalties
      </Text>
    </TableCell>
    <TableCell>
      <Text style="subtitle3" color="subtle">
        Marketplace Fee
      </Text>
    </TableCell>
    <TableCell>
      <Text style="subtitle3" color="subtle">
        Profit
      </Text>
    </TableCell>
    <TableCell css={{ marginLeft: 'auto' }}></TableCell>
  </HeaderRow>
)
