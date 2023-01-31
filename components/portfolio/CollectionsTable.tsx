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
import { useMarketplaceChain, useMounted } from 'hooks'
import CollectionsTableTimeToggle, {
  CollectionsTableSortingOption,
} from './CollectionsTableTimeToggle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { COLLECTION_SET_ID, COMMUNITY } from 'pages/_app'
import { PercentChange } from 'components/primitives/PercentChange'
import { NAVBAR_HEIGHT } from 'components/navbar'

type Props = {
  address: Address | undefined
}
const mobileTemplateColumns = '1.4fr repeat(2, 1fr)'
const desktopTemplateColumns = '1.26fr repeat(4, 1fr)'

export const CollectionsTable: FC<Props> = ({ address }) => {
  const isMounted = useMounted()
  const compactToggleNames = useMediaQuery({ query: '(max-width: 800px)' })
  const [sortByTime, setSortByTime] =
    useState<CollectionsTableSortingOption>('1day')

  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {
    rootMargin: '0px 0px 300px 0px',
  })

  const collectionQuery: Parameters<typeof useUserCollections>['1'] = {
    includeTopBid: true,
  }

  if (COLLECTION_SET_ID) {
    collectionQuery.collectionsSetId = COLLECTION_SET_ID
  } else if (COMMUNITY) {
    collectionQuery.community = COMMUNITY
  }

  const {
    data: collections,
    fetchNextPage,
    isFetchingPage,
    isValidating,
  } = useUserCollections(address as string, collectionQuery)

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
        <Flex direction="column" css={{ width: '100%', pb: '$2' }}>
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
          <Box ref={loadMoreRef} css={{ height: 20 }}></Box>
        </Flex>
      )}
      {isValidating && (
        <Flex align="center" justify="center" css={{ py: '$5' }}>
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
  const { routePrefix } = useMarketplaceChain()

  if (isSmallDevice) {
    return (
      <TableRow
        key={collection?.collection?.id}
        css={{ gridTemplateColumns: mobileTemplateColumns }}
      >
        <TableCell css={{ minWidth: 0 }}>
          <Link
            href={`/collection/${routePrefix}/${collection?.collection?.id}`}
          >
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
                  value={collection?.collection?.volumeChange[sortByTime]}
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
        <Link href={`/collection/${routePrefix}/${collection?.collection?.id}`}>
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
            <Text style="subtitle2" ellipsify css={{ ml: '$2' }}>
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
              value={collection?.collection?.volumeChange[sortByTime]}
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
        position: 'sticky',
        top: NAVBAR_HEIGHT,
        backgroundColor: '$neutralBg',
      },
    }}
  >
    <TableCell>
      <Text
        style="subtitle3"
        css={{ display: 'none', '@md': { display: 'block' } }}
        color="subtle"
      >
        Collection
      </Text>
    </TableCell>
    <TableCell>
      <Text style="subtitle3" color="subtle">
        Volume
      </Text>
    </TableCell>
    <TableCell>
      <Text style="subtitle3" color="subtle">
        Top Offer
      </Text>
    </TableCell>
    <TableCell css={{ display: 'none', '@md': { display: 'grid' } }}>
      <Text style="subtitle3" color="subtle">
        Floor Price
      </Text>
    </TableCell>
    <TableCell css={{ display: 'none', '@md': { display: 'grid' } }}>
      <Text style="subtitle3" color="subtle">
        Owned
      </Text>
    </TableCell>
  </HeaderRow>
)
