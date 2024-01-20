import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTrendingCollections } from '@reservoir0x/reservoir-kit-ui'
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
import { PercentChange } from 'components/primitives/PercentChange'
import { useMarketplaceChain } from 'hooks'
import Link from 'next/link'
import { ComponentPropsWithoutRef, FC, useMemo } from 'react'
import { useMediaQuery } from 'react-responsive'
import optimizeImage from 'utils/optimizeImage'

type TrendingCollections = NonNullable<
  ReturnType<typeof useTrendingCollections>['data']
>

type Props = {
  collections: TrendingCollections
  loading?: boolean
  volumeKey: keyof NonNullable<TrendingCollections[0]['collectionVolume']>
}
const gridColumns = {
  gridTemplateColumns: '520px repeat(5, 0.5fr) 250px',
  '@md': {
    gridTemplateColumns: '420px 1fr 1fr 1fr',
  },

  '@lg': {
    gridTemplateColumns: '360px repeat(5, 0.5fr) 250px',
  },

  '@xl': {
    gridTemplateColumns: '520px repeat(5, 0.5fr) 250px',
  },
}

export const CollectionRankingsTable: FC<Props> = ({
  collections,
  loading,
  volumeKey,
}) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })

  return (
    <>
      {!loading && collections.length === 0 ? (
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
        <Flex direction="column" css={{ width: '100%', pb: '$2' }}>
          {isSmallDevice ? (
            <Flex
              justify="between"
              css={{ mb: '$4', '@md': { display: 'none' } }}
            >
              <Text style="subtitle3" color="subtle">
                Collection
              </Text>
              <Text style="subtitle3" color="subtle">
                {`${volumeKey.replace('day', 'D')} `}
                Volume
              </Text>
            </Flex>
          ) : (
            <TableHeading volumeKey={volumeKey} />
          )}
          <Flex direction="column" css={{ position: 'relative' }}>
            {collections.map((collection, i) => {
              return (
                <RankingsTableRow
                  key={collection.id}
                  collection={collection}
                  rank={i + 1}
                  volumeKey={volumeKey}
                />
              )
            })}
          </Flex>
        </Flex>
      )}
    </>
  )
}

type RankingsTableRowProps = {
  collection: TrendingCollections[0]
  rank: number
  volumeKey: ComponentPropsWithoutRef<
    typeof CollectionRankingsTable
  >['volumeKey']
}

