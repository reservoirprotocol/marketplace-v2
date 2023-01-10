import { FC, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import {
  Text,
  Flex,
  TableCell,
  TableRow,
  HeaderRow,
  FormatCryptoCurrency,
  Box,
} from '../primitives'
import Image from 'next/image'
import { useIntersectionObserver } from 'usehooks-ts'
import LoadingSpinner from '../common/LoadingSpinner'
import Link from 'next/link'
import { Address } from 'wagmi'
import { useUserCollections } from '@reservoir0x/reservoir-kit-ui'
import { useMounted } from 'hooks'
import CollectionsTableTimeToggle, {
  CollectionsTableSortingOption,
} from './CollectionsTableTimeToggle'
import round from 'utils/round'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

type Props = {
  address: Address | undefined
}
const mobileTemplateColumns = '1.4fr repeat(2, 1fr)'
const desktopTemplateColumns = '1.26fr repeat(4, 1fr)'

export const CollectionsTable: FC<Props> = ({ address }) => {
  const isMounted = useMounted()
  const compactToggleNames = useMediaQuery({ query: '(max-width: 800px)' })
  const [sortByTime, setSortByTime] =
    useState<CollectionsTableSortingOption>('allTime')

  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {
    rootMargin: '0px 0px 300px 0px',
  })

  const {
    data: collections,
    fetchNextPage,
    isFetchingPage,
    isValidating,
  } = useUserCollections(address as string, { includeTopBid: true })

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      fetchNextPage()
    }
  }, [loadMoreObserver?.isIntersecting])

  return (
    <>
      {!isValidating &&
      !isFetchingPage &&
      collections &&
      collections.length === 0 ? (
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
        <Flex direction="column" css={{ width: '100%' }}>
          <CollectionsTableTimeToggle
            compact={compactToggleNames && isMounted}
            option={sortByTime}
            onOptionSelected={(option) => {
              setSortByTime(option)
            }}
          />
          <TableHeading />
          {collections.map((collection, i) => {
            return (
              <CollectionTableRow
                key={`${collection?.collection?.id}-${i}`}
                collection={collection}
                sortByTime={sortByTime}
              />
            )
          })}
          <div ref={loadMoreRef}></div>
        </Flex>
      )}
      {isValidating && (
        <Flex align="center" justify="center" css={{ py: '$6' }}>
          <LoadingSpinner />
        </Flex>
      )}
    </>
  )
}

type OfferTableRowProps = {
  collection: ReturnType<typeof useUserCollections>['data'][0]
  sortByTime: CollectionsTableSortingOption
}

