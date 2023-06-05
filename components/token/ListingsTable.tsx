import { faGasPump, faTag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useListings } from '@reservoir0x/reservoir-kit-ui'
import { BuyNow } from 'components/buttons'
import AddToCart from 'components/buttons/AddToCart'
import CancelListing from 'components/buttons/CancelListing'
import EditListing from 'components/buttons/EditListing'
import LoadingSpinner from 'components/common/LoadingSpinner'
import {
  Box,
  Button,
  Flex,
  FormatCryptoCurrency,
  TableRow,
  Text,
  Tooltip,
} from 'components/primitives'
import { ChainContext } from 'context/ChainContextProvider'
import { useENSResolver, useMarketplaceChain, useTimeSince } from 'hooks'
import Link from 'next/link'
import { FC, useContext, useEffect, useRef, useState } from 'react'
import { MutatorCallback } from 'swr'
import { useIntersectionObserver } from 'usehooks-ts'
import { formatDollar } from 'utils/numbers'
import { OnlyUserOrdersToggle } from './OnlyUserOrdersToggle'
import { zeroAddress } from 'viem'

type Props = {
  address?: string
  token: Parameters<typeof useListings>['0']['token']
  is1155: boolean
  isOwner: boolean
}

export const ListingsTable: FC<Props> = ({
  token,
  address,
  is1155,
  isOwner,
}) => {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})
  const [userOnly, setUserOnly] = useState(false)

  let listingsQuery: Parameters<typeof useListings>['0'] = {
    maker: userOnly ? address : undefined,
    token: token,
    includeCriteriaMetadata: true,
    includeRawData: true,
    sortBy: 'price',
  }

  const { chain } = useContext(ChainContext)

  if (chain.community) {
    listingsQuery.community = chain.community
  }

  const {
    data: listings,
    fetchNextPage,
    mutate,
    isValidating,
    isFetchingPage,
    isLoading,
  } = useListings(listingsQuery, { revalidateFirstPage: true })

  const { data: userListings } = useListings({
    ...listingsQuery,
    maker: address,
  })

  const userHasListings = userListings.length > 0

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      fetchNextPage()
    }
  }, [loadMoreObserver?.isIntersecting])

  return (
    <>
      {!isValidating && !isFetchingPage && listings && listings.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          css={{ py: '$6', gap: '$4', width: '100%' }}
        >
          <Text css={{ color: '$gray11' }}>
            <FontAwesomeIcon icon={faTag} size="2xl" />
          </Text>
          <Text css={{ color: '$gray11' }}>No listings yet</Text>
        </Flex>
      ) : (
        <Flex direction="column" css={{ gap: '$4' }}>
          {address && userHasListings && is1155 ? (
            <OnlyUserOrdersToggle
              checked={userOnly}
              onCheckedChange={(checked) => setUserOnly(checked)}
            />
          ) : null}
          <Flex
            direction="column"
            css={{
              height: '100%',
              maxHeight: isLoading ? '20px' : '450px',
              overflowY: 'auto',
              width: '100%',
              pb: '$2',
            }}
          >
            {listings.map((listing, i) => {
              return (
                <ListingTableRow
                  key={`${listing?.id}-${i}`}
                  listing={listing}
                  tokenString={token}
                  address={address}
                  is1155={is1155}
                  isOwner={isOwner}
                  mutate={mutate}
                />
              )
            })}
            <Box ref={loadMoreRef} css={{ height: 20 }}></Box>
          </Flex>
        </Flex>
      )}

      {isValidating && (
        <Flex align="center" justify="center" css={{ py: '$5' }}>
          <LoadingSpinner />
        </Flex>
      )}
    </>
  )
}

type ListingTableRowProps = {
  listing: ReturnType<typeof useListings>['data'][0]
  tokenString: Parameters<typeof useListings>['0']['token']
  is1155: boolean
  isOwner: boolean
  address?: string
  mutate?: MutatorCallback
}

