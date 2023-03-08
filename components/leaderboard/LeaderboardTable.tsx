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

type Props = {
  data: any
}

const desktopTemplateColumns = '.75fr repeat(4, 1fr)'
const mobileTemplateColumns = 'repeat(4, 1fr) 55px'

export const LeaderboardTable: FC<Props> = ({ data }) => {

  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [searchWallet, setSearchWallet] = useState<string | null>("");
  const { address } = useAccount();
  const tableRef = useRef<HTMLTableElement>(null);

  // find by wallet in the table
  const filteredData = data?.filter((item: any) => item.wallet.toLowerCase().includes(searchWallet?.toLowerCase()));
  const matchingItem = data?.find((item: any) => item.wallet.toLowerCase() === address?.toLowerCase());

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollTop = 0;
    }
  }, [searchWallet]);

  return (
    <Collapsible.Root defaultOpen={true} style={{ width: '100%' }}>
      <Flex
      justify="end"
      css={{
        alignItems: 'center',
        gap: '20px',
        marginBottom: '20px',
        backgroud: 'white',
        "@xs": {
          marginRight: '0',
        },
        "@lg": {
          marginRight: '5vw',
        },
      }}>
        <Text>Searh Wallet</Text>
        <Input
          onChange={(e) => { setSearchWallet(e.target.value); }}
          style={{
            borderRadius: '10px',
            background: '#3C3C3C',
          }}
          css={{
            "@xs": {
              width: '100px',
            },
            "@md": {
              width: '250px',
            }
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
            {
              matchingItem && (
              <LeaderboardTableRow
                key={matchingItem.id}
                rank={1}
                username="You"
                listingExp={matchingItem.listingExp}
                offerExp={matchingItem.offerExp}
                totalExp={matchingItem.exp}
              />
            )}
            {
              filteredData?.filter((item: any) => item.wallet.toLowerCase() !== address?.toLowerCase())
              .map((item: any, i: number) => (
                <LeaderboardTableRow
                  key={item.id}
                  rank={matchingItem ? i + 2 : i + 1}
                  username={item.wallet}
                  listingExp={item.listingExp}
                  offerExp={item.offerExp}
                  totalExp={item.exp}
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
  listingExp: number
  offerExp: number
  totalExp: number
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
        gridTemplateColumns: isSmallDevice
          ? mobileTemplateColumns
          : desktopTemplateColumns,
        borderBottomColor: theme === 'light' ? '$primary11' : '$primary6',
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
        <Text>{rank}</Text>
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
        <Text style="subtitle1">{username}</Text>
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
          style="subtitle1"
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
          textAlign: 'center',
          pl: '$2 !important',
          py: '$5',
        }}
      >
        <Text
          style="subtitle1"
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
          style="subtitle1"
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
        border: '1px solid $primary13',
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
