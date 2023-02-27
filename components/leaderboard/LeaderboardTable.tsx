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
  data: User
}

type User = {
  rank: number
  username: string
  volume: number
  reward: number
}

const desktopTemplateColumns = '.75fr repeat(3, 1fr)'
const mobileTemplateColumns = 'repeat(3, 1fr) 55px'
export const LeaderboardTable: FC<Props> = ({ data }) => {
  const loadMoreRef = useRef<HTMLDivElement>(null)

  //@ts-ignore
  const users: User[] = data

  return (
    <Collapsible.Root defaultOpen={true} style={{ width: '100%' }}>
      <CollapsibleContent
        css={{
          position: 'sticky',
          top: 16 + 80,
          height: '55vh',
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
            {users.map((user: User, i: number) => {
              return (
                <LeaderboardTableRow
                  key={i}
                  rank={user.rank}
                  username={user.username}
                  volume={user.volume}
                  reward={user.reward}
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
  volume: number
  reward: number
}

const LeaderboardTableRow: FC<LeaderboardTableRowProps> = ({
  rank,
  username,
  volume,
  reward,
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

      <TableCell css={{ textAlign: 'center', pl: '$2 !important', py: '$5' }}>
        <Text style="subtitle2">{username}</Text>
      </TableCell>

      <TableCell css={{ textAlign: 'center', pl: '$2 !important', py: '$5' }}>
        <Text style="subtitle2">{volume} </Text>
      </TableCell>
      <TableCell css={{ textAlign: 'center', pl: '$2 !important', py: '$5' }}>
        <Flex css={{ gap: '$3', marginLeft: '100px' }}>
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
            {reward}
          </Text>
          <Box>
            <img src="/nftearth-icon.png" width={25} height={25} />
          </Box>
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
          css={{
            textAlign: 'center',
            pl: '$2 !important',
            py: '$1',
            border: '1px solid $primary2',
          }}
        >
          <Text as={'div'} style="subtitle1">
            {heading}
          </Text>
        </TableCell>
      ))}
    </HeaderRow>
  )
}
