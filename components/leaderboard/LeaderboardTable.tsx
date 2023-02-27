import React, { FC, useEffect, useRef } from 'react'
import { useMediaQuery } from 'react-responsive'
import {
  Text,
  Flex,
  TableCell,
  TableRow,
  HeaderRow,
  Button,
  Box,
  FormatCryptoCurrency,
  CollapsibleContent,
} from '../primitives'
import { faListDots } from '@fortawesome/free-solid-svg-icons'
import { useIntersectionObserver } from 'usehooks-ts'
import LoadingSpinner from '../common/LoadingSpinner'
import { useBids, useTokens } from '@nftearth/reservoir-kit-ui'
import Link from 'next/link'
import { MutatorCallback } from 'swr'
import { useENSResolver, useTimeSince } from 'hooks'
import CancelBid from 'components/buttons/CancelBid'
import { AcceptBid, BuyNow } from '../buttons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt } from '@fortawesome/free-solid-svg-icons'
import { useAccount } from 'wagmi'
import { useTheme } from 'next-themes'
import * as Collapsible from '@radix-ui/react-collapsible'
import { NAVBAR_HEIGHT } from '../navbar'

type Props = {
  token: ReturnType<typeof useTokens>['data'][0]
  floor: number | undefined
  account: ReturnType<typeof useAccount>
  isOwner: boolean
}

const desktopTemplateColumns = '.75fr repeat(4, 1fr)'
const mobileTemplateColumns = 'repeat(3, 1fr) 55px'
export const LeaderboardTable: FC<Props> = ({
  token,
  floor,
  account,
  isOwner,
}) => {
  const { address } = account || {}
  const { theme } = useTheme()
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})

  let bidsQuery: Parameters<typeof useBids>['0'] = {
    token: `${token?.token?.collection?.id}:${token?.token?.tokenId}`,
    sortBy: 'price',
  }

  const {
    data: offers,
    fetchNextPage,
    mutate,
    isValidating,
    isFetchingPage,
  } = useBids(bidsQuery)

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      fetchNextPage()
    }
  }, [loadMoreObserver?.isIntersecting, isFetchingPage])

  return (
    <Collapsible.Root defaultOpen={true} style={{ width: '100%' }}>
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
            {offers.map((offer, i) => {
              return (
                <OfferTableRow
                  key={`${offer?.id}-${i}`}
                  offer={offer}
                  mutate={mutate}
                  token={token}
                  floor={floor}
                  isOwner={isOwner}
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

type OfferTableRowProps = {
  offer: ReturnType<typeof useBids>['data'][0]
  token: ReturnType<typeof useTokens>['data'][0]
  mutate?: MutatorCallback
  address: `0x${string}` | undefined
  floor: number | undefined
  isOwner: boolean
}

const OfferTableRow: FC<OfferTableRowProps> = ({
  offer,
  token,
  mutate,
  address,
  floor = 0,
  isOwner,
}) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })
  const expiration = useTimeSince(offer?.expiration)
  const { displayName: makerDisplayName } = useENSResolver(offer?.maker)
  const offerPrice = offer?.price?.amount?.native || 0
  const { theme } = useTheme()

  return (
    <TableRow
      key={offer?.id}
      css={{
        gridTemplateColumns: isSmallDevice
          ? mobileTemplateColumns
          : desktopTemplateColumns,
        borderBottomColor: theme === 'light' ? '$primary11' : '$primary6',
      }}
    >
      <TableCell css={{ pl: '$2 !important', py: '$3' }}>
        <FormatCryptoCurrency
          amount={offer?.price?.amount?.native}
          logoHeight={14}
          textStyle={'subtitle2'}
          maximumFractionDigits={4}
        />
      </TableCell>
      {!isSmallDevice && (
        <TableCell css={{ pl: '$2 !important', py: '$3' }}>
          <Text style="subtitle2">
            {`${(
              100 * Math.abs((offerPrice - floor) / ((offerPrice + floor) / 2))
            ).toFixed(0)}% ${offerPrice > floor ? 'above' : 'below'}`}
          </Text>
        </TableCell>
      )}
      <TableCell css={{ pl: '$2 !important', py: '$3' }}>
        <Text style="subtitle2">{expiration}</Text>
      </TableCell>
      <TableCell css={{ pl: '$2 !important', py: '$3' }}>
        <Link href={`/profile/${offer?.maker}`}>
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
          {isOwner && (
            <AcceptBid
              bidId={offer?.id}
              collectionId={offer?.criteria?.data?.collection?.id}
              token={token}
              mutate={mutate}
              buttonCss={{ flex: 1, justifyContent: 'center' }}
              buttonProps={{
                size: isSmallDevice ? 'xs' : 'medium',
              }}
              buttonChildren={
                <Flex align="center" css={{ gap: '$2' }}>
                  <FontAwesomeIcon icon={faBolt} />
                  {!isSmallDevice && `Sell`}
                </Flex>
              }
            />
          )}
          {offer?.maker === address?.toLowerCase() && (
            <CancelBid
              bidId={offer?.id as string}
              mutate={mutate}
              trigger={
                <Button
                  css={{ color: '$red11', px: '5px' }}
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
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })
  const headings = ['Rank', 'Codename', 'Volume', 'Potential Reward']
  const { theme } = useTheme()
  return (
    <HeaderRow
      css={{
        display: 'grid',
        gridTemplateColumns: isSmallDevice
          ? mobileTemplateColumns
          : desktopTemplateColumns,
        position: 'sticky',
        top: 0,
        backgroundColor: theme === 'light' ? '$primary10' : '$primary5',
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
