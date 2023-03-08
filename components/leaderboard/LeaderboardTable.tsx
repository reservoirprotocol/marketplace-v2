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
import { ItemIndicator } from '@radix-ui/react-dropdown-menu'

type Props = {
  data: any
}

type User = {
  rank: number
  username: string
  volume: number
  reward: number
}

const desktopTemplateColumns = '.75fr repeat(4, 1fr)'
const mobileTemplateColumns = 'repeat(4, 1fr) 55px'
export const LeaderboardTable: FC<Props> = ({ data }) => {
  const loadMoreRef = useRef<HTMLDivElement>(null)

  //@ts-ignore

  return (
    <Collapsible.Root defaultOpen={true} style={{ width: '100%' }}>
      <CollapsibleContent
        css={{
          position: 'sticky',
          top: 16 + 80,
          height: '55vh',
          width: '90vw',
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
            css={{ width: '100%', height: '87vh', pb: '$2' }}
          >
            <TableHeading />
            {data?.map((item: any, i: number) => {
              return (
                <LeaderboardTableRow
                  key={i}
                  rank={i + 1}
                  username={item.wallet}
                  listingExp={item.listingExp}
                  offerExp={item.offerExp}
                  totalExp={item.exp}
                />
              )
            })}
            <Box ref={loadMoreRef} css={{ height: 20 }} />
          </Flex>
        </Box>
      </CollapsibleContent>
    </Collapsible.Root>
  )
}

type LeaderboardTableRowProps = {
  rank: number
  username: string
  listingExp: number
  offerExp: number
  totalExp: number
}

const LeaderboardTableRow: FC<LeaderboardTableRowProps> = ({
  rank,
  username,
  listingExp,
  offerExp,
  totalExp
}) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })
  const { theme } = useTheme()

  return (
    <TableRow
      css={{
        gridTemplateColumns: isSmallDevice
          ? mobileTemplateColumns
          : desktopTemplateColumns,
        borderBottomColor: theme === 'light' ? '$primary11' : '$primary6',
      }}
    >
      <TableCell css={{ textAlign: 'center', pl: '$2 !important', py: '$5' }}>
        <Text>{rank}</Text>
      </TableCell>

      <TableCell css={{ maxWidth: '260px', overflow: 'scroll', textAlign: 'center', pl: '$2 !important'}}>
        <Text style="subtitle2">{username}</Text>
      </TableCell>

      <TableCell css={{ textAlign: 'center', pl: '$2 !important', py: '$5' }}>
        <Text style="subtitle2">{listingExp} </Text>
      </TableCell>
      <TableCell css={{ textAlign: 'center', pl: '$2 !important', py: '$5' }}>
          <Text
            style="subtitle3"
            css={{
              color: '$primary13',
              marginTop: '$1',
              '&:hover': {
                color: '$primary14',
              },
            }}
          >
            {offerExp}
          </Text>
      </TableCell>
      <TableCell css={{ textAlign: 'center', pl: '$2 !important', py: '$5' }}>
          <Text
            style="subtitle3"
            css={{
              color: '$primary13',
              marginTop: '$1',
              '&:hover': {
                color: '$primary14',
              },
            }}
          >
            {totalExp}
          </Text>
      </TableCell>
    </TableRow>
  )
}

const TableHeading = () => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })
  const headings = ['Rank', 'User', 'Offers XP', 'Listings XP', 'Total XP']
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
          css={{
            textAlign: 'center',
            pl: '$2 !important',
            py: '$1',
            border: '1px solid $primary2',
          }}
        >
          <Text css={{ color: '$gray11' }} as={'div'} style="subtitle1">
            {heading}
          </Text>
        </TableCell>
      ))}
    </HeaderRow>
  )
}
