import { FC, useContext, useEffect, useRef } from 'react'
import { useMediaQuery } from 'react-responsive'
import {
  Text,
  Flex,
  TableCell,
  TableRow,
  HeaderRow,
  Tooltip,
  FormatCryptoCurrency,
  Button,
  Box,
} from '../primitives'
import { List, AcceptBid } from 'components/buttons'
import Image from 'next/image'
import { useIntersectionObserver } from 'usehooks-ts'
import LoadingSpinner from '../common/LoadingSpinner'
import {
  EditListingModal,
  useTokens,
  useUserTokens,
} from '@reservoir0x/reservoir-kit-ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBolt,
  faCircleInfo,
  faEdit,
  faEllipsis,
  faGasPump,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { MutatorCallback } from 'swr'
import { Address } from 'wagmi'
import { useMarketplaceChain } from 'hooks'
import { NAVBAR_HEIGHT } from 'components/navbar'
import { ChainContext } from 'context/ChainContextProvider'
import { Dropdown, DropdownMenuItem } from 'components/primitives/Dropdown'
import { PortfolioSortingOption } from 'components/common/PortfolioSortDropdown'
import { zoneAddresses } from 'utils/zoneAddresses'
import CancelListing from 'components/buttons/CancelListing'

type Props = {
  address: Address | undefined
  filterCollection: string | undefined
  sortBy: PortfolioSortingOption
  isLoading?: boolean
}

const desktopTemplateColumns = '1.25fr repeat(3, .75fr) 1.5fr'

