import { NAVBAR_HEIGHT } from 'components/navbar'
import { HeaderRow, TableCell, Text } from 'components/primitives'
import { FC } from 'react'

type TableHeadingProps = {
  displayQuantity: boolean
  gridTemplateColumns: string
}

export const BatchListingsTableHeading: FC<TableHeadingProps> = ({
  displayQuantity,
  gridTemplateColumns,
}) => {
  return (
    <HeaderRow
      css={{
        display: 'none',
        '@md': { display: 'grid' },
        gridTemplateColumns: gridTemplateColumns,
        position: 'sticky',
        top: NAVBAR_HEIGHT,
        backgroundColor: '$neutralBg',
      }}
    >
      <TableCell>
        <Text style="subtitle3" color="subtle">
          Items
        </Text>
      </TableCell>
      {displayQuantity ? (
        <TableCell>
          <Text style="subtitle3" color="subtle">
            Quantity
          </Text>
        </TableCell>
      ) : null}
      <TableCell>
        <Text style="subtitle3" color="subtle">
          Price
        </Text>
      </TableCell>
      <TableCell>
        <Text style="subtitle3" color="subtle">
          Expiration
        </Text>
      </TableCell>
      <TableCell>
        <Text style="subtitle3" color="subtle">
          Creator Royalties
        </Text>
      </TableCell>
      <TableCell>
        <Text style="subtitle3" color="subtle">
          Marketplace Fee
        </Text>
      </TableCell>
      <TableCell>
        <Text style="subtitle3" color="subtle">
          Profit
        </Text>
      </TableCell>
      <TableCell css={{ marginLeft: 'auto' }}></TableCell>
    </HeaderRow>
  )
}
