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
              bidPoints={1000}
              listPoints={5000}
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
      <TableCell css={{ textAlign: 'center', pl: '$2 !important', py: '$5' }}>
        <Text css={{ color: '#39FF14' }}>{bidPoints}</Text>
      </TableCell>

      <TableCell css={{ textAlign: 'center', pl: '$2 !important', py: '$5' }}>
        <Text css={{ color: '#39FF14' }} style="subtitle2">{listPoints}</Text>
      </TableCell>

      <TableCell css={{ textAlign: 'center', pl: '$2 !important', py: '$5' }}>
        <Text css={{ color: '#39FF14' }} style="subtitle2">{listingLoyalty} %</Text>
      </TableCell>
    </TableRow>
  )
}

const TableHeading = () => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })
  const headings = ['BID POINTS', 'LISTING POINTS', 'LISTING LOYALTY']
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
