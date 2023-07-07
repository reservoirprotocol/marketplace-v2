import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCollections } from '@reservoir0x/reservoir-kit-ui'
import { OpenSeaVerified } from 'components/common/OpenSeaVerified'
import { NAVBAR_HEIGHT } from 'components/navbar'
import {
  Box,
  Flex,
  FormatCryptoCurrency,
  HeaderRow,
  TableCell,
  TableRow,
  Text,
} from 'components/primitives'
import Img from 'components/primitives/Img'
import { useMarketplaceChain } from 'hooks'
import useTopSellingCollections from 'hooks/useTopSellingCollections'
import Link from 'next/link'
import { FC, useMemo } from 'react'
import { useMediaQuery } from 'react-responsive'
import { formatNumber } from 'utils/numbers'
import optimizeImage from 'utils/optimizeImage'

type FillType = 'any' | 'mint' | 'sale'

type Props = {
  topSellingCollections: NonNullable<
    ReturnType<typeof useTopSellingCollections>['data']
  >['collections']
  collections: ReturnType<typeof useTopSellingCollections>['collections']
  loading?: boolean
  fillType: FillType
}

const fourTemplateColumns = '1.5fr 1fr 1fr 1.5fr'
const fiveTemplateColumns = '1.5fr 1fr 1fr 1.5fr'

export const CollectionTopSellingTable: FC<Props> = ({
  topSellingCollections,
  collections,
  loading,
  fillType,
}) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })

  if (loading) {
    return null
  }

  if (
    topSellingCollections?.length === 0 ||
    Object.entries(collections).length === 0
  ) {
    return (
      <Flex
        direction="column"
        align="center"
        css={{ py: '$6', gap: '$4', width: '100%' }}
      >
        <Text css={{ color: '$gray11' }}>
          <FontAwesomeIcon icon={faMagnifyingGlass} size="2xl" />
        </Text>
        <Text css={{ color: '$gray11' }}>No collections found</Text>
      </Flex>
    )
  }

  return (
    <Flex direction="column" css={{ width: '100%', pb: '$2' }}>
      {!isSmallDevice ? <CollectionTableHeading fillType={fillType} /> : null}
      <Flex direction="column" css={{ position: 'relative' }}>
        {topSellingCollections?.map((collection, i) => {
          switch (fillType) {
            case 'sale':
              return (
                <SaleTableRow
                  key={collection.id}
                  topSellingCollection={collection}
                  collection={collections[collection.id as string]}
                  rank={i + 1}
                  isSmallDevice={isSmallDevice}
                />
              )
            case 'mint':
              return (
                <MintTableRow
                  key={collection.id}
                  topSellingCollection={collection}
                  collection={collections[collection.id as string]}
                  rank={i + 1}
                  isSmallDevice={isSmallDevice}
                />
              )
            case 'any':
            default:
              return (
                <AllSalesTableRow
                  key={collection.id}
                  topSellingCollection={collection}
                  collection={collections[collection.id as string]}
                  rank={i + 1}
                  isSmallDevice={isSmallDevice}
                />
              )
          }
        })}
      </Flex>
    </Flex>
  )
}

const CollectionCell: FC<{
  topSellingCollection: NonNullable<Props['topSellingCollections']>[0]
  collection: NonNullable<Props['collections']>[0]
  rank: number
}> = ({ collection, topSellingCollection, rank }) => {
  const { routePrefix } = useMarketplaceChain()
  const collectionImage = useMemo(() => {
    return optimizeImage(topSellingCollection?.image as string, 250)
  }, [topSellingCollection?.image])
  return (
    <TableCell css={{ minWidth: 0 }}>
      <Link
        href={`/${routePrefix}/collection/${topSellingCollection.id}`}
        style={{ display: 'inline-block', width: '100%', minWidth: 0 }}
      >
        <Flex
          align="center"
          css={{
            gap: '$2',
            cursor: 'pointer',
            minWidth: 0,
            overflow: 'hidden',
            width: '100$',
          }}
        >
          <Text css={{ mr: '$2', width: 15 }} style="subtitle3">
            {rank}
          </Text>
          <Img
            src={collectionImage}
            css={{
              borderRadius: 8,
              width: 56,
              height: 56,
              objectFit: 'cover',
            }}
            alt="Collection Image"
            width={56}
            height={56}
            unoptimized
          />

          <Text
            css={{
              display: 'inline-block',
              minWidth: 0,
            }}
            style="subtitle1"
            ellipsify
          >
            {topSellingCollection?.name}
          </Text>
          <OpenSeaVerified
            openseaVerificationStatus={collection?.openseaVerificationStatus}
          />
        </Flex>
      </Link>
    </TableCell>
  )
}

