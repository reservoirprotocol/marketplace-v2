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
} from 'components/primitives'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { Currency, Listings } from '@reservoir0x/reservoir-kit-ui'
import useMarketplaces from 'hooks/useMarketplaces'
import expirationOptions from 'utils/defaultExpirationOptions'
import { ExpirationOption } from 'types/ExpirationOption'
import { UserToken } from 'pages/portfolio'
import { NAVBAR_HEIGHT } from 'components/navbar'
import CryptoCurrencyIcon from 'components/primitives/CryptoCurrencyIcon'
import { useChainCurrency } from 'hooks'
import { currencies } from 'utils/currencies'

type Listing = Listings[0] & { item: UserToken['token'] }

type Props = {
  selectedItems: UserToken[]
  setSelectedItems: Dispatch<SetStateAction<UserToken[]>>
  setShowListingPage: Dispatch<SetStateAction<boolean>>
}

const desktopTemplateColumns = '1.15fr 1.8fr 1.15fr repeat(2, .7fr) .5fr'

const BatchListings: FC<Props> = ({
  selectedItems,
  setSelectedItems,
  setShowListingPage,
}) => {
  const [listings, setListings] = useState<Listing[]>([])
  // const [marketplaces, setMarketplaces] = useState([])

  const [globalPrice, setGlobalPrice] = useState(0)
  const [globalExpirationOption, setGlobalExpirationOption] =
    useState<ExpirationOption>(expirationOptions[5])

  const chainCurrency = useChainCurrency()
  const defaultCurrency = {
    contract: chainCurrency.address,
    symbol: chainCurrency.symbol,
  }
  const [currency, setCurrency] = useState<Currency>(
    currencies && currencies[0] ? currencies[0] : defaultCurrency
  )

  const [marketplaces] = useMarketplaces()

  // remove from specific marketplace
  const removeMarketplaceListings = (orderbook: string) => {
    let updatedListings = listings.filter(
      (listing) => listing.orderbook === orderbook
    )
    setListings(updatedListings)
  }

  const updateListing = (updatedListing: Listing) => {
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
  }

  // add specific marketplace

  // sync listing prices with global price
  useEffect(() => {}, [globalPrice])

  // Transform selected items into listings
  useEffect(() => {
    const listings = selectedItems.map((item) => {
      const listing: Listing = {
        token: `${item?.token?.contract}:${item?.token?.tokenId}`,
        weiPrice: '0',
        orderbook: 'reservoir',
        item: item.token,
      }
      return listing
    })

    setListings(listings)
  }, [selectedItems])

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
          <TableHeading />
          {listings.map((listing, i) => (
            <ListingsTableRow
              listing={listing}
              listings={listings}
              setListings={setListings}
              updateListing={updateListing}
              globalExpirationOption={globalExpirationOption}
              currency={currency}
              key={listing.token + i}
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
                amount={2}
                css={{ minWidth: 'max-content' }}
              />
              <Button
                onClick={() => {
                  console.log(listings)
                }}
              >
                List
              </Button>
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
  listing: Listing
  listings: Listing[]
  setListings: Dispatch<SetStateAction<Listing[]>>
  updateListing: (updatedListing: Listing) => void
  globalExpirationOption: ExpirationOption
  currency: Currency
}

const ListingsTableRow: FC<ListingsTableRowProps> = ({
  listing,
  listings,
  setListings,
  updateListing,
  globalExpirationOption,
  currency,
}) => {
  const [expirationOption, setExpirationOption] = useState<ExpirationOption>(
    globalExpirationOption
  )

  useEffect(() => {
    handleExpirationChange(globalExpirationOption.value)
  }, [globalExpirationOption])

  const removeListing = (token: string, orderbook: string) => {
    let updatedListings = listings.filter(
      (listing) => listing.token != token && listing.orderbook == orderbook
    )
    setListings(updatedListings)
  }

  const handleExpirationChange = (value: string) => {
    const option = expirationOptions.find((option) => option.value == value)
    if (option) {
      setExpirationOption(option)
      const updatedListing = { ...listing, expirationOption: option }
      updateListing(updatedListing)
    }
  }

  return (
    <TableRow
      css={{
        gridTemplateColumns: desktopTemplateColumns,
        alignItems: 'stretch',
        py: '$2',
        '&:last-child': {
          borderBottom: 'none',
        },
      }}
    >
      <TableCell>
        <Flex css={{ gap: '$3' }}>
          <img
            src={listing.item?.image}
            style={{
              width: 48,
              height: 48,
              borderRadius: 4,
              aspectRatio: '1/1',
            }}
          />
          <Flex direction="column" css={{}}>
            <Text style="subtitle3" color="subtle">
              {listing.item?.collection?.name}
            </Text>
            <Text>#{listing?.item?.tokenId}</Text>
          </Flex>
        </Flex>
      </TableCell>
      <TableCell>
        <Flex align="start" css={{ gap: 24 }}>
          <Flex direction="column" align="center" css={{ gap: '$2' }}>
            <Button
              color="gray3"
              corners="pill"
              size="large"
              css={{ minWidth: 'max-content' }}
            >
              Floor
            </Button>
            <Text style="subtitle3" color="subtle">
              0.002 ETH
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
          <Flex align="center" css={{ mt: 14 }}>
            <CryptoCurrencyIcon
              address={currency.contract}
              css={{ height: 18 }}
            />
            <Text style="subtitle1" color="subtle" css={{ ml: '$1' }}>
              {currency.symbol}
            </Text>
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
      <TableCell></TableCell>
      <TableCell css={{ marginLeft: 'auto' }}>
        <Button
          color="gray3"
          size="small"
          css={{ justifyContent: 'center', width: '44px', height: '44px' }}
          onClick={() =>
            removeListing(listing.token, listing.orderbook as string)
          }
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </TableCell>
    </TableRow>
  )
}

const TableHeading = () => (
  <HeaderRow
    css={{
      display: 'none',
      '@md': { display: 'grid' },
      gridTemplateColumns: desktopTemplateColumns,
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