const RankingsTableRow: FC<RankingsTableRowProps> = ({
  collection,
  rank,
  volumeKey,
}) => {
  const { routePrefix } = useMarketplaceChain()
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })

  const collectionImage = useMemo(() => {
    return optimizeImage(collection.image as string, 250)
  }, [collection.image])

  if (isSmallDevice) {
    return (
      <Link
        href={`/${routePrefix}/collection/${collection.id}`}
        style={{ display: 'inline-block', minWidth: 0, marginBottom: 24 }}
        key={collection.id}
      >
        <Flex align="center" css={{ cursor: 'pointer' }}>
          <Text css={{ mr: '$4', minWidth: 20 }} style="h6" color="subtle">
            {rank}
          </Text>
          <Img
            src={collectionImage}
            css={{ borderRadius: 8, width: 52, height: 52, objectFit: 'cover' }}
            alt="Collection Image"
            width={48}
            height={48}
            unoptimized
          />
          <Box css={{ ml: '$4', width: '100%', minWidth: 0 }}>
            <Flex align="center" css={{ gap: '$1', mb: 4, maxWidth: '80%' }}>
              <Text
                css={{
                  display: 'inline-block',
                }}
                style="subtitle1"
                ellipsify
              >
                {collection?.name}
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
          <Flex direction="column" align="end" css={{ gap: '$1' }}>
            <FormatCryptoCurrency
              amount={collection?.collectionVolume?.[volumeKey]}
              maximumFractionDigits={1}
              logoHeight={16}
              textStyle="subtitle1"
            />
            {volumeKey !== 'allTime' && (
              <PercentChange
                value={collection?.volumeChange?.[volumeKey]}
                decimals={1}
              />
            )}
          </Flex>
        </Flex>
      </Link>
    )
  } else {
    return (
      <TableRow
        key={collection.id}
        css={{
          ...gridColumns,
        }}
      >
        <TableCell css={{ minWidth: 0 }}>
          <Link
            href={`/${routePrefix}/collection/${collection.id}`}
            style={{ display: 'inline-block', width: '100%', minWidth: 0 }}
          >
            <Flex
              align="center"
              css={{
                gap: '$4',
                cursor: 'pointer',
                minWidth: 0,
                overflow: 'hidden',
                width: '100$',
              }}
            >
              <Text css={{ minWidth: 15 }} style="h6" color="subtle">
                {rank}
              </Text>
              <Img
                src={collectionImage}
                css={{
                  borderRadius: 8,
                  width: 52,
                  height: 52,
                  objectFit: 'cover',
                }}
                alt="Collection Image"
                width={52}
                height={52}
                unoptimized
              />

              <Flex css={{ gap: '$1', minWidth: 0 }} align="center">
                <Text
                  css={{
                    display: 'inline-block',
                    minWidth: 0,
                  }}
                  style="h6"
                  ellipsify
                >
                  {collection?.name}
                </Text>
                <OpenSeaVerified
                  openseaVerificationStatus={
                    collection?.openseaVerificationStatus
                  }
                />
              </Flex>
            </Flex>
          </Link>
        </TableCell>
        <TableCell>
          <Flex
            direction="column"
            align="start"
            justify="start"
            css={{ height: '100%' }}
          >
            <FormatCryptoCurrency
              amount={collection?.floorAsk?.price?.amount?.decimal}
              address={collection?.floorAsk?.price?.currency?.contract}
              decimals={collection?.floorAsk?.price?.currency?.decimals}
              textStyle="subtitle1"
              logoHeight={14}
            />
          </Flex>
        </TableCell>
        <TableCell>
          <Flex
            direction="column"
            align="start"
            justify="start"
            css={{ height: '100%' }}
          >
            <FormatCryptoCurrency
              amount={collection?.collectionVolume?.[volumeKey]}
              textStyle="subtitle1"
              logoHeight={14}
            />
          </Flex>
        </TableCell>
        <TableCell desktopOnly>
          {collection?.volumeChange?.['1day'] ? (
            <PercentChange
              style="subtitle1"
              value={collection?.volumeChange?.['1day']}
            />
          ) : (
            '-'
          )}
        </TableCell>
        <TableCell desktopOnly>
          {collection?.volumeChange?.['7day'] ? (
            <PercentChange
              style="subtitle1"
              value={collection?.volumeChange?.['7day']}
            />
          ) : (
            '-'
          )}
        </TableCell>
        <TableCell desktopOnly>
          <Text style="subtitle1">
            {Number(collection?.tokenCount)?.toLocaleString()}
          </Text>
        </TableCell>
        <TableCell desktopOnly>
          <Flex
            css={{
              gap: '$2',
              minWidth: 0,
            }}
            justify={'end'}
          >
            {collection?.sampleImages?.map((image, i) => {
              if (image) {
                return (
                  <img
                    key={image + i}
                    src={optimizeImage(image, 104)}
                    loading="lazy"
                    style={{
                      borderRadius: 8,
                      width: 52,
                      height: 52,
                      objectFit: 'cover',
                    }}
                    onError={(
                      e: React.SyntheticEvent<HTMLImageElement, Event>
                    ) => {
                      e.currentTarget.style.visibility = 'hidden'
                    }}
                  />
                )
              }
              return null
            })}
          </Flex>
        </TableCell>
      </TableRow>
    )
  }
}

const headings = [
  'Collection',
  'Floor Price',
  'Volume',
  '1D Change',
  '7D Change',
  'Supply',
  'Sample Tokens',
]

const TableHeading: React.FC<Pick<Props, 'volumeKey'>> = ({ volumeKey }) => (
  <HeaderRow
    css={{
      display: 'none',
      ...gridColumns,
      '@md': { display: 'grid', ...gridColumns['@md'] },
      position: 'sticky',
      top: NAVBAR_HEIGHT,
      backgroundColor: '$neutralBg',
      zIndex: 1,
    }}
  >
    {headings.map((heading, i) => (
      <TableCell
        desktopOnly={i > 2}
        key={heading}
        css={{ textAlign: i === headings.length - 1 ? 'right' : 'left' }}
      >
        <Text style="subtitle3" color="subtle">
          {heading === 'Volume' && `${volumeKey.replace('day', 'D')} `}
          {heading}
        </Text>
      </TableCell>
    ))}
  </HeaderRow>
)