const RecentSalesCell: FC<{
  topSellingCollection: NonNullable<Props['topSellingCollections']>[0]
  isSmallDevice: boolean
}> = ({ topSellingCollection, isSmallDevice }) => {
  const images =
    useMemo(
      () =>
        topSellingCollection?.recentSales?.reduce((images, sale) => {
          if (sale?.token?.image && images.length < 5) {
            images.push(optimizeImage(sale.token.image as string, 100))
          }
          return images
        }, [] as string[]),
      [topSellingCollection]
    ) || []

  return (
    <TableCell css={{ minWidth: 0, pb: isSmallDevice ? '$4' : '$3' }}>
      <Flex direction="column" css={{ gap: '$2' }}>
        <Text style="subtitle3" color="subtle">
          Recent Activity
        </Text>
        <Flex css={{ gap: '$2', overflowX: 'scroll' }}>
          {images.map((image) => (
            <Img
              src={image}
              alt="Token Image"
              width={56}
              height={56}
              unoptimized
              css={{
                borderRadius: 8,
                width: 56,
                height: 56,
                objectFit: 'cover',
              }}
            />
          ))}
        </Flex>
      </Flex>
    </TableCell>
  )
}

type CollectionTableRowProps = {
  topSellingCollection: NonNullable<
    NonNullable<
      ReturnType<typeof useTopSellingCollections>['data']
    >['collections']
  >[0]
  collection: ReturnType<typeof useTopSellingCollections>['collections'][0]
  rank: number
  isSmallDevice: boolean
}

const AllSalesTableRow: FC<CollectionTableRowProps> = ({
  collection,
  topSellingCollection,
  rank,
  isSmallDevice,
}) => {
  const mintData = collection?.mintStages?.find(
    (stage) => stage.kind === 'public'
  )
  const mintPrice = mintData?.price.amount?.native || 0
  const floorAsk = collection?.floorAsk?.price?.amount?.native || 0

  return (
    <TableRow
      key={topSellingCollection.id}
      css={{
        gridTemplateColumns: fourTemplateColumns,
      }}
    >
      <CollectionCell
        collection={collection}
        topSellingCollection={topSellingCollection}
        rank={rank}
      />
      <TableCell>
        {mintPrice < floorAsk ? (
          mintPrice === 0 ? (
            'Free'
          ) : (
            <FormatCryptoCurrency
              amount={mintPrice}
              textStyle="subtitle2"
              logoHeight={14}
            />
          )
        ) : (
          <FormatCryptoCurrency
            amount={collection?.floorAsk?.price?.amount?.decimal}
            address={collection?.floorAsk?.price?.currency?.contract}
            decimals={collection?.floorAsk?.price?.currency?.decimals}
            textStyle="subtitle2"
            logoHeight={14}
          />
        )}
      </TableCell>
      <TableCell>
        <Text style="subtitle2">
          {formatNumber(topSellingCollection.count)}
        </Text>
      </TableCell>
      <RecentSalesCell
        topSellingCollection={topSellingCollection}
        isSmallDevice={isSmallDevice}
      />
    </TableRow>
  )
}

