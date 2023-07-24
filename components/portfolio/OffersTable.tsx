import { FC, useContext, useEffect, useRef, useMemo } from 'react'
import { useMediaQuery } from 'react-responsive'
import {
  Text,
  Flex,
  TableCell,
  TableRow,
  HeaderRow,
  FormatCryptoCurrency,
  Anchor,
  Button,
  Box,
  Tooltip,
} from '../primitives'
import { useIntersectionObserver } from 'usehooks-ts'
import LoadingSpinner from '../common/LoadingSpinner'
import { useBids } from '@reservoir0x/reservoir-kit-ui'
import Link from 'next/link'
import { MutatorCallback } from 'swr'
import { useMarketplaceChain, useTimeSince } from 'hooks'
import CancelBid from 'components/buttons/CancelBid'
import { Address } from 'wagmi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGasPump, faHand } from '@fortawesome/free-solid-svg-icons'
import { NAVBAR_HEIGHT } from 'components/navbar'
import { ChainContext } from 'context/ChainContextProvider'
import Img from 'components/primitives/Img'
import optimizeImage from 'utils/optimizeImage'
import { formatNumber } from 'utils/numbers'

type Props = {
  address: Address | undefined
  isOwner: boolean
}

const desktopTemplateColumns = '1.25fr .75fr repeat(4, 1fr)'