export const TokenTable: FC<Props> = ({
  address,
  isLoading,
  sortBy,
  filterCollection,
}) => {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})

  let tokenQuery: Parameters<typeof useUserTokens>['1'] = {
    limit: 20,
    sortBy: sortBy,
    collection: filterCollection,
    includeTopBid: true,
    includeRawData: true,
  }

  const { chain } = useContext(ChainContext)

  if (chain.collectionSetId) {
    tokenQuery.collectionsSetId = chain.collectionSetId
  } else if (chain.community) {
    tokenQuery.community = chain.community
  }

  const {
    data: tokens,
    fetchNextPage,
    mutate,
    isFetchingPage,
    isValidating,
  } = useUserTokens(address, tokenQuery, {})

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      fetchNextPage()
    }
  }, [loadMoreObserver?.isIntersecting])

  return (
    <>
      {!isValidating && !isFetchingPage && tokens && tokens.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          css={{ py: '$6', gap: '$4', width: '100%' }}
        >
          <Text css={{ color: '$gray11' }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} size="2xl" />
          </Text>
          <Text css={{ color: '$gray11' }}>No items found</Text>
        </Flex>
      ) : (
        <Flex direction="column" css={{ width: '100%' }}>
          {isLoading ? null : (
            <>
              <TableHeading />
              {tokens.map((token, i) => {
                if (!token) return null

                return (
                  <TokenTableRow
                    key={`${token.token?.tokenId}-${i}`}
                    token={token}
                    mutate={mutate}
                  />
                )
              })}
            </>
          )}
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

type TokenTableRowProps = {
  token: ReturnType<typeof useUserTokens>['data'][0]
  mutate?: MutatorCallback
}

const TokenTableRow: FC<TokenTableRowProps> = ({ token, mutate }) => {
  const { routePrefix } = useMarketplaceChain()
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })

  let imageSrc: string = (
    token?.token?.tokenId
      ? token?.token?.image || token?.token?.collection?.imageUrl
      : token?.token?.collection?.imageUrl
  ) as string

  const orderZone = token?.ownership?.floorAsk?.rawData?.zone
  const orderKind = token?.ownership?.floorAsk?.rawData?.kind

  const isOracleOrder =
    orderKind === 'seaport-v1.4' && zoneAddresses.includes(orderZone as string)

  if (isSmallDevice) {
    return (
      <Flex
        key={token?.token?.tokenId}
        direction="column"
        align="start"
        css={{
          gap: '$3',
          borderBottom: '1px solid $gray3',
          py: '$3',
          width: '100%',
          overflow: 'hidden',
          flex: 1,
        }}
      >
        <Link
          href={`/collection/${routePrefix}/${token?.token?.contract}/${token?.token?.tokenId}`}
        >
          <Flex align="center">
            {imageSrc && (
              <Image
                style={{
                  borderRadius: '4px',
                  objectFit: 'cover',
                  aspectRatio: '1/1',
                }}
                loader={({ src }) => src}
                src={imageSrc}
                alt={`${token?.token?.name}`}
                width={36}
                height={36}
              />
            )}
            <Flex
              direction="column"
              css={{
                ml: '$2',
                overflow: 'hidden',
                minWidth: 0,
              }}
            >
              <Text style="subtitle3" ellipsify color="subtle">
                {token?.token?.collection?.name}
              </Text>
              <Text style="subtitle2" ellipsify>
                #{token?.token?.tokenId}
              </Text>
            </Flex>
          </Flex>
        </Link>
        <Flex justify="between" css={{ width: '100%', gap: '$3' }}>
          <Flex direction="column" align="start" css={{ width: '100%' }}>
            <Text style="subtitle3" color="subtle">
              Net Floor
            </Text>
            <FormatCryptoCurrency
              amount={
                token?.token?.collection?.floorAskPrice?.netAmount?.decimal
              }
              address={
                token?.token?.collection?.floorAskPrice?.currency?.contract
              }
              decimals={
                token?.token?.collection?.floorAskPrice?.currency?.decimals
              }
              textStyle="subtitle2"
              logoHeight={14}
            />
            <List
              token={token as ReturnType<typeof useTokens>['data'][0]}
              mutate={mutate}
              buttonCss={{
                width: '100%',
                maxWidth: '300px',
                justifyContent: 'center',
                px: '42px',
                backgroundColor: '$gray3',
                color: '$gray12',
                mt: '$2',
                '&:hover': {
                  backgroundColor: '$gray4',
                },
              }}
              buttonChildren="List"
            />
          </Flex>
          <Flex direction="column" align="start" css={{ width: '100%' }}>
            <Text style="subtitle3" color="subtle">
              You Get
            </Text>
            <FormatCryptoCurrency
              amount={token?.token?.topBid?.price?.netAmount?.native}
              textStyle="subtitle2"
              logoHeight={14}
            />
            {token?.token?.topBid?.price?.amount?.decimal && (
              <AcceptBid
                token={token as ReturnType<typeof useTokens>['data'][0]}
                collectionId={token?.token?.contract}
                mutate={mutate}
                buttonCss={{
                  width: '100%',
                  maxWidth: '300px',
                  justifyContent: 'center',
                  px: '32px',
                  backgroundColor: '$primary9',
                  color: 'white',
                  mt: '$2',
                  '&:hover': {
                    backgroundColor: '$primary10',
                  },
                }}
                buttonChildren={
                  <Flex align="center" css={{ gap: '$2' }}>
                    <FontAwesomeIcon icon={faBolt} />
                    Sell
                  </Flex>
                }
              />
            )}
          </Flex>
        </Flex>
      </Flex>
    )
  }

  return (
    <TableRow
      key={token?.token?.tokenId}
      css={{ gridTemplateColumns: desktopTemplateColumns }}
    >
      <TableCell css={{ minWidth: 0 }}>
        <Link
          href={`/collection/${routePrefix}/${token?.token?.contract}/${token?.token?.tokenId}`}
        >
          <Flex align="center">
            {imageSrc && (
              <Image
                style={{
                  borderRadius: '4px',
                  objectFit: 'cover',
                  aspectRatio: '1/1',
                }}
                loader={({ src }) => src}
                src={imageSrc}
                alt={`${token?.token?.name}`}
                width={48}
                height={48}
              />
            )}
            <Flex
              direction="column"
              css={{
                ml: '$2',
                overflow: 'hidden',
              }}
            >
              <Flex justify="between" css={{ gap: '$2' }}>
                <Text style="subtitle3" ellipsify color="subtle">
                  {token?.token?.collection?.name}
                </Text>
                {token?.token?.kind === 'erc1155' &&
                  token?.ownership?.tokenCount && (
                    <Flex
                      justify="center"
                      align="center"
                      css={{
                        borderRadius: 9999,
                        backgroundColor: '$gray4',
                        maxWidth: '50%',
                      }}
                    >
                      <Text
                        ellipsify
                        style="subtitle3"
                        css={{ px: '$2', fontSize: 10 }}
                      >
                        x{token?.ownership?.tokenCount}
                      </Text>
                    </Flex>
                  )}
              </Flex>
              <Text style="subtitle2" ellipsify>
                #{token?.token?.tokenId}
              </Text>
            </Flex>
          </Flex>
        </Link>
      </TableCell>
      <TableCell>
        <FormatCryptoCurrency
          amount={token?.ownership?.floorAsk?.price?.amount?.decimal}
          textStyle="subtitle1"
          logoHeight={14}
        />
      </TableCell>
      <TableCell>
        <FormatCryptoCurrency
          amount={token?.token?.collection?.floorAskPrice?.netAmount?.decimal}
          address={token?.token?.collection?.floorAskPrice?.currency?.contract}
          decimals={token?.token?.collection?.floorAskPrice?.currency?.decimals}
          textStyle="subtitle1"
          logoHeight={14}
        />
      </TableCell>
      <TableCell>
        <FormatCryptoCurrency
          amount={token?.token?.topBid?.price?.netAmount?.native}
          address={token?.token?.topBid?.price?.currency?.contract}
          decimals={token?.token?.topBid?.price?.currency?.decimals}
          textStyle="subtitle1"
          logoHeight={14}
        />
      </TableCell>
      <TableCell>
        <Flex justify="end" css={{ gap: '$3' }}>
          {token?.token?.topBid?.price?.amount?.decimal && (
            <AcceptBid
              token={token as ReturnType<typeof useTokens>['data'][0]}
              collectionId={token?.token?.contract}
              buttonCss={{
                px: '32px',
                backgroundColor: '$primary9',
                color: 'white',
                '&:hover': {
                  backgroundColor: '$primary10',
                },
              }}
              buttonChildren={
                <Flex align="center" css={{ gap: '$2' }}>
                  <FontAwesomeIcon icon={faBolt} />
                  Sell
                </Flex>
              }
              mutate={mutate}
            />
          )}

          <List
            token={token as ReturnType<typeof useTokens>['data'][0]}
            buttonCss={{
              px: '42px',
              backgroundColor: '$gray3',
              color: '$gray12',
              '&:hover': {
                backgroundColor: '$gray4',
              },
            }}
            buttonChildren="List"
            mutate={mutate}
          />
          {token?.ownership?.floorAsk?.id ? (
            <Dropdown
              trigger={
                <Button
                  color="gray3"
                  size="xs"
                  css={{ width: 44, justifyContent: 'center' }}
                >
                  <FontAwesomeIcon icon={faEllipsis} />
                </Button>
              }
            >
              {isOracleOrder &&
              token?.ownership?.floorAsk?.id &&
              token?.token?.tokenId &&
              token?.token?.collection?.id ? (
                <EditListingModal
                  trigger={
                    <DropdownMenuItem css={{ py: '$3' }}>
                      <Flex align="center" css={{ gap: '$2' }}>
                        <Box css={{ color: '$gray10' }}>
                          <FontAwesomeIcon icon={faEdit} />
                        </Box>
                        <Text>Edit Listing</Text>
                      </Flex>
                    </DropdownMenuItem>
                  }
                  listingId={token?.ownership?.floorAsk?.id}
                  tokenId={token?.token?.tokenId}
                  collectionId={token?.token?.collection?.id}
                />
              ) : null}

              {token?.ownership?.floorAsk?.id ? (
                <CancelListing
                  listingId={token?.ownership?.floorAsk?.id as string}
                  mutate={mutate}
                  trigger={
                    <Flex>
                      {!isOracleOrder ? (
                        <Tooltip
                          content={
                            <Text style="body2" as="p">
                              Cancelling this order requires gas.
                            </Text>
                          }
                        >
                          <DropdownMenuItem css={{ py: '$3', width: '100%' }}>
                            <Flex align="center" css={{ gap: '$2' }}>
                              <Box css={{ color: '$gray10' }}>
                                <FontAwesomeIcon icon={faGasPump} />
                              </Box>
                              <Text color="error">Cancel</Text>
                            </Flex>
                          </DropdownMenuItem>
                        </Tooltip>
                      ) : (
                        <DropdownMenuItem css={{ py: '$3' }}>
                          <Text>Cancel</Text>
                        </DropdownMenuItem>
                      )}
                    </Flex>
                  }
                />
              ) : null}
            </Dropdown>
          ) : null}
        </Flex>
      </TableCell>
    </TableRow>
  )
}

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
    <TableCell>
      <Text style="subtitle3" color="subtle">
        Items
      </Text>
    </TableCell>
    <TableCell>
      <Text style="subtitle3" color="subtle">
        Listed Price
      </Text>
    </TableCell>
    <TableCell>
      <Flex align="center" css={{ gap: '$2' }}>
        <Text style="subtitle3" color="subtle">
          Net Floor
        </Text>
        <Tooltip
          content={
            <Flex>
              <Text style="body2" css={{ mx: '$2', maxWidth: '200px' }}>
                The floor price with royalties and fees removed. This is the eth
                you would receive if you listed at the floor.
              </Text>
            </Flex>
          }
        >
          <Text css={{ color: '$gray9' }}>
            <FontAwesomeIcon icon={faCircleInfo} width={12} height={12} />
          </Text>
        </Tooltip>
      </Flex>
    </TableCell>
    <TableCell>
      <Flex align="center" css={{ gap: '$2' }}>
        <Text style="subtitle3" color="subtle">
          You Get
        </Text>
        <Tooltip
          content={
            <Flex>
              <Text style="body2" css={{ mx: '$2', maxWidth: '200px' }}>
                The eth you would receive if you sold instantly.
              </Text>
            </Flex>
          }
        >
          <Text css={{ color: '$gray9' }}>
            <FontAwesomeIcon icon={faCircleInfo} width={12} height={12} />
          </Text>
        </Tooltip>
      </Flex>
    </TableCell>
    <TableCell></TableCell>
  </HeaderRow>
)
