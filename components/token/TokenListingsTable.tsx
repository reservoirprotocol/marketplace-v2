import React, { FC, useEffect, useRef } from 'react'
import { useMediaQuery } from 'react-responsive'
import {
  Text,
  Flex,
  TableCell,
  TableRow,
  HeaderRow,
  Button,
  Box, FormatCryptoCurrency, CollapsibleContent,
} from '../primitives'
import { faTag } from '@fortawesome/free-solid-svg-icons'
import { useIntersectionObserver } from 'usehooks-ts'
import LoadingSpinner from '../common/LoadingSpinner'
import { useListings, useTokens } from '@nftearth/reservoir-kit-ui'
import Link from 'next/link'
import { MutatorCallback } from 'swr'
import { useENSResolver, useTimeSince } from 'hooks'
import {BuyNow} from '../buttons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAccount } from 'wagmi'
import { useTheme } from 'next-themes'
import CancelListing from "../buttons/CancelListing";
import * as Collapsible from "@radix-ui/react-collapsible";
import {NAVBAR_HEIGHT} from "../navbar";

type Props = {
  token: ReturnType<typeof useTokens>['data'][0]
  account: ReturnType<typeof useAccount>
}

const desktopTemplateColumns = '.75fr repeat(4, 1fr)'
const mobileTemplateColumns = 'repeat(3, 1fr) 55px'
export const TokenListingsTable: FC<Props> = ({
  token,
  account,
}) => {
  const { address } = account || {}
  const { theme } = useTheme()
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})

  let listingQuery: Parameters<typeof useListings>['0'] = {
    token: `${token?.token?.collection?.id}:${token?.token?.tokenId}`,
    sortBy: 'price',
    native: true
  }

  const {
    data: orders,
    fetchNextPage,
    mutate,
    isValidating,
    isFetchingPage,
  } = useListings(listingQuery)

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      fetchNextPage()
    }
  }, [loadMoreObserver?.isIntersecting, isFetchingPage])

  return (
    <Collapsible.Root
      defaultOpen={true}
      style={{ width: '100%' }}
    >
      <Collapsible.Trigger asChild>
        <Flex
          direction="row"
          align="center"
          css={{
            px: '$4',
            py: '$3',
            backgroundColor: theme === 'light'
              ? '$primary11'
              : '$primary6',
            mt: 30,
            cursor: 'pointer',
          }}
        >
          <FontAwesomeIcon icon={faTag} />
          <Text style="h6" css={{ ml: '$4' }}>
            Listings
          </Text>
        </Flex>
      </Collapsible.Trigger>
      <CollapsibleContent
        css={{
          position: 'sticky',
          top: 16 + 80,
          height: `calc(50vh - ${NAVBAR_HEIGHT}px - 32px)`,
          overflow: 'auto',
          marginBottom: 16,
          borderRadius: '$base',
          p: '$2',
        }}
      >
        <Box
          css={{
            '& > div:first-of-type': {
              pt: 0,
            },
          }}
        >
          <Flex
            direction="column"
            css={{ width: '100%', maxHeight: 300, overflowY: 'auto', pb: '$2' }}
          >
            <TableHeading />
            {orders.map((order, i) => {
              return (
                <ListingTableRow
                  key={`${order?.id}-${i}`}
                  order={order}
                  mutate={mutate}
                  token={token}
                  address={address}
                />
              )
            })}
            <Box ref={loadMoreRef} css={{ height: 20 }} />
          </Flex>
          {isValidating && (
            <Flex align="center" justify="center" css={{ py: '$5' }}>
              <LoadingSpinner />
            </Flex>
          )}
        </Box>
      </CollapsibleContent>
    </Collapsible.Root>
  )
}

type ListingTableRowProps = {
  order: ReturnType<typeof useListings>['data'][0]
  token: ReturnType<typeof useTokens>['data'][0]
  mutate?: MutatorCallback
  address: `0x${string}` | undefined
}

const ListingTableRow: FC<ListingTableRowProps> = ({
  order,
  token,
  mutate,
  address,
}) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })
  const expiration = useTimeSince(order?.validUntil)
  const { displayName: makerDisplayName } = useENSResolver(order?.maker)
  const { theme } = useTheme()

  return (
    <TableRow
      key={order?.id}
      css={{
        gridTemplateColumns: isSmallDevice ? mobileTemplateColumns : desktopTemplateColumns,
        borderBottomColor: theme === 'light'
          ? '$primary11'
          : '$primary6',
      }}
    >
      <TableCell css={{ pl: '$2 !important', py: '$3' }}>
        <FormatCryptoCurrency
          amount={order?.price?.amount?.native}
          logoHeight={14}
          textStyle={'subtitle2'}
          maximumFractionDigits={4}
        />
      </TableCell>
      {!isSmallDevice && (
        <TableCell css={{ pl: '$2 !important', py: '$3' }}>
          <Text style="subtitle2">
            {order?.quantityRemaining}
          </Text>
        </TableCell>
      )}
      <TableCell css={{ pl: '$2 !important', py: '$3' }}>
        <Text style="subtitle2">{expiration}</Text>
      </TableCell>
      <TableCell css={{ pl: '$2 !important', py: '$3' }}>
        <Link href={`/profile/${order?.maker}`}>
          <Text
            style="subtitle3"
            css={{
              color: '$primary13',
              '&:hover': {
                color: '$primary14',
              },
            }}
          >
            {makerDisplayName}
          </Text>
        </Link>
      </TableCell>
      <TableCell css={{ pl: '$2 !important', py: '$3' }}>
        <Flex align="center" justify="end">
          {order?.maker !== address?.toLowerCase() && (
            <BuyNow
              order={order}
              token={token}
              buttonCss={{ flex: 1, justifyContent: 'center' }}
              mutate={mutate}
              buttonProps={{
                size: isSmallDevice ? 'xs' : 'medium',
              }}
              compact
            />
          )}
          {order?.maker === address?.toLowerCase() && (
            <CancelListing
              listingId={order?.id as string}
              mutate={mutate}
              trigger={
                <Button
                  css={{ flex: 1, justifyContent: 'center', color: '$red11', px: '5px' }}
                  size={isSmallDevice ? 'xs' : 'medium'}
                  color="gray3"
                >
                  Cancel
                </Button>
              }
            />
          )}
        </Flex>
      </TableCell>
    </TableRow>
  )
}

const TableHeading = () => {
  const { theme } = useTheme()
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })
  const headings = isSmallDevice ? ['Price', 'Expiration', 'From', ''] : ['Price', 'Quantity', 'Expiration', 'From', '']
  return (
    <HeaderRow
      css={{
        display: 'grid',
        gridTemplateColumns: isSmallDevice ? mobileTemplateColumns : desktopTemplateColumns,
        position: 'sticky',
        top: 0,
        backgroundColor: theme === 'light'
          ? '$primary10'
          : '$primary5',
      }}
    >
      {headings.map((heading) => (
        <TableCell
          key={heading}
          css={{ pl: '$2 !important', py: '$1', border: '1px solid $primary2' }}
        >
          <Text as={'div'} style="subtitle3">
            {heading}
          </Text>
        </TableCell>
      ))}
    </HeaderRow>
  )
}
