import React, { FC, useRef } from 'react'
import { useMediaQuery } from 'react-responsive'
import {
  Text,
  Flex,
  TableCell,
  TableRow,
  HeaderRow,
  Box,
  CollapsibleContent,
} from '../primitives'
import { useTheme } from 'next-themes'
import * as Collapsible from '@radix-ui/react-collapsible'

const desktopTemplateColumns = '.75fr repeat(2, 1fr)'
const mobileTemplateColumns = 'repeat(2, 1fr) 55px'

export const PointsTable: FC = () => {
  const loadMoreRef = useRef<HTMLDivElement>(null)

  return (
    <Collapsible.Root defaultOpen={true} style={{ width: '100%' }}>
      <CollapsibleContent
        css={{
          position: 'sticky',
          overflow: 'auto',
          marginTop: 20,
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
          <Flex direction="column" css={{ width: '100%', pb: '$2' }}>
            <TableHeading />

            <PointsTableRow
              bidPoints={50}
              listPoints={50}
              listingLoyalty={0}
            />

            <Box ref={loadMoreRef} css={{ height: 20 }} />
          </Flex>
        </Box>
      </CollapsibleContent>
    </Collapsible.Root>
  )
}

type PointsTableRowProps = {
  bidPoints: number
  listPoints: number
  listingLoyalty: number
}

const PointsTableRow: FC<PointsTableRowProps> = ({
  bidPoints,
  listPoints,
  listingLoyalty,
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
          border: theme
            ? theme === 'dark'
              ? '1px solid #39FF14'
              : '1px solid $primary13'
            : '1px solid $primary13',
          textAlign: 'center',
          pl: '$2',
          py: '$5',
        }}
      >
        <Text
          css={{
            color: theme
              ? theme === 'dark'
                ? '#39FF14'
                : '$gray11'
              : '#39FF14',
          }}
        >
          {bidPoints}
        </Text>
      </TableCell>

      <TableCell
        css={{
          border: theme
            ? theme === 'dark'
              ? '1px solid #39FF14'
              : '1px solid $primary13'
            : '1px solid $primary13',
          textAlign: 'center',
          pl: '$2',
          py: '$5',
        }}
      >
        <Text
          css={{
            color: theme
              ? theme === 'dark'
                ? '#39FF14'
                : '$gray11'
              : '#39FF14',
          }}
          style="subtitle2"
        >
          {listPoints}
        </Text>
      </TableCell>

      <TableCell
        css={{
          border: theme
            ? theme === 'dark'
              ? '1px solid #39FF14'
              : '1px solid $primary13'
            : '1px solid $primary13',
          textAlign: 'center',
          pl: '$2',
          py: '$5',
        }}
      >
        <Text
          css={{
            color: theme
              ? theme === 'dark'
                ? '#39FF14'
                : '$gray11'
              : '#39FF14',
          }}
          style="subtitle2"
        >
          {listingLoyalty} %
        </Text>
      </TableCell>
    </TableRow>
  )
}

const TableHeading = () => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })
  const headings = ['OFFER XP', 'LISTING XP', 'TOTAL XP']
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
      }}
    >
      {headings.map((heading) => (
        <TableCell
          key={heading}
          css={{
            textAlign: 'center',
            pl: '$2',
            py: '$1',
            border: theme
              ? theme === 'dark'
                ? '1px solid #39FF14'
                : '1px solid $primary13'
              : '1px solid #39FF14',
          }}
        >
          <Text
            css={{
              color: theme
                ? theme === 'dark'
                  ? '$primary9'
                  : '$gray11'
                : '$primary9',
            }}
            as={'div'}
            style="subtitle1"
          >
            {heading}
          </Text>
        </TableCell>
      ))}
    </HeaderRow>
  )
}