import { useCollections } from '@reservoir0x/reservoir-kit-ui'
import { NAVBAR_HEIGHT } from 'components/navbar'
import { HeaderRow, TableCell, Text } from 'components/primitives'
import { ComponentPropsWithoutRef, FC } from 'react'
import { useMediaQuery } from 'react-responsive'

type Props = {
  collections: ReturnType<typeof useCollections>['data']
  loading?: boolean
  // volumeKey: ComponentPropsWithoutRef<
  //   typeof TrendingCollectionItem
  // >['volumeKey']
}

// Do we want this table to handle fetching and all logic, or do this at page level?

const desktopTemplateColumns = 'repeat(7, 1fr)'

export const CollectionRankingsTable: FC<Props> = ({}) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })

  if (isSmallDevice) {
    return <></>
  } else {
    return (
      <>
        <TableHeading />
      </>
    )
  }
}

const headings = [
  'Collection',
  '',
  'Volume',
  'Floor Price',
  'Top Offer',
  'Sales',
  'Owners',
]

const TableHeading = () => (
  <HeaderRow
    css={{
      display: 'none',
      '@md': { display: 'grid' },
      gridTemplateColumns: desktopTemplateColumns,
      position: 'sticky',
      top: NAVBAR_HEIGHT,
      backgroundColor: '$neutralBg',
    }}
  >
    {headings.map((heading) => (
      <TableCell key={heading}>
        <Text style="subtitle3" color="subtle">
          {heading}
        </Text>
      </TableCell>
    ))}
  </HeaderRow>
)