const SaleTableRow: FC<CollectionTableRowProps> = ({
  collection,
  topSellingCollection,
  rank,
}) => {
  const { routePrefix } = useMarketplaceChain()
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })

  const collectionImage = useMemo(() => {
    return optimizeImage(topSellingCollection?.image as string, 250)
  }, [topSellingCollection?.image])

  if (isSmallDevice) {
    return (
      <Flex
        direction="column"
        css={{ borderBottom: '1px solid $gray3', pt: '$4' }}
      >
        <Link
          href={`/${routePrefix}/collection/${topSellingCollection.id}`}
          style={{ display: 'inline-block', minWidth: 0 }}
          key={topSellingCollection.id}
        >
          <Flex justify="between" css={{ gap: '$3' }}>
            <Flex align="center" css={{ cursor: 'pointer', width: '100%' }}>
              <Text css={{ mr: '$4', width: 15 }} style="subtitle3">
                {rank}
              </Text>
              <Img
                src={collectionImage}
                css={{
                  borderRadius: 8,
                  width: 48,
                  height: 48,
                  objectFit: 'cover',
                }}
                alt="Collection Image"
                width={48}
                height={48}
                unoptimized
              />
              <Box css={{ ml: '$4', width: '100%', minWidth: 0 }}>
                <Flex
                  align="center"
                  css={{ gap: '$2', mb: 4, maxWidth: '80%' }}
                >
                  <Text
                    css={{
                      display: 'inline-block',
                    }}
                    style="subtitle1"
                    ellipsify
                  >
                    {topSellingCollection?.name}
                  </Text>
                  <OpenSeaVerified
                    openseaVerificationStatus={
                      collection?.openseaVerificationStatus
                    }
                  />
                </Flex>
                <Flex align="center">
                  <Text css={{ mr: '$1', color: '$gray11' }} style="body3">
                    Floor
                  </Text>
                  <FormatCryptoCurrency
                    amount={collection?.floorAsk?.price?.amount?.decimal}
                    address={collection?.floorAsk?.price?.currency?.contract}
                    decimals={collection?.floorAsk?.price?.currency?.decimals}
                    logoHeight={16}
                    maximumFractionDigits={2}
                    textStyle="subtitle2"
                  />
                </Flex>
              </Box>
            </Flex>
            <Flex direction="column" css={{ gap: '$2' }}>
              <Text style="subtitle3" color="subtle">
                Sales
              </Text>
              <Text style="subtitle3">
                {formatNumber(topSellingCollection.count)}
              </Text>
            </Flex>
          </Flex>
        </Link>
        <RecentSalesCell
          topSellingCollection={topSellingCollection}
          isSmallDevice={isSmallDevice}
        />
      </Flex>
    )
  } else {
    return (
      <TableRow
        key={topSellingCollection.id}
        css={{
          gridTemplateColumns: fiveTemplateColumns,
        }}
      >
        <CollectionCell
          collection={collection}
          topSellingCollection={topSellingCollection}
          rank={rank}
        />
        <TableCell>
          <FormatCryptoCurrency
            amount={collection?.floorAsk?.price?.amount?.decimal}
            address={collection?.floorAsk?.price?.currency?.contract}
            decimals={collection?.floorAsk?.price?.currency?.decimals}
            textStyle="subtitle2"
            logoHeight={14}
          />
        </TableCell>
        <TableCell>
          <Text style="subtitle2">
            {formatNumber(topSellingCollection.count)}
          </Text>
        </TableCell>
        <RecentSalesCell
          topSellingCollection={topSellingCollection}
          isSmallDevice={isSmallDevice}
        />
      </TableRow>
    )
  }
}

const MintTableRow: FC<CollectionTableRowProps> = ({
  collection,
  topSellingCollection,
  rank,
  isSmallDevice,
}) => {
  const mintData = collection?.mintStages?.find(
    (stage) => stage.kind === 'public'
  )
  const mintPrice = mintData?.price.amount?.native || 0
  return (
    <TableRow
      key={topSellingCollection.id}
      css={{
        gridTemplateColumns: fourTemplateColumns,
      }}
    >
      <CollectionCell
        collection={collection}
        topSellingCollection={topSellingCollection}
        rank={rank}
      />
      <TableCell>
        {mintData ? (
          mintPrice === 0 ? (
            'Free'
          ) : (
            <FormatCryptoCurrency
              amount={mintPrice}
              textStyle="subtitle2"
              logoHeight={14}
            />
          )
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell>
        <Text style="subtitle2">
          {formatNumber(topSellingCollection.count)}
        </Text>
      </TableCell>
      <RecentSalesCell
        topSellingCollection={topSellingCollection}
        isSmallDevice={isSmallDevice}
      />
    </TableRow>
  )
}

const anyHeadings = [
  'Collection',
  'Floor Price (Including Mints)',
  'Sales',
  'Recent Sales',
]
const mintHeadings = ['Collection', 'Mint Price', 'Sales', 'Recent Sales']
const saleHeadings = [
  'Collection',
  'Volume',
  'Floor Price',
  'Sales',
  'Recent Sales',
]

type CollectionTableHeadingProps = {
  fillType: FillType
}

const CollectionTableHeading: FC<CollectionTableHeadingProps> = ({
  fillType,
}) => {
  let headings
  let columns

  switch (fillType) {
    case 'mint':
      headings = mintHeadings
      columns = fourTemplateColumns
      break
    case 'sale':
      headings = saleHeadings
      columns = fiveTemplateColumns
      break
    case 'any':
    default:
      headings = anyHeadings
      columns = fourTemplateColumns
      break
  }

  return (
    <HeaderRow
      css={{
        display: 'none',
        '@md': { display: 'grid' },
        gridTemplateColumns: columns,
        position: 'sticky',
        top: NAVBAR_HEIGHT,
        backgroundColor: '$neutralBg',
        zIndex: 1,
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
}
