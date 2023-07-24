import { FC, useContext, useEffect, useRef, useMemo } from 'react'
import { useMediaQuery } from 'react-responsive'
import {
  Text,
  Flex,
  TableCell,
  TableRow,
  HeaderRow,
  FormatCryptoCurrency,
  Anchor,
  Button,
  Box,
  Tooltip,
} from '../primitives'
import { useIntersectionObserver } from 'usehooks-ts'
import LoadingSpinner from '../common/LoadingSpinner'
import { useListings } from '@reservoir0x/reservoir-kit-ui'
import Link from 'next/link'
import { MutatorCallback } from 'swr'
import { useMarketplaceChain, useTimeSince } from 'hooks'
import CancelListing from 'components/buttons/CancelListing'
import { Address } from 'wagmi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGasPump, faTag } from '@fortawesome/free-solid-svg-icons'
import { NAVBAR_HEIGHT } from 'components/navbar'
import { ChainContext } from 'context/ChainContextProvider'
import Img from 'components/primitives/Img'
import { BuyNow } from 'components/buttons'
import optimizeImage from 'utils/optimizeImage'
import { formatNumber } from 'utils/numbers'

type Props = {
  address: Address | undefined
  isOwner: boolean
}

const desktopTemplateColumns = '1.25fr .75fr repeat(4, 1fr)'

export const ListingsTable: FC<Props> = ({ address, isOwner }) => {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})

  let listingsQuery: Parameters<typeof useListings>['0'] = {
    maker: address,
    includeCriteriaMetadata: true,
    includeRawData: true,
  }
  const { chain } = useContext(ChainContext)

  if (chain.community) listingsQuery.community = chain.community

  const {
    data: listings,
    mutate,
    fetchNextPage,
    isFetchingPage,
    isValidating,
  } = useListings(listingsQuery)

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
        <Flex direction="column" css={{ width: '100%', pb: '$2' }}>
          <TableHeading />
          {listings.map((listing, i) => {
            return (
              <ListingTableRow
                key={`${listing?.id}-${i}`}
                listing={listing}
                isOwner={isOwner}
                mutate={mutate}
              />
            )
          })}
          <Box ref={loadMoreRef} css={{ height: 20 }}></Box>
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
  isOwner: boolean
  mutate?: MutatorCallback
}

