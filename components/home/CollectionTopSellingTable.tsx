import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
  Tooltip,
} from 'components/primitives'
import Img from 'components/primitives/Img'
import { useMarketplaceChain } from 'hooks'
import useTopSellingCollections from 'hooks/useTopSellingCollections'
import Link from 'next/link'
import { FC, useMemo } from 'react'
import { useMediaQuery } from 'react-responsive'
import { formatNumber } from 'utils/numbers'
import optimizeImage from 'utils/optimizeImage'
import { ActiveMintTooltip } from './ActiveMintTooltip'

type FillType = 'any' | 'mint' | 'sale'

type Props = {
  topSellingCollections: NonNullable<
    ReturnType<typeof useTopSellingCollections>['data']
  >['collections']
  collections: ReturnType<typeof useTopSellingCollections>['collections']
  loading?: boolean
  fillType: FillType
}

const fourTemplateColumns = '1.5fr 1fr 1fr 324px'
const fiveTemplateColumns = '1.6fr 1fr 1fr 1fr 1.6fr'

export const CollectionTopSellingTable: FC<Props> = ({
  topSellingCollections,
  collections,
  loading,
  fillType,
}) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })

  return (
    <Flex direction="column" css={{ width: '100%', pb: '$2' }}>
      {!isSmallDevice ? <CollectionTableHeading fillType={fillType} /> : null}

      {!loading && topSellingCollections?.length === 0 ? (
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
      ) : (
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
      )}
    </Flex>
  )
}

const CollectionCell: FC<{
  topSellingCollection: NonNullable<Props['topSellingCollections']>[0]
  collection: NonNullable<Props['collections']>[0]
  rank: number
}> = ({ collection, topSellingCollection, rank }) => {
  const { routePrefix } = useMarketplaceChain()

  const mintData = collection?.mintStages?.find(
    (stage) => stage.kind === 'public'
  )

  const collectionImage = useMemo(() => {
    return optimizeImage(
      collection?.image || (topSellingCollection?.image as string),
      250
    )
  }, [collection?.image, topSellingCollection?.image])
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
          {mintData ? <ActiveMintTooltip /> : null}
        </Flex>
      </Link>
    </TableCell>
  )
}