const ListingTableRow: FC<ListingTableRowProps> = ({
  listing,
  tokenString,
  is1155,
  isOwner,
  address,
  mutate,
}) => {
  const { displayName: fromDisplayName } = useENSResolver(listing.maker)
  const { reservoirBaseUrl } = useMarketplaceChain()
  const expiration = useTimeSince(listing?.expiration)
  const expirationText = expiration ? `Expires ${expiration}` : null

  const isUserListing = address?.toLowerCase() === listing.maker.toLowerCase()

  const isOracleOrder = listing?.isNativeOffChainCancellable
  const contract = tokenString?.split(':')[0]
  const tokenId = tokenString?.split(':')[1]

  const listingSourceName = listing?.source?.name
  const listingSourceDomain = listing?.source?.domain
  const listingSourceLogo = `${reservoirBaseUrl}/redirect/sources/${
    listingSourceDomain || listingSourceName
  }/logo/v2`

  return (
    <TableRow
      css={{
        gridTemplateColumns: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        py: '$3',
      }}
    >
      <Flex
        direction="column"
        align="start"
        css={{ height: '100%', gap: '$2' }}
      >
        <Flex align="center" css={{ gap: '$1', height: 36 }}>
          <FormatCryptoCurrency
            amount={listing.price?.amount?.decimal}
            address={listing.price?.currency?.contract}
            logoHeight={16}
            textStyle="h6"
          />
          {listing.price?.amount?.usd ? (
            <Text style="body2" css={{ color: '$gray11' }} ellipsify>
              {formatDollar(listing.price?.amount?.usd)}
            </Text>
          ) : null}
          {listing?.quantityRemaining && listing?.quantityRemaining > 1 ? (
            <Flex
              justify="center"
              align="center"
              css={{
                borderRadius: 4,
                px: '$2',
                py: '$1',
                ml: '$1',
                backgroundColor: '$gray2',
              }}
            >
              <Text style="subtitle2" color="subtle">
                x{listing.quantityRemaining}
              </Text>
            </Flex>
          ) : null}
        </Flex>
        <Flex align="center" css={{ gap: '$1' }}>
          <Text style="body2" color="subtle" css={{ lineHeight: '14.5px' }}>
            from
          </Text>
          {listing.maker && listing.maker !== zeroAddress ? (
            <Link
              href={`/portfolio/${listing.maker}`}
              style={{ lineHeight: '14.5px' }}
            >
              <Text
                style="subtitle2"
                css={{
                  color: '$primary11',
                  '&:hover': {
                    color: '$primary10',
                  },
                }}
              >
                {fromDisplayName}
              </Text>
            </Link>
          ) : (
            <span>-</span>
          )}
          <img width={16} height={16} src={listingSourceLogo} />
        </Flex>
      </Flex>
      <Flex direction="column" align="end" css={{ gap: '$2' }}>
        <Flex align="center" css={{ gap: '$2' }}>
          {/* Not owner, erc 721 */}
          {!isOwner && !is1155 ? (
            <BuyNow
              tokenId={listing.criteria?.data?.token?.tokenId || tokenId}
              collectionId={listing.criteria?.data?.collection?.id || contract}
              orderId={listing.id}
              buttonChildren="Buy"
              buttonCss={{ fontSize: 14, px: '$4', py: '$2', minHeight: 36 }}
              mutate={mutate}
            />
          ) : null}
          {/* Not user's listing, erc 1155 */}
          {!isUserListing && is1155 ? (
            <AddToCart
              orderId={listing.id}
              buttonCss={{
                width: 42,
                height: 36,
                minHeight: 36,
                p: 0,
                justifyContent: 'center',
              }}
              buttonProps={{ corners: 'rounded' }}
            />
          ) : null}
          {/* Owner, erc 721 or erc 1155 */}
          {isOwner && isUserListing ? (
            <>
              {isOracleOrder ? (
                <EditListing
                  listingId={listing.id}
                  tokenId={listing.criteria?.data?.token?.tokenId || tokenId}
                  collectionId={
                    listing.criteria?.data?.collection?.id || contract
                  }
                  buttonChildren={<Text style="subtitle2">Edit</Text>}
                  buttonCss={{
                    fontSize: 14,
                    px: '$4',
                    py: '$2',
                    minHeight: 36,
                    minWidth: 80,
                    justifyContent: 'center',
                  }}
                  mutate={mutate}
                />
              ) : null}

              <CancelListing
                listingId={listing?.id}
                mutate={mutate}
                trigger={
                  <Flex>
                    {!isOracleOrder ? (
                      <Tooltip
                        content={
                          <Text style="body3" as="p">
                            Cancelling this order requires gas.
                          </Text>
                        }
                      >
                        <Button
                          css={{
                            color: '$red11',
                            justifyContent: 'center',
                            fontSize: 14,
                            fontWeight: 500,
                            px: '$4',
                            py: '$2',
                            minHeight: 36,
                          }}
                          color="gray3"
                        >
                          <FontAwesomeIcon
                            color="#697177"
                            icon={faGasPump}
                            width="16"
                            height="16"
                          />
                          Cancel
                        </Button>
                      </Tooltip>
                    ) : (
                      <Button
                        css={{
                          color: '$red11',
                          justifyContent: 'center',
                          fontSize: 14,
                          fontWeight: 500,
                          px: '$4',
                          py: '$2',
                          minHeight: 36,
                        }}
                        color="gray3"
                      >
                        Cancel
                      </Button>
                    )}
                  </Flex>
                }
              />
            </>
          ) : null}
        </Flex>
        <Text style="body2" color="subtle">
          {expirationText}
        </Text>
      </Flex>
    </TableRow>
  )
}
