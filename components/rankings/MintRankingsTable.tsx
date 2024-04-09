import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTrendingMints } from '@reservoir0x/reservoir-kit-ui'
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
import Link from 'next/link'
import { FC, useMemo } from 'react'
import { useMediaQuery } from 'react-responsive'
import optimizeImage from 'utils/optimizeImage'

type Props = {
  mints: NonNullable<ReturnType<typeof useTrendingMints>['data']>
  loading?: boolean
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

export const MintRankingsTable: FC<Props> = ({ mints, loading }) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })

  return (
    <>
      {!loading && mints && mints.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          css={{ py: '$6', gap: '$4', width: '100%' }}
        >
          <Text css={{ color: '$gray11' }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} size="2xl" />
          </Text>
          <Text css={{ color: '$gray11' }}>No mints found</Text>
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
                Total Mints
              </Text>
            </Flex>
          ) : (
            <TableHeading />
          )}
          <Flex direction="column" css={{ position: 'relative' }}>
            {mints?.map((mint, i) => (
              <RankingsTableRow mint={mint} rank={(i += 1)} />
            ))}
          </Flex>
        </Flex>
      )}
    </>
  )
}

type RankingsTableRowProps = {
  mint: NonNullable<ReturnType<typeof useTrendingMints>['data']>[0]
  rank: number
}

const RankingsTableRow: FC<RankingsTableRowProps> = ({ mint, rank }) => {
  const { routePrefix } = useMarketplaceChain()
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })

  const collectionImage = useMemo(() => {
    return optimizeImage(mint?.image || mint?.sampleImages?.[0], 250)
  }, [mint.image])

  const mintPrice = mint.mintPrice

  const sampleImages: string[] = mint?.sampleImages || []

  if (isSmallDevice) {
    return (
      <Link
        href={`/${routePrefix}/collection/${mint.id}`}
        style={{ display: 'inline-block', minWidth: 0, marginBottom: 24 }}
        key={mint.id}
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
                {mint?.name}
              </Text>
              <OpenSeaVerified
                openseaVerificationStatus={mint?.openseaVerificationStatus}
              />
            </Flex>
            <Flex align="center">
              <Text css={{ mr: '$1', color: '$gray11' }} style="body3"></Text>
              <FormatCryptoCurrency
                amount={mint?.floorAsk?.price?.amount?.decimal}
                address={mint?.floorAsk?.price?.currency?.contract}
                decimals={mint?.floorAsk?.price?.currency?.decimals}
                logoHeight={16}
                maximumFractionDigits={2}
                textStyle="subtitle2"
              />
            </Flex>
          </Box>
          <Flex direction="column" align="end" css={{ gap: '$1' }}>
            <Text style="subtitle1">{mint?.mintCount?.toLocaleString()}</Text>
          </Flex>
        </Flex>
      </Link>
    )
  } else {
    return (
      <TableRow
        key={mint.id}
        css={{
          ...gridColumns,
        }}
      >
        <TableCell css={{ minWidth: 0 }}>
          <Link
            href={`/${routePrefix}/collection/${mint.id}`}
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
                  {mint?.name}
                </Text>
                <OpenSeaVerified
                  openseaVerificationStatus={mint?.openseaVerificationStatus}
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
            {mintPrice ? (
              <FormatCryptoCurrency
                amount={mintPrice}
                textStyle="subtitle1"
                logoHeight={14}
              />
            ) : (
              '-'
            )}
          </Flex>
        </TableCell>
        <TableCell>
          <Flex>
            <FormatCryptoCurrency
              amount={mint?.floorAsk?.price?.amount?.decimal}
              address={mint?.floorAsk?.price?.currency?.contract}
              decimals={mint?.floorAsk?.price?.currency?.decimals}
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
            <Text style="subtitle1">{mint?.mintCount?.toLocaleString()}</Text>
          </Flex>
        </TableCell>

        <TableCell desktopOnly>
          <Text style="subtitle1">{mint?.oneHourCount?.toLocaleString()}</Text>
        </TableCell>

        <TableCell desktopOnly>
          <Text style="subtitle1">{mint?.sixHourCount?.toLocaleString()}</Text>
        </TableCell>

        <TableCell desktopOnly>
          <Flex
            css={{
              gap: '$2',
              minWidth: 0,
            }}
            justify={'end'}
          >
            {/** */}
            {sampleImages.map((image: string, i) => {
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
  'Mint Price',
  'Floor Price',
  'Total Mints',
  '1h Mints',
  '6h Mints',
  'Recent Mints',
]

const TableHeading = () => (
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
        desktopOnly={i > 3}
        key={heading}
        css={{ textAlign: i === headings.length - 1 ? 'right' : 'left' }}
      >
        <Text style="subtitle3" color="subtle">
          {heading}
        </Text>
      </TableCell>
    ))}
  </HeaderRow>
)
