import React, { FC, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import {
  Text,
  Flex,
  TableCell,
  TableRow,
  HeaderRow,
  Box,
  Input,
  CollapsibleContent,
} from '../primitives'
import { useAccount } from 'wagmi'
import { useTheme } from 'next-themes'
import * as Collapsible from '@radix-ui/react-collapsible'
import {formatNumber} from "../../utils/numbers";
import {useProfile} from "../../hooks";

type Props = {
  data: any
}

const desktopTemplateColumns = '.75fr repeat(4, 1fr)'
const mobileTemplateColumns = 'repeat(5, 1fr)'

export const LeaderboardTable: FC<Props> = ({ data }) => {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [searchWallet, setSearchWallet] = useState<string | null>('')
  const { address } = useAccount()
  const { data: profile } = useProfile(address)
  const tableRef = useRef<HTMLTableElement>(null)

  // find by wallet in the table
  const filteredData = data?.filter((item: any) =>
    new RegExp(`${searchWallet}`, 'ig').test(item.wallet)
  )

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollTop = 0
    }
  }, [searchWallet])

  return (
    <Collapsible.Root defaultOpen={true} style={{ width: '100%' }}>
      <Flex
        justify="end"
        css={{
          alignItems: 'center',
          gap: '20px',
          marginBottom: '20px',
          backgroud: 'white',
          '@xs': {
            marginRight: '0',
          },
          '@lg': {
            marginRight: '5vw',
          },
        }}
      >
        <Text>Search Wallet</Text>
        <Input
          onChange={(e) => {
            setSearchWallet(e.target.value)
          }}
          style={{
            borderRadius: '10px',
            background: '#3C3C3C',
          }}
          css={{
            '@xs': {
              width: '100px',
            },
            '@md': {
              width: '250px',
            },
          }}
        />
      </Flex>
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
        ref={tableRef}
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
            {profile && (
              <LeaderboardTableRow
                key={profile.id}
                rank={data.map((e: any) => e.wallet.toLowerCase()).indexOf(address?.toLowerCase()) + 1}
                username="You"
                listingExp={formatNumber(profile.listingExp, 2)}
                offerExp={formatNumber(profile.offerExp, 2)}
                totalExp={formatNumber(profile.exp, 2)}
              />
            )}
            {filteredData
              ?.filter(
                (item: any) =>
                  item.wallet.toLowerCase() !== address?.toLowerCase()
              )
              .map((item: any, i: number) => (
                <LeaderboardTableRow
                  key={`leaderboard-${i}`}
                  rank={i + 1}
                  username={item.wallet}
                  listingExp={formatNumber(item.listingExp, 2)}
                  offerExp={formatNumber(item.offerExp, 2)}
                  totalExp={formatNumber(item.exp, 2)}
                />
              ))}
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
  listingExp: string
  offerExp: string
  totalExp: string
}

const LeaderboardTableRow: FC<LeaderboardTableRowProps> = ({
  rank,
  username,
  listingExp,
  offerExp,
  totalExp,
}) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })
  const { theme } = useTheme()

  return (
    <TableRow
      css={{
        borderBottomColor: theme === 'light' ? '$primary11' : '$primary6',
        '@xs': {
          gridTemplateColumns: 'repeat(5, 1fr)',
        },
        '@lg': {
          gridTemplateColumns: '.75fr repeat(4, 1fr)',
        },
      }}
    >
      <TableCell
        css={{
          borderBottom: '1px solid $primary13',
          borderLeft: '1px solid $primary13',
          textAlign: 'center',
          pl: '$2 !important',
          py: '$5',
        }}
      >
        <Text
          style={{
            '@initial': 'subtitle3',
            '@lg': 'subtitle1',
          }}
        >
          {rank}
        </Text>
      </TableCell>

      <TableCell
        css={{
          borderBottom: '1px solid $primary13',
          borderLeft: '1px solid $primary13',
          maxWidth: '',
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          pl: '$2 !important',
          py: '$5',
        }}
      >
        {username === 'You' ? (
          <Text
            style={{
              '@initial': 'subtitle3',
              '@lg': 'subtitle1',
            }}
            css={{ color: '$crimson9' }}
          >
            {username}
          </Text>
        ) : (
          <Text
            style={{
              '@initial': 'subtitle3',
              '@lg': 'subtitle1',
            }}
          >
            {username}
          </Text>
        )}
      </TableCell>

      <TableCell
        css={{
          borderBottom: '1px solid $primary13',
          borderLeft: '1px solid $primary13',
          textAlign: 'center',
          pl: '$2 !important',
          py: '$5',
        }}
      >
        <Text
          style={{
            '@initial': 'subtitle3',
            '@lg': 'subtitle1',
          }}
          css={{
            color: '$primary13',
            marginTop: '$1',
            '&:hover': {
              color: '$primary14',
            },
          }}
        >
          {offerExp ?? 0}
        </Text>
      </TableCell>
      <TableCell
        css={{
          borderBottom: '1px solid $primary13',
          borderLeft: '1px solid $primary13',
          textAlign: 'center',
          pl: '$2 !important',
          py: '$5',
        }}
      >
        <Text
          style={{
            '@initial': 'subtitle3',
            '@lg': 'subtitle1',
          }}
          css={{
            color: '$primary13',
            marginTop: '$1',
            '&:hover': {
              color: '$primary14',
            },
          }}
        >
          {listingExp ?? 0}
        </Text>
      </TableCell>
      <TableCell
        css={{
          borderBottom: '1px solid $primary13',
          borderLeft: '1px solid $primary13',
          borderRight: '1px solid $primary13',
          textAlign: 'center',
          pl: '$2 !important',
          pr: '$2 !important',
          py: '$5',
        }}
      >
        <Text
          style={{
            '@initial': 'subtitle3',
            '@lg': 'subtitle1',
          }}
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
  const headings = ['Rank', 'User', 'Offers XP', 'Listing XP', 'Total XP']
  const { theme } = useTheme()
  return (
    <HeaderRow
      css={{
        borderTop: '1px solid $primary13',
        display: 'grid',
        position: 'sticky',
        top: 0,
        backgroundColor: theme === 'light' ? '$primary10' : '$primary5',
        '@xs': {
          gridTemplateColumns: 'repeat(5, 1fr)',
        },
        '@lg': {
          gridTemplateColumns: '.75fr repeat(4, 1fr)',
        },
      }}
    >
      {headings.map((heading, index, array) => (
        <TableCell
          key={index}
          css={{
            textAlign: 'center',
            pl: '$2 !important',
            py: '$2',
            borderBottom: '1px solid $primary13',
            borderLeft: '1px solid $primary13',
            ...(index === array.length - 1 && {
              borderRight: '1px solid $primary13',
            }),
          }}
        >
          <Text
            css={{
              color: '$gray11',
              display: 'flex',
              justifyContent: 'center',
            }}
            as={'div'}
            style={{
              '@initial': 'subtitle3',
              '@lg': 'subtitle2',
            }}
          >
            {heading}
          </Text>
        </TableCell>
      ))}
    </HeaderRow>
  )
}
