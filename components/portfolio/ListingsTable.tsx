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

type Props = {
  data: ReturnType<typeof useListings>
}

export const ListingsTable: FC<Props> = ({ data }) => {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {
    rootMargin: '0px 0px 300px 0px',
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
        <Link href={`/${listing?.contract}/${listing?.id}`}>
          <Flex align="center">
            {listing?.criteria?.data?.token?.image && (
              <Image
                style={{
                  borderRadius: '4px',
                  objectFit: 'cover',
                  aspectRatio: '1/1',
                }}
                loader={({ src }) => src}
                src={listing?.criteria?.data?.token?.image as string}
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
      </Flex>
    )
  }

  return (
    <TableRow
      key={listing?.id}
      css={{ gridTemplateColumns: '1.25fr .75fr .75fr 1fr 1.25fr' }}
    >
      <TableCell css={{ minWidth: 0 }}>
        <Link href={`/${listing?.contract}/${listing?.id}`}>
          <Flex align="center">
            {listing?.criteria?.data?.token?.image && (
              <Image
                style={{
                  borderRadius: '4px',
                  objectFit: 'cover',
                  aspectRatio: '1/1',
                }}
                loader={({ src }) => src}
                src={listing?.criteria?.data?.token?.image as string}
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
      gridTemplateColumns: '1.25fr .75fr .75fr 1fr 1.25fr',
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
