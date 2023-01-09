import { FC, useEffect, useRef } from 'react'
import { useMediaQuery } from 'react-responsive'
import {
  Text,
  Flex,
  TableCell,
  TableRow,
  HeaderRow,
  FormatCryptoCurrency,
  Anchor,
} from '../primitives'
import Image from 'next/image'
import { useIntersectionObserver } from 'usehooks-ts'
import LoadingSpinner from '../common/LoadingSpinner'
import { useListings } from '@reservoir0x/reservoir-kit-ui'
import Link from 'next/link'
import { MutatorCallback } from 'swr'
import { useTimeSince } from 'hooks'
import CancelListing from 'components/buttons/CancelListing'
import { Address } from 'wagmi'

type Props = {
  address: Address | undefined
}

export const ListingsTable: FC<Props> = ({ address }) => {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {
    rootMargin: '0px 0px 300px 0px',
  })

  const data = useListings({
    maker: address,
    includeCriteriaMetadata: true,
  })

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      data.fetchNextPage()
    }
  }, [loadMoreObserver?.isIntersecting])

  const listings = data.data

  return (
    <>
      {!data.isValidating &&
      !data.isFetchingPage &&
      listings &&
      listings.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          css={{ py: '$6', gap: '$4', width: '100%' }}
        >
          <img src="/tag-icon.svg" width={40} height={40} />
          <Text css={{ color: '$gray11' }}>No listings yet</Text>
        </Flex>
      ) : (
        <Flex direction="column" css={{ width: '100%' }}>
          <TableHeading />
          {listings.map((listing, i) => {
            if (!listing) return null

            return (
              <ListingTableRow
                key={`${listing?.id}-${i}`}
                listing={listing}
                mutate={data?.mutate}
              />
            )
          })}
          <div ref={loadMoreRef}></div>
        </Flex>
      )}
      {data.isValidating && (
        <Flex align="center" justify="center" css={{ py: '$6' }}>
          <LoadingSpinner />
        </Flex>
      )}
    </>
  )
}

type ListingTableRowProps = {
  listing: ReturnType<typeof useListings>['data'][0]
  mutate?: MutatorCallback
}

const ListingTableRow: FC<ListingTableRowProps> = ({ listing, mutate }) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })

  let imageSrc: string = (
    listing?.criteria?.data?.token?.tokenId
      ? listing?.criteria?.data?.token?.image ||
        listing?.criteria?.data?.collection?.image
      : listing?.criteria?.data?.collection?.image
  ) as string

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
            href={`/${listing?.contract}/${listing?.criteria?.data?.token?.tokenId}`}
          >
            <Flex align="center">
              {imageSrc && (
                <Image
                  style={{
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
              )}
              <Flex
                direction="column"
                css={{
                  ml: '$2',
                  overflow: 'hidden',
                  minWidth: 0,
                }}
              >
                <Text style="subtitle3" ellipsify css={{ color: '$gray11' }}>
                  {listing?.criteria?.data?.collection?.name}
                </Text>
                <Text style="subtitle2" ellipsify>
                  #{listing?.criteria?.data?.token?.tokenId}
                </Text>
              </Flex>
            </Flex>
          </Link>
          <FormatCryptoCurrency
            amount={listing?.price?.amount?.native}
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
              <Text style="subtitle2">{useTimeSince(listing?.expiration)}</Text>
            </Flex>
          </a>
          <CancelListing
            listingId={listing?.id as string}
            buttonChildren="Cancel"
            buttonCss={{ color: '$red11' }}
            mutate={mutate}
          />
        </Flex>
      </Flex>
    )
  }

  return (
    <TableRow
      key={listing?.id}
      css={{ gridTemplateColumns: '1.25fr .75fr 1fr 1fr 1fr' }}
    >
      <TableCell css={{ minWidth: 0 }}>
        <Link
          href={`/${listing?.contract}/${listing?.criteria?.data?.token?.tokenId}`}
        >
          <Flex align="center">
            {imageSrc && (
              <Image
                style={{
                  borderRadius: '4px',
                  objectFit: 'cover',
                  aspectRatio: '1/1',
                }}
                loader={({ src }) => src}
                src={imageSrc as string}
                alt={`${listing?.criteria?.data?.token?.name}`}
                width={48}
                height={48}
              />
            )}
            <Flex
              direction="column"
              css={{
                ml: '$2',
                overflow: 'hidden',
              }}
            >
              <Text style="subtitle3" ellipsify css={{ color: '$gray11' }}>
                {listing?.criteria?.data?.collection?.name}
              </Text>
              <Text style="subtitle2" ellipsify>
                #{listing?.criteria?.data?.collection?.id}
              </Text>
            </Flex>
          </Flex>
        </Link>
      </TableCell>
      <TableCell>
        <FormatCryptoCurrency
          amount={listing?.price?.amount?.native}
          address={listing?.price?.currency?.contract}
          textStyle="subtitle2"
          logoHeight={14}
        />
      </TableCell>
      <TableCell>
        <Text style="subtitle2">{useTimeSince(listing?.expiration)}</Text>
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
          <CancelListing
            listingId={listing?.id as string}
            buttonChildren="Cancel"
            buttonCss={{ color: '$red11' }}
            mutate={mutate}
          />
        </Flex>
      </TableCell>
    </TableRow>
  )
}

const TableHeading = () => (
  <HeaderRow
    css={{
      display: 'none',
      '@md': { display: 'grid' },
      gridTemplateColumns: '1.25fr .75fr 1fr 1fr 1fr',
    }}
  >
    <TableCell>
      <Text style="subtitle3" css={{ color: '$gray11' }}>
        Items
      </Text>
    </TableCell>
    <TableCell>
      <Text style="subtitle3" css={{ color: '$gray11' }}>
        Listed Price
      </Text>
    </TableCell>
    <TableCell>
      <Text style="subtitle3" css={{ color: '$gray11' }}>
        Expiration
      </Text>
    </TableCell>

    {/* <TableCell>
      <Text style="subtitle3" css={{ color: '$gray11' }}>
        Quantity
      </Text>
    </TableCell> */}
    <TableCell>
      <Text style="subtitle3" css={{ color: '$gray11' }}>
        Marketplace
      </Text>
    </TableCell>
    <TableCell></TableCell>
  </HeaderRow>
)
