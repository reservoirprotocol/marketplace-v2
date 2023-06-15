import { faGasPump, faHand } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useBids } from '@reservoir0x/reservoir-kit-ui'
import { AcceptBid } from 'components/buttons'
import CancelBid from 'components/buttons/CancelBid'
import EditBid from 'components/buttons/EditBid'
import LoadingSpinner from 'components/common/LoadingSpinner'
import {
  Box,
  Button,
  Flex,
  FormatCryptoCurrency,
  TableRow,
  Text,
  Tooltip,
} from 'components/primitives'
import { ChainContext } from 'context/ChainContextProvider'
import { useENSResolver, useMarketplaceChain, useTimeSince } from 'hooks'
import Link from 'next/link'
import { FC, useContext, useEffect, useRef, useState } from 'react'
import { MutatorCallback } from 'swr'
import { useIntersectionObserver } from 'usehooks-ts'
import { formatDollar } from 'utils/numbers'
import { OnlyUserOrdersToggle } from './OnlyUserOrdersToggle'
import { zeroAddress } from 'viem'

type Props = {
  address?: string
  token: Parameters<typeof useBids>['0']['token']
  is1155: boolean
  isOwner: boolean
}

export const OffersTable: FC<Props> = ({ token, address, is1155, isOwner }) => {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})
  const [userOnly, setUserOnly] = useState(false)

  let bidsQuery: Parameters<typeof useBids>['0'] = {
    maker: userOnly ? address : undefined,
    token: token,
    includeCriteriaMetadata: true,
    includeRawData: true,
    sortBy: 'price',
  }

  const { chain } = useContext(ChainContext)

  if (chain.community) {
    bidsQuery.community = chain.community
  }

  const {
    data: offers,
    fetchNextPage,
    mutate,
    isValidating,
    isFetchingPage,
    isLoading,
  } = useBids(bidsQuery, { revalidateFirstPage: true })

  const { data: userOffers } = useBids({ ...bidsQuery, maker: address })

  const userHasOffers = userOffers.length > 0

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
        <Flex direction="column" css={{ gap: '$4' }}>
          {address && userHasOffers ? (
            <OnlyUserOrdersToggle
              checked={userOnly}
              onCheckedChange={(checked) => setUserOnly(checked)}
            />
          ) : null}
          <Flex
            direction="column"
            css={{
              height: '100%',
              maxHeight: isLoading ? '20px' : '450px',
              overflowY: 'auto',
              width: '100%',
              pb: '$2',
            }}
          >
            {offers.map((offer, i) => {
              return (
                <OfferTableRow
                  key={`${offer?.id}-${i}`}
                  offer={offer}
                  tokenString={token}
                  address={address}
                  is1155={is1155}
                  isOwner={isOwner}
                  mutate={mutate}
                />
              )
            })}
            <Box ref={loadMoreRef} css={{ height: 20 }}></Box>
          </Flex>
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
  tokenString: Parameters<typeof useBids>['0']['token']
  is1155: boolean
  isOwner: boolean
  address?: string
  mutate?: MutatorCallback
}

const OfferTableRow: FC<OfferTableRowProps> = ({
  offer,
  tokenString,
  is1155,
  isOwner,
  address,
  mutate,
}) => {
  const { displayName: fromDisplayName } = useENSResolver(offer.maker)
  const { reservoirBaseUrl } = useMarketplaceChain()
  const expiration = useTimeSince(offer?.expiration)
  const expirationText = expiration ? `Expires ${expiration}` : null

  const isUserOffer = address?.toLowerCase() === offer.maker.toLowerCase()

  const isOracleOrder = offer?.isNativeOffChainCancellable
  const contract = tokenString?.split(':')[0]
  const tokenId = tokenString?.split(':')[1]

  const offerSourceName = offer?.source?.name
  const offerSourceDomain = offer?.source?.domain
  const offerSourceLogo = `${reservoirBaseUrl}/redirect/sources/${
    offerSourceDomain || offerSourceName
  }/logo/v2`

  return (
    <TableRow
      css={{
        gridTemplateColumns: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        py: '$3',
      }}
    >
      <Flex
        direction="column"
        align="start"
        css={{ height: '100%', gap: '$1' }}
      >
        <Flex align="center" css={{ gap: '$1', height: 36 }}>
          <FormatCryptoCurrency
            amount={offer.price?.amount?.decimal}
            address={offer.price?.currency?.contract}
            logoHeight={16}
            textStyle="h6"
          />
          {offer.price?.amount?.usd ? (
            <Text style="body2" css={{ color: '$gray11' }} ellipsify>
              {formatDollar(offer.price?.amount?.usd)}
            </Text>
          ) : null}
        </Flex>
        <Flex align="center" css={{ gap: '$1' }}>
          <Text style="body2" color="subtle" css={{ lineHeight: '14.5px' }}>
            from
          </Text>
          {offer.maker && offer.maker !== zeroAddress ? (
            <Link
              href={`/portfolio/${offer.maker}`}
              style={{ lineHeight: '14.5px' }}
            >
              <Text
                style="subtitle2"
                css={{
                  color: '$primary11',
                  '&:hover': {
                    color: '$primary10',
                  },
                }}
              >
                {fromDisplayName}
              </Text>
            </Link>
          ) : (
            <span>-</span>
          )}

          <img width={16} height={16} src={offerSourceLogo} />
        </Flex>
      </Flex>
      <Flex direction="column" align="end" css={{ gap: '$2' }}>
        <Flex align="center" css={{ gap: '$2' }}>
          {/* Owner and not user offer */}
          {isOwner && !isUserOffer ? (
            <AcceptBid
              bidId={offer.id}
              collectionId={offer.criteria?.data?.collection?.id || contract}
              tokenId={offer.criteria?.data?.token?.tokenId || tokenId}
              buttonChildren={
                <Text style="subtitle2" css={{ color: 'white' }}>
                  Accept
                </Text>
              }
              buttonProps={{ color: 'primary' }}
              buttonCss={{ fontSize: 14, px: '$4', py: '$2', minHeight: 36 }}
            />
          ) : null}
          {/* Not Owner and is user offer, owner of erc 1155 and is your offer */}
          {(!isOwner && isUserOffer) || (isOwner && is1155 && isUserOffer) ? (
            <>
              {isOracleOrder ? (
                <EditBid
                  bidId={offer.id}
                  tokenId={offer.criteria?.data?.token?.tokenId || tokenId}
                  collectionId={
                    offer.criteria?.data?.collection?.id || contract
                  }
                  buttonChildren={<Text style="subtitle2">Edit</Text>}
                  buttonCss={{
                    fontSize: 14,
                    px: '$4',
                    py: '$2',
                    minHeight: 36,
                    minWidth: 80,
                    justifyContent: 'center',
                  }}
                  mutate={mutate}
                />
              ) : null}

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
                            justifyContent: 'center',
                            fontSize: 14,
                            fontWeight: 500,
                            px: '$4',
                            py: '$2',
                            minHeight: 36,
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
                          justifyContent: 'center',
                          fontSize: 14,
                          fontWeight: 500,
                          px: '$4',
                          py: '$2',
                          minHeight: 36,
                        }}
                        color="gray3"
                      >
                        Cancel
                      </Button>
                    )}
                  </Flex>
                }
              />
            </>
          ) : null}
        </Flex>
        <Text style="body2" color="subtle">
          {expirationText}
        </Text>
      </Flex>
    </TableRow>
  )
}