const RecentSalesCell: FC<{
  collection: NonNullable<Props['collections']>[0]
  topSellingCollection: NonNullable<Props['topSellingCollections']>[0]
  isSmallDevice: boolean
}> = ({ collection, topSellingCollection, isSmallDevice }) => {
  const recentSales =
    useMemo(() => {
      return topSellingCollection?.recentSales?.slice(0, 5)
    }, [topSellingCollection]) || []

  return (
    <TableCell
      css={{
        minWidth: 0,
        pb: recentSales?.length > 0 ? (isSmallDevice ? '$4' : '$3') : 0,
        px: isSmallDevice ? 0 : '$3',
      }}
    >
      <Flex direction="column" css={{ gap: '$2' }}>
        {isSmallDevice && recentSales?.length > 0 ? (
          <Text style="subtitle3" color="subtle">
            Recent Activity
          </Text>
        ) : null}
        <Flex css={{ gap: '$2', overflowX: 'auto' }}>
          {recentSales?.map((sale, idx) => (
            <Tooltip
              key={idx}
              open={sale?.token?.name ? undefined : false}
              content={
                <Text style="body3" as="p">
                  {sale?.token?.name}
                </Text>
              }
            >
              <Flex css={{ flexShrink: 0 }}>
                <Img
                  src={sale?.token?.image || collection?.image || ''}
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
              </Flex>
            </Tooltip>
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
  const mintPrice = mintData?.price?.amount?.decimal || 0
  const floorAsk = collection?.floorAsk?.price?.amount?.native || 0

  const { routePrefix } = useMarketplaceChain()

  const collectionImage = useMemo(() => {
    return optimizeImage(
      collection?.image || (topSellingCollection?.image as string),
      250
    )
  }, [collection?.image, topSellingCollection?.image])

  if (isSmallDevice) {
    return (
      <Flex css={{ pt: '$4', borderBottom: '1px solid $gray3' }}>
        <Text css={{ pt: '$1', mr: '$3', width: 15 }} style="subtitle3">
          {rank}
        </Text>
        <Flex
          direction="column"
          css={{
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <Link
            href={`/${routePrefix}/collection/${topSellingCollection.id}`}
            style={{ display: 'inline-block', minWidth: 0 }}
            key={topSellingCollection.id}
          >
            <Flex justify="between" css={{ gap: '$3' }}>
              <Flex
                align="center"
                css={{ cursor: 'pointer', width: '100%', overflow: 'hidden' }}
              >
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
                    {mintData ? <ActiveMintTooltip /> : null}
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
                  Volume
                </Text>
                <Text style="subtitle3">
                  <FormatCryptoCurrency
                    // @ts-ignore
                    amount={topSellingCollection.volume}
                    textStyle="subtitle3"
                    logoHeight={14}
                  />
                </Text>
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
            collection={collection}
            topSellingCollection={topSellingCollection}
            isSmallDevice={isSmallDevice}
          />
        </Flex>
      </Flex>
    )
  } else
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
          <Text style="subtitle2">
            <FormatCryptoCurrency
              // @ts-ignore
              amount={topSellingCollection.volume}
              textStyle="subtitle2"
              logoHeight={14}
            />
          </Text>
        </TableCell>
        <TableCell>
          {mintData && mintPrice < floorAsk ? (
            mintPrice === 0 ? (
              <Text style="subtitle2">Free</Text>
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
          collection={collection}
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
  isSmallDevice,
}) => {
  const { routePrefix } = useMarketplaceChain()

  const mintData = collection?.mintStages?.find(
    (stage) => stage.kind === 'public'
  )

  const collectionImage = useMemo(() => {
    return optimizeImage(
      collection?.image || (topSellingCollection?.image as string),
      250
    )
  }, [collection?.image, topSellingCollection?.image])

  if (isSmallDevice) {
    return (
      <Flex css={{ pt: '$4', borderBottom: '1px solid $gray3' }}>
        <Text css={{ pt: '$1', mr: '$3', width: 15 }} style="subtitle3">
          {rank}
        </Text>
        <Flex direction="column" css={{ width: '100%', overflow: 'hidden' }}>
          <Link
            href={`/${routePrefix}/collection/${topSellingCollection.id}`}
            style={{ display: 'inline-block', minWidth: 0 }}
            key={topSellingCollection.id}
          >
            <Flex justify="between" css={{ gap: '$3' }}>
              <Flex
                align="center"
                css={{ cursor: 'pointer', width: '100%', overflow: 'hidden' }}
              >
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
                    {mintData ? <ActiveMintTooltip /> : null}
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
                  Volume
                </Text>
                <Text style="subtitle3">
                  <FormatCryptoCurrency
                    // @ts-ignore
                    amount={topSellingCollection.volume}
                    textStyle="subtitle3"
                    logoHeight={14}
                  />
                </Text>
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
            collection={collection}
            topSellingCollection={topSellingCollection}
            isSmallDevice={isSmallDevice}
          />
        </Flex>
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
          <Text style="subtitle2">
            <FormatCryptoCurrency
              // @ts-ignore
              amount={topSellingCollection.volume}
              textStyle="subtitle2"
              logoHeight={14}
            />
          </Text>
        </TableCell>
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
          collection={collection}
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
  const { routePrefix } = useMarketplaceChain()

  const mintData = collection?.mintStages?.find(
    (stage) => stage.kind === 'public'
  )
  const mintPrice = mintData?.price?.amount?.decimal || 0

  const collectionImage = useMemo(() => {
    return optimizeImage(
      collection?.image || (topSellingCollection?.image as string),
      250
    )
  }, [collection?.image, topSellingCollection?.image])

  if (isSmallDevice) {
    return (
      <Flex css={{ pt: '$4', borderBottom: '1px solid $gray3' }}>
        <Text css={{ pt: '$1', mr: '$3', width: 15 }} style="subtitle3">
          {rank}
        </Text>
        <Flex direction="column" css={{ width: '100%', overflow: 'hidden' }}>
          <Link
            href={`/${routePrefix}/collection/${topSellingCollection.id}`}
            style={{ display: 'inline-block', minWidth: 0 }}
            key={topSellingCollection.id}
          >
            <Flex justify="between" css={{ gap: '$3' }}>
              <Flex
                align="center"
                css={{ cursor: 'pointer', width: '100%', overflow: 'hidden' }}
              >
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
                    {mintData ? <ActiveMintTooltip /> : null}
                  </Flex>
                  <Flex align="center">
                    <Text css={{ mr: '$1', color: '$gray11' }} style="body3">
                      Mint Price
                    </Text>
                    {mintData ? (
                      mintPrice === 0 ? (
                        <Text style="body3">Free</Text>
                      ) : (
                        <FormatCryptoCurrency
                          amount={mintPrice}
                          textStyle="body3"
                          logoHeight={14}
                        />
                      )
                    ) : (
                      '-'
                    )}
                  </Flex>
                </Box>
              </Flex>
              <Flex direction="column" css={{ gap: '$2' }}>
                <Text style="subtitle3" color="subtle">
                  Volume
                </Text>
                <Text style="subtitle3">
                  <FormatCryptoCurrency
                    // @ts-ignore
                    amount={topSellingCollection.volume}
                    textStyle="subtitle3"
                    logoHeight={14}
                  />
                </Text>
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
            collection={collection}
            topSellingCollection={topSellingCollection}
            isSmallDevice={isSmallDevice}
          />
        </Flex>
      </Flex>
    )
  }
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
        <Text style="subtitle2">
          <FormatCryptoCurrency
            // @ts-ignore
            amount={topSellingCollection.volume}
            textStyle="subtitle2"
            logoHeight={14}
          />
        </Text>
      </TableCell>
      <TableCell>
        {mintData ? (
          mintPrice === 0 ? (
            <Text style="subtitle2">Free</Text>
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
        collection={collection}
        topSellingCollection={topSellingCollection}
        isSmallDevice={isSmallDevice}
      />
    </TableRow>
  )
}

const anyHeadings = [
  'Collection',
  'Volume',
  'Floor Price (Including Mints)',
  'Sales',
  'Recent Activity',
]
const mintHeadings = [
  'Collection',
  'Volume',
  'Mint Price',
  'Sales',
  'Recent Activity',
]
const saleHeadings = [
  'Collection',
  'Volume',
  'Floor Price',
  'Sales',
  'Recent Activity',
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
      columns = fiveTemplateColumns
      break
    case 'sale':
      headings = saleHeadings
      columns = fiveTemplateColumns
      break
    case 'any':
    default:
      headings = anyHeadings
      columns = fiveTemplateColumns
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
