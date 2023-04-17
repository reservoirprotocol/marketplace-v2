import { FC, useContext, useEffect, useRef, useState } from 'react'
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
import { PercentChange } from 'components/primitives/PercentChange'
import { NAVBAR_HEIGHT } from 'components/navbar'
import { ChainContext } from 'context/ChainContextProvider'
import { gql } from '__generated__'
import { useQuery } from '@apollo/client'
import { Collection_OrderBy } from '__generated__/graphql'

type Collection = {
  id: string,
  name: string,
  totalTokens: number,
  // TO-DO: update later
  image?: string,
  volume?: any
  volumeChange?: any
  topBidValue?: any
  floorAskPrice?: any
}

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
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})

  const GET_USER_COLLECTIONS = gql(/* GraphQL */`
  query GetUserCollections($first: Int, $skip: Int $orderDirection: OrderDirection, $collection_orderBy: Collection_orderBy, $where: Collection_FilterArgs) {
    collections(first: $first, skip: $skip, orderDirection: $orderDirection, collection_orderBy: $collection_orderBy, where: $where) {
      id
      name
      totalTokens
    }
  }
`);
  const { data, loading, fetchMore } = useQuery(GET_USER_COLLECTIONS, {
    variables: {
      first: 10,
      skip: 0,
      collection_orderBy: Collection_OrderBy.TotalTokens,
      where: { owner: address?.toLocaleLowerCase() }
    }
  })
  const collections = data?.collections || []

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      fetchMore({ variables: { skip: data?.collections.length || 0 }})
    }
  }, [loadMoreObserver?.isIntersecting])

  return (
    <>
      {!loading &&
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
                key={`${collection?.id}-${i}`}
                collection={collection}
                sortByTime={sortByTime}
              />
            )
          })}
          <Box ref={loadMoreRef} css={{ height: 20 }}></Box>
        </Flex>
      )}
      {loading && (
        <Flex align="center" justify="center" css={{ py: '$5' }}>
          <LoadingSpinner />
        </Flex>
      )}
    </>
  )
}

type CollectionTableRowProps = {
  collection: Collection
  sortByTime: CollectionsTableSortingOption
}

const CollectionTableRow: FC<CollectionTableRowProps> = ({
  collection,
  sortByTime,
}) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })
  const { routePrefix } = useMarketplaceChain()

  if (isSmallDevice) {
    return (
      <TableRow
        key={collection?.id}
        css={{ gridTemplateColumns: mobileTemplateColumns }}
      >
        <TableCell css={{ minWidth: 0 }}>
          <Link
            href={`/collection/${routePrefix}/${collection?.id}`}
          >
            <Flex align="center">
              {collection?.image && (
                <Image
                  style={{
                    borderRadius: '4px',
                    objectFit: 'cover',
                    aspectRatio: '1/1',
                  }}
                  loader={({ src }) => src}
                  src={collection?.image}
                  alt={`${collection?.name}`}
                  width={36}
                  height={36}
                />
              )}
              <Text
                style="subtitle3"
                ellipsify
                css={{ color: '$gray11', ml: '$2' }}
              >
                {collection?.name}
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
              amount={collection?.volume?.[sortByTime]}
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
              collection?.volumeChange && (
                <PercentChange
                  value={collection?.volumeChange[sortByTime]}
                />
              )}
          </Flex>
        </TableCell>
        <TableCell css={{ minWidth: 'max-content' }}>
          <Text style="subtitle2" css={{ minWidth: 'max-content' }}>
            <FormatCryptoCurrency
              amount={collection?.topBidValue}
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
      key={collection?.id}
      css={{ gridTemplateColumns: desktopTemplateColumns }}
    >
      <TableCell css={{ minWidth: 0 }}>
        <Link href={`/collection/${collection?.id}`}>
          <Flex align="center">
            {collection?.image && (
              <Image
                style={{
                  borderRadius: '4px',
                  objectFit: 'cover',
                  aspectRatio: '1/1',
                }}
                loader={({ src }) => src}
                src={collection?.image}
                alt={`${collection?.name}`}
                width={48}
                height={48}
              />
            )}
            <Text style="subtitle2" ellipsify css={{ ml: '$2' }}>
              {collection?.name}
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
            amount={collection?.volume?.[sortByTime]}
            textStyle="subtitle2"
            logoHeight={14}
          />
          {sortByTime != 'allTime' && collection?.volumeChange && (
            <PercentChange
              value={collection?.volumeChange[sortByTime]}
            />
          )}
        </Flex>
      </TableCell>
      <TableCell>
        <Text style="subtitle2">
          <FormatCryptoCurrency
            amount={collection?.topBidValue}
            textStyle="subtitle2"
            logoHeight={14}
          />
        </Text>
      </TableCell>
      <TableCell>
        <FormatCryptoCurrency
          amount={collection?.floorAskPrice}
          textStyle="subtitle2"
          logoHeight={14}
        />
      </TableCell>
      <TableCell>
        <Text style="subtitle2">{collection?.totalTokens}</Text>
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
    <TableCell css={{ display: 'none', '@md': { display: 'grid' } }}>
      <Text style="subtitle3" color="subtle">
        Top Offer
      </Text>
    </TableCell>
    <TableCell>
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