export const OffersTable: FC<Props> = ({ address, isOwner }) => {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})

  let bidsQuery: Parameters<typeof useBids>['0'] = {
    maker: address,
    includeCriteriaMetadata: true,
    includeRawData: true,
  }

  const { chain } = useContext(ChainContext)

  if (chain.community) bidsQuery.community = chain.community

  const {
    data: offers,
    fetchNextPage,
    mutate,
    isValidating,
    isFetchingPage,
  } = useBids(bidsQuery)

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      fetchNextPage()
    }
  }, [loadMoreObserver?.isIntersecting])

  return (
    <>
      {!isValidating && !isFetchingPage && offers && offers.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          css={{ py: '$6', gap: '$4', width: '100%' }}
        >
          <Text css={{ color: '$gray11' }}>
            <FontAwesomeIcon icon={faHand} size="2xl" />
          </Text>
          <Text css={{ color: '$gray11' }}>No offers made yet</Text>
        </Flex>
      ) : (
        <Flex direction="column" css={{ width: '100%', pb: '$2' }}>
          <TableHeading />
          {offers.map((offer, i) => {
            return (
              <OfferTableRow
                key={`${offer?.id}-${i}`}
                offer={offer}
                isOwner={isOwner}
                mutate={mutate}
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
  offer: ReturnType<typeof useBids>['data'][0]
  isOwner: boolean
  mutate?: MutatorCallback
}

const OfferTableRow: FC<OfferTableRowProps> = ({ offer, isOwner, mutate }) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })
  const { routePrefix } = useMarketplaceChain()
  const expiration = useTimeSince(offer?.expiration)

  const isOracleOrder = offer?.isNativeOffChainCancellable
  const isCollectionOffer = offer?.criteria?.kind !== 'token'

  // @ts-ignore
  const attribute = offer?.criteria?.data?.attribute
  const attributeQueryParam = attribute
    ? `?attributes[${attribute.key}]=${attribute.value}`
    : ''
  const attributeDisplayText = attribute
    ? `${attribute?.key}: ${attribute?.value}`
    : ''

  let criteriaData = offer?.criteria?.data

  const imageSrc = useMemo(() => {
    return optimizeImage(
      criteriaData?.token?.tokenId
        ? criteriaData?.token?.image || criteriaData?.collection?.image
        : criteriaData?.collection?.image,
      250
    )
  }, [
    criteriaData?.token?.tokenId,
    criteriaData?.token?.image,
    criteriaData?.collection?.image,
  ])

  if (isSmallDevice) {
    return (
      <Flex
        key={offer?.id}
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
        <Flex justify="between" css={{ width: '100%' }}>
          <Link
            href={
              isCollectionOffer
                ? `/${routePrefix}/collection/${offer?.contract}${attributeQueryParam}`
                : `/${routePrefix}/asset/${offer?.contract}:${criteriaData?.token?.tokenId}`
            }
          >
            <Flex align="center">
              <Img
                css={{
                  borderRadius: '4px',
                  objectFit: 'cover',
                  aspectRatio: '1/1',
                }}
                loader={({ src }) => src}
                src={imageSrc}
                alt={`${offer?.id}`}
                width={36}
                height={36}
              />
              <Flex
                direction="column"
                css={{
                  ml: '$2',
                  overflow: 'hidden',
                  minWidth: 0,
                }}
              >
                <Text style="subtitle3" ellipsify css={{ color: '$gray11' }}>
                  {criteriaData?.collection?.name}
                </Text>
                <Flex css={{ gap: '$2' }} align="center">
                  <Text style="subtitle2" ellipsify>
                    {isCollectionOffer
                      ? attributeDisplayText
                      : `#${criteriaData?.token?.tokenId}`}
                  </Text>
                  {offer?.quantityRemaining && offer?.quantityRemaining > 1 ? (
                    <Flex
                      justify="center"
                      align="center"
                      css={{
                        borderRadius: 4,
                        px: '$2',
                        py: '$1',
                        ml: '$1',
                        backgroundColor: '$gray2',
                      }}
                    >
                      <Text style="subtitle2" color="subtle">
                        x{formatNumber(offer.quantityRemaining, 0, true)}
                      </Text>
                    </Flex>
                  ) : null}
                </Flex>
              </Flex>
            </Flex>
          </Link>
          <Tooltip
            side="left"
            sideOffset="1"
            open={offer?.price?.netAmount?.decimal ? undefined : false}
            content={
              <Flex justify="between" css={{ gap: '$2' }}>
                <Text style="body3">Net Amount</Text>
                <FormatCryptoCurrency
                  amount={offer?.price?.netAmount?.decimal}
                  address={offer?.price?.currency?.contract}
                  decimals={offer?.price?.currency?.decimals}
                  textStyle="subtitle3"
                  logoHeight={14}
                />
              </Flex>
            }
          >
            <Flex>
              <FormatCryptoCurrency
                amount={offer?.price?.amount?.decimal}
                address={offer?.price?.currency?.contract}
                decimals={offer?.price?.currency?.decimals}
                textStyle="subtitle2"
                logoHeight={14}
              />
            </Flex>
          </Tooltip>
        </Flex>
        <Flex justify="between" align="center" css={{ width: '100%' }}>
          <a href={`https://${offer?.source?.domain}`} target="_blank">
            <Flex align="center" css={{ gap: '$2' }}>
              <img
                width="20px"
                height="20px"
                src={(offer?.source?.icon as string) || ''}
                alt={`${offer?.source?.name}`}
              />
              <Text style="subtitle2">{expiration}</Text>
            </Flex>
          </a>

          {isOwner ? (
            <CancelBid
              bidId={offer?.id as string}
              mutate={mutate}
              trigger={
                <Flex>
                  {!isOracleOrder ? (
                    <Tooltip
                      content={
                        <Text style="body3" as="p">
                          Cancelling this order requires gas.
                        </Text>
                      }
                    >
                      <Button
                        css={{
                          color: '$red11',
                          minWidth: '150px',
                          justifyContent: 'center',
                        }}
                        color="gray3"
                      >
                        <FontAwesomeIcon
                          color="#697177"
                          icon={faGasPump}
                          width="16"
                          height="16"
                        />
                        Cancel
                      </Button>
                    </Tooltip>
                  ) : (
                    <Button
                      css={{
                        color: '$red11',
                        minWidth: '150px',
                        justifyContent: 'center',
                      }}
                      color="gray3"
                    >
                      Cancel
                    </Button>
                  )}
                </Flex>
              }
            />
          ) : null}
        </Flex>
      </Flex>
    )
  }

  return (
    <TableRow
      key={offer?.id}
      css={{ gridTemplateColumns: desktopTemplateColumns }}
    >
      <TableCell css={{ minWidth: 0 }}>
        <Link
          href={
            isCollectionOffer
              ? `/${routePrefix}/collection/${offer?.contract}${attributeQueryParam}`
              : `/${routePrefix}/asset/${offer?.contract}:${criteriaData?.token?.tokenId}`
          }
        >
          <Flex align="center">
            <Img
              css={{
                borderRadius: '4px',
                objectFit: 'cover',
                aspectRatio: '1/1',
              }}
              loader={({ src }) => src}
              src={imageSrc}
              alt={`${criteriaData?.token?.name}`}
              width={48}
              height={48}
            />

            <Flex
              direction="column"
              css={{
                ml: '$2',
                overflow: 'hidden',
              }}
            >
              <Text style="subtitle3" ellipsify css={{ color: '$gray11' }}>
                {criteriaData?.collection?.name}
              </Text>
              <Text style="subtitle2" ellipsify>
                {isCollectionOffer
                  ? attributeDisplayText
                  : `#${criteriaData?.token?.tokenId}`}
              </Text>
            </Flex>
          </Flex>
        </Link>
      </TableCell>
      <TableCell>
        <Tooltip
          side="left"
          sideOffset="1"
          open={offer?.price?.netAmount?.decimal ? undefined : false}
          content={
            <Flex justify="between" css={{ gap: '$2' }}>
              <Text style="body3">Net Amount</Text>
              <FormatCryptoCurrency
                amount={offer?.price?.netAmount?.decimal}
                address={offer?.price?.currency?.contract}
                decimals={offer?.price?.currency?.decimals}
                textStyle="subtitle3"
                logoHeight={14}
              />
            </Flex>
          }
        >
          <Flex>
            <FormatCryptoCurrency
              amount={offer?.price?.amount?.decimal}
              address={offer?.price?.currency?.contract}
              decimals={offer?.price?.currency?.decimals}
              textStyle="subtitle1"
              logoHeight={14}
            />
          </Flex>
        </Tooltip>
      </TableCell>
      <TableCell>
        <Text style="subtitle2">
          {formatNumber(offer.quantityRemaining, 0, true)}
        </Text>
      </TableCell>
      <TableCell>
        <Text style="subtitle2">{expiration}</Text>
      </TableCell>
      <TableCell>
        <Flex align="center" css={{ gap: '$2' }}>
          <img
            width="20px"
            height="20px"
            src={(offer?.source?.icon as string) || ''}
            alt={`${offer?.source?.name}`}
          />
          <Anchor
            href={`https://${offer?.source?.domain as string}`}
            target="_blank"
            color="primary"
            weight="normal"
          >
            {offer?.source?.name as string}
          </Anchor>
        </Flex>
      </TableCell>
      <TableCell>
        <Flex justify="end">
          {isOwner ? (
            <CancelBid
              bidId={offer?.id as string}
              mutate={mutate}
              trigger={
                <Flex>
                  {!isOracleOrder ? (
                    <Tooltip
                      content={
                        <Text style="body3" as="p">
                          Cancelling this order requires gas.
                        </Text>
                      }
                    >
                      <Button
                        css={{
                          color: '$red11',
                          minWidth: '150px',
                          justifyContent: 'center',
                        }}
                        color="gray3"
                      >
                        <FontAwesomeIcon
                          color="#697177"
                          icon={faGasPump}
                          width="16"
                          height="16"
                        />
                        Cancel
                      </Button>
                    </Tooltip>
                  ) : (
                    <Button
                      css={{
                        color: '$red11',
                        minWidth: '150px',
                        justifyContent: 'center',
                      }}
                      color="gray3"
                    >
                      Cancel
                    </Button>
                  )}
                </Flex>
              }
            />
          ) : null}
        </Flex>
      </TableCell>
    </TableRow>
  )
}

const headings = [
  'Items',
  'Offer Amount',
  'Quantity',
  'Expiration',
  'Marketplace',
  '',
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