const CollectionTableRow: FC<OfferTableRowProps> = ({
  collection,
  sortByTime,
}) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })

  if (isSmallDevice) {
    return (
      <TableRow
        key={collection?.collection?.id}
        css={{ gridTemplateColumns: mobileTemplateColumns }}
      >
        <TableCell css={{ minWidth: 0 }}>
          <Link href={`/collections/${collection?.collection?.id}`}>
            <Flex align="center">
              {collection?.collection?.image && (
                <Image
                  style={{
                    borderRadius: '4px',
                    objectFit: 'cover',
                    aspectRatio: '1/1',
                  }}
                  loader={({ src }) => src}
                  src={collection?.collection?.image}
                  alt={`${collection?.collection?.name}`}
                  width={36}
                  height={36}
                />
              )}
              <Text
                style="subtitle3"
                ellipsify
                css={{ color: '$gray11', ml: '$2' }}
              >
                {collection?.collection?.name}
              </Text>
            </Flex>
          </Link>
        </TableCell>
        <TableCell css={{ minWidth: 0 }}>
          <Flex
            direction="column"
            align="start"
            css={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <FormatCryptoCurrency
              amount={collection?.collection?.volume?.[sortByTime]}
              maximumFractionDigits={3}
              textStyle="subtitle2"
              logoHeight={14}
              css={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            />
            {sortByTime != 'allTime' &&
              collection?.collection?.volumeChange && (
                <PercentChange
                  percent={
                    collection?.collection?.volumeChange[sortByTime] as number
                  }
                />
              )}
          </Flex>
        </TableCell>
        <TableCell css={{ minWidth: 'max-content' }}>
          <Text style="subtitle2" css={{ minWidth: 'max-content' }}>
            <FormatCryptoCurrency
              amount={collection?.collection?.topBidValue}
              maximumFractionDigits={3}
              textStyle="subtitle2"
              logoHeight={14}
            />
          </Text>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableRow
      key={collection?.collection?.id}
      css={{ gridTemplateColumns: desktopTemplateColumns }}
    >
      <TableCell css={{ minWidth: 0 }}>
        <Link href={`/collections/${collection?.collection?.id}`}>
          <Flex align="center">
            {collection?.collection?.image && (
              <Image
                style={{
                  borderRadius: '4px',
                  objectFit: 'cover',
                  aspectRatio: '1/1',
                }}
                loader={({ src }) => src}
                src={collection?.collection?.image}
                alt={`${collection?.collection?.name}`}
                width={48}
                height={48}
              />
            )}
            <Text
              style="subtitle3"
              ellipsify
              css={{ color: '$gray11', ml: '$2' }}
            >
              {collection?.collection?.name}
            </Text>
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
            amount={collection?.collection?.volume?.[sortByTime]}
            textStyle="subtitle2"
            logoHeight={14}
          />
          {sortByTime != 'allTime' && collection?.collection?.volumeChange && (
            <PercentChange
              percent={
                collection?.collection?.volumeChange[sortByTime] as number
              }
            />
          )}
        </Flex>
      </TableCell>
      <TableCell>
        <Text style="subtitle2">
          <FormatCryptoCurrency
            amount={collection?.collection?.topBidValue}
            textStyle="subtitle2"
            logoHeight={14}
          />
        </Text>
      </TableCell>
      <TableCell>
        <FormatCryptoCurrency
          amount={collection?.collection?.floorAskPrice}
          textStyle="subtitle2"
          logoHeight={14}
        />
      </TableCell>
      <TableCell>
        <Text style="subtitle2">{collection?.ownership?.tokenCount}</Text>
      </TableCell>
    </TableRow>
  )
}

const TableHeading = () => (
  <HeaderRow
    css={{
      gridTemplateColumns: mobileTemplateColumns,
      '@md': {
        display: 'grid',
        gridTemplateColumns: desktopTemplateColumns,
      },
    }}
  >
    <TableCell>
      <Text
        style="subtitle3"
        css={{ display: 'none', '@md': { display: 'block' } }}
        subtleColor
      >
        Collection
      </Text>
    </TableCell>
    <TableCell>
      <Text style="subtitle3" subtleColor>
        Volume
      </Text>
    </TableCell>
    <TableCell>
      <Text style="subtitle3" subtleColor>
        Top Offer
      </Text>
    </TableCell>
    <TableCell css={{ display: 'none', '@md': { display: 'grid' } }}>
      <Text style="subtitle3" subtleColor>
        Floor Price
      </Text>
    </TableCell>
    <TableCell css={{ display: 'none', '@md': { display: 'grid' } }}>
      <Text style="subtitle3" subtleColor>
        Owned
      </Text>
    </TableCell>
  </HeaderRow>
)

type PercentChangeProps = {
  percent: number
}

const PercentChange = ({ percent }: PercentChangeProps) => {
  const isPositive = round(percent, 2) >= 0

  return (
    <Flex css={{ color: isPositive ? '$green9' : '$red9' }} align="center">
      <Text
        style="subtitle3"
        css={{
          color: isPositive ? '$green11' : '$red11',
          ml: '$1',
        }}
      >
        {isPositive ? '' : '- '} {round(percent, 2)}%
      </Text>
    </Flex>
  )
}