const ListingTableRow: FC<ListingTableRowProps> = ({
  listing,
  isOwner,
  mutate,
}) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })
  const { routePrefix } = useMarketplaceChain()
  const expiration = useTimeSince(listing?.expiration)

  const isOracleOrder = listing?.isNativeOffChainCancellable

  let criteriaData = listing?.criteria?.data

  const imageSrc = useMemo(() => {
    return optimizeImage(
      criteriaData?.token?.tokenId
        ? criteriaData?.token?.image || criteriaData?.collection?.image
        : criteriaData?.collection?.image,
      250
    )
  }, [
    criteriaData?.token?.tokenId,
    criteriaData?.token?.image,
    criteriaData?.collection?.image,
  ])

  if (isSmallDevice) {
    return (
      <Flex
        key={listing?.id}
        direction="column"
        align="start"
        css={{
          gap: '$3',
          borderBottom: '1px solid $gray3',
          py: '$3',
          width: '100%',
          overflow: 'hidden',
          flex: 1,
        }}
      >
        <Flex justify="between" css={{ width: '100%' }}>
          <Link
            href={`/${routePrefix}/asset/${listing?.contract}:${criteriaData?.token?.tokenId}`}
          >
            <Flex align="center">
              <Img
                css={{
                  borderRadius: '4px',
                  objectFit: 'cover',
                  aspectRatio: '1/1',
                }}
                loader={({ src }) => src}
                src={imageSrc}
                alt={`${listing?.id}`}
                width={36}
                height={36}
              />
              <Flex
                direction="column"
                css={{
                  ml: '$2',
                  overflow: 'hidden',
                  minWidth: 0,
                }}
              >
                <Text style="subtitle3" ellipsify css={{ color: '$gray11' }}>
                  {criteriaData?.collection?.name}
                </Text>
                {listing?.quantityRemaining &&
                listing?.quantityRemaining > 1 ? (
                  <Flex css={{ gap: '$2' }} align="center">
                    <Text style="subtitle2" ellipsify>
                      #{criteriaData?.token?.tokenId}
                    </Text>
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
                        x{formatNumber(listing.quantityRemaining, 0, true)}
                      </Text>
                    </Flex>
                  </Flex>
                ) : null}
              </Flex>
            </Flex>
          </Link>
          <FormatCryptoCurrency
            amount={listing?.price?.amount?.decimal}
            address={listing?.price?.currency?.contract}
            textStyle="subtitle2"
            logoHeight={14}
          />
        </Flex>
        <Flex justify="between" align="center" css={{ width: '100%' }}>
          <a href={`https://${listing?.source?.domain}`} target="_blank">
            <Flex align="center" css={{ gap: '$2' }}>
              <img
                width="20px"
                height="20px"
                src={(listing?.source?.icon as string) || ''}
                alt={`${listing?.source?.name}`}
              />
              <Text style="subtitle2">{expiration}</Text>
            </Flex>
          </a>
          {isOwner ? (
            <CancelListing
              listingId={listing?.id as string}
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
                          minWidth: '150px',
                          justifyContent: 'center',
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
                        minWidth: '150px',
                        justifyContent: 'center',
                      }}
                      color="gray3"
                    >
                      Cancel
                    </Button>
                  )}
                </Flex>
              }
            />
          ) : (
            <BuyNow
              tokenId={listing?.criteria?.data?.token?.tokenId}
              collectionId={listing?.criteria?.data?.collection?.id}
              orderId={listing?.id}
              mutate={mutate}
              buttonCss={{
                minWidth: '150px',
                justifyContent: 'center',
              }}
              buttonChildren="Buy Now"
            />
          )}
        </Flex>
      </Flex>
    )
  }

  return (
    <TableRow
      key={listing?.id}
      css={{ gridTemplateColumns: desktopTemplateColumns }}
    >
      <TableCell css={{ minWidth: 0 }}>
        <Link
          href={`/${routePrefix}/asset/${listing?.contract}:${criteriaData?.token?.tokenId}`}
        >
          <Flex align="center">
            <Img
              css={{
                borderRadius: '4px',
                objectFit: 'cover',
                aspectRatio: '1/1',
              }}
              loader={({ src }) => src}
              src={imageSrc as string}
              alt={`${criteriaData?.token?.name}`}
              width={48}
              height={48}
            />
            <Flex
              direction="column"
              css={{
                ml: '$2',
                overflow: 'hidden',
              }}
            >
              <Text style="subtitle3" ellipsify css={{ color: '$gray11' }}>
                {criteriaData?.collection?.name}
              </Text>
              <Text style="subtitle2" ellipsify>
                #{criteriaData?.token?.tokenId}
              </Text>
            </Flex>
          </Flex>
        </Link>
      </TableCell>
      <TableCell>
        <FormatCryptoCurrency
          amount={listing?.price?.amount?.decimal}
          address={listing?.price?.currency?.contract}
          textStyle="subtitle2"
          logoHeight={14}
        />
      </TableCell>
      <TableCell>
        <Text style="subtitle2">{formatNumber(listing.quantityRemaining)}</Text>
      </TableCell>
      <TableCell>
        <Text style="subtitle2">{expiration}</Text>
      </TableCell>
      <TableCell>
        <Flex align="center" css={{ gap: '$2' }}>
          <img
            width="20px"
            height="20px"
            src={(listing?.source?.icon as string) || ''}
            alt={`${listing?.source?.name}`}
          />
          <Anchor
            href={`https://${listing?.source?.domain as string}`}
            target="_blank"
            color="primary"
            weight="normal"
          >
            {listing?.source?.name as string}
          </Anchor>
        </Flex>
      </TableCell>
      <TableCell>
        <Flex justify="end">
          {isOwner ? (
            <CancelListing
              listingId={listing?.id as string}
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
                          minWidth: '150px',
                          justifyContent: 'center',
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
                        minWidth: '150px',
                        justifyContent: 'center',
                      }}
                      color="gray3"
                    >
                      Cancel
                    </Button>
                  )}
                </Flex>
              }
            />
          ) : (
            <BuyNow
              tokenId={listing?.criteria?.data?.token?.tokenId}
              collectionId={listing?.criteria?.data?.collection?.id}
              orderId={listing?.id}
              mutate={mutate}
              buttonCss={{
                minWidth: '150px',
                justifyContent: 'center',
              }}
              buttonChildren="Buy Now"
            />
          )}
        </Flex>
      </TableCell>
    </TableRow>
  )
}

const headings = [
  'Items',
  'Listed Price',
  'Quantity',
  'Expiration',
  'Marketplace',
  '',
]

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
    {headings.map((heading) => (
      <TableCell key={heading}>
        <Text style="subtitle3" color="subtle">
          {heading}
        </Text>
      </TableCell>
    ))}
  </HeaderRow>
)
