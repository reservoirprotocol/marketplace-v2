import {
  faCheck,
  faEdit,
  faEllipsis,
  faGasPump,
  faHand,
  faPlus,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  EditListingModal,
  EditListingStep,
  extractMediaType,
  TokenMedia,
  useDynamicTokens,
  useTokens,
  useUserTokens,
} from '@reservoir0x/reservoir-kit-ui'
import { AcceptBid } from 'components/buttons'
import BuyNow from 'components/buttons/BuyNow'
import CancelListing from 'components/buttons/CancelListing'
import List from 'components/buttons/List'
import { spin } from 'components/common/LoadingSpinner'
import {
  Box,
  Button,
  Flex,
  FormatCryptoCurrency,
  Text,
  Tooltip,
} from 'components/primitives'
import { Dropdown, DropdownMenuItem } from 'components/primitives/Dropdown'
import { ToastContext } from 'context/ToastContextProvider'
import { useMarketplaceChain } from 'hooks'
import Link from 'next/link'
import { UserToken } from 'pages/portfolio/[[...address]]'
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useContext,
  useMemo,
  useState,
} from 'react'
import { MutatorCallback } from 'swr'
import { useMediaQuery } from 'react-responsive'
import fetcher from 'utils/fetcher'
import { formatNumber } from 'utils/numbers'
import { DATE_REGEX, timeTill } from 'utils/till'
import { Address } from 'wagmi'
import Image from 'next/image'
import optimizeImage from 'utils/optimizeImage'

type PortfolioTokenCardProps = {
  token: ReturnType<typeof useUserTokens>['data'][0]
  address: Address
  isOwner: boolean
  rarityEnabled: boolean
  tokenCount?: string
  orderQuantity?: number
  selectedItems: UserToken[]
  setSelectedItems: Dispatch<SetStateAction<UserToken[]>>
  mutate?: MutatorCallback
  onMediaPlayed?: (
    e: SyntheticEvent<HTMLAudioElement | HTMLVideoElement, Event>
  ) => void
}

export default ({
  token,
  address,
  isOwner,
  rarityEnabled = true,
  orderQuantity,
  tokenCount,
  selectedItems,
  setSelectedItems,
  mutate,
  onMediaPlayed,
}: PortfolioTokenCardProps) => {
  const { addToast } = useContext(ToastContext)
  const [isRefreshing, setIsRefreshing] = useState(false)

  let dynamicToken = token as ReturnType<typeof useDynamicTokens>['data'][0]

  const isSmallDevice = useMediaQuery({ maxWidth: 900 })

  const mediaType = extractMediaType(dynamicToken?.token)
  const showPreview =
    mediaType === 'other' || mediaType === 'html' || mediaType === null
  const { routePrefix, proxyApi } = useMarketplaceChain()

  const collectionImage = useMemo(() => {
    return optimizeImage(token?.token?.collection?.imageUrl, 500)
  }, [token?.token?.collection?.imageUrl])

  const isOracleOrder =
    token?.ownership?.floorAsk?.rawData?.isNativeOffChainCancellable

  const contract = token.token?.collection?.id
    ? token.token?.collection.id?.split(':')[0]
    : undefined

  const addSelectedItem = (item: UserToken) => {
    setSelectedItems([...selectedItems, item])
  }

  const removeSelectedItem = (item: UserToken) => {
    setSelectedItems(
      selectedItems.filter(
        (selectedItem) =>
          selectedItem?.token?.tokenId !== item?.token?.tokenId ||
          selectedItem?.token?.contract !== item?.token?.contract
      )
    )
  }

  const isSelectedItem = useMemo(() => {
    return selectedItems.some(
      (selectedItem) =>
        selectedItem?.token?.tokenId === token?.token?.tokenId &&
        selectedItem?.token?.contract === token?.token?.contract
    )
  }, [selectedItems])

  return (
    <Box
      css={{
        borderRadius: 8,
        overflow: 'hidden',
        background: '$neutralBgSubtle',
        $$shadowColor: '$colors$panelShadow',
        boxShadow: '0 8px 12px 0px $$shadowColor',
        position: 'relative',
        '&:hover > a > div > img': {
          transform: 'scale(1.1)',
        },
        '@sm': {
          '&:hover .token-button-container': {
            bottom: 0,
          },
        },
      }}
    >
      {tokenCount && (
        <Flex
          justify="center"
          align="center"
          css={{
            borderRadius: 8,
            px: '$2',
            py: '$1',
            mr: '$2',
            position: 'absolute',
            left: '$2',
            top: '$2',
            zIndex: 1,
            maxWidth: '50%',
            backgroundColor: 'rgba(	38, 41, 43, 0.3)',
          }}
        >
          <Text
            css={{
              color: '$whiteA12',
            }}
            ellipsify
          >
            x{tokenCount}
          </Text>
        </Flex>
      )}
      {orderQuantity && orderQuantity > 1 && (
        <Flex
          justify="center"
          align="center"
          css={{
            borderRadius: 8,
            px: '$2',
            py: '$1',
            mr: '$2',
            position: 'absolute',
            left: '$2',
            top: '$2',
            zIndex: 1,
            maxWidth: '50%',
            backgroundColor: 'rgba(	38, 41, 43, 0.3)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <Text
            css={{
              color: '$whiteA12',
            }}
            ellipsify
          >
            x{orderQuantity}
          </Text>
        </Flex>
      )}
      {isOwner && !isSmallDevice ? (
        <Button
          css={{
            borderRadius: '99999px',
            width: 48,
            height: 48,
            backgroundColor: isSelectedItem ? '$primary9' : '#15171833',
            '&:hover': {
              backgroundColor: isSelectedItem ? '$primary9' : '#15171859',
            },
            opacity: isSelectedItem ? 1 : 1,
            position: 'absolute',
            right: '$2',
            zIndex: 1,
            top: '$2',
            color: 'white',
            p: 0,
            justifyContent: 'center',
          }}
          onClick={(e) => {
            e.preventDefault()

            if (!isSelectedItem) {
              addSelectedItem(token)
            } else {
              removeSelectedItem(token)
            }
          }}
        >
          <FontAwesomeIcon
            icon={isSelectedItem ? faCheck : faPlus}
            width={20}
            height={20}
          />
        </Button>
      ) : null}
      <Link
        passHref
        href={`/collection/${routePrefix}/${token?.token?.contract}/${token?.token?.tokenId}`}
      >
        <Box css={{ background: '$gray3', overflow: 'hidden' }}>
          <TokenMedia
            token={dynamicToken?.token}
            style={{
              width: '100%',
              transition: 'transform .3s ease-in-out',
              maxHeight: 720,
              height: '100%',
              borderRadius: 0,
              aspectRatio: '1/1',
            }}
            preview={showPreview}
            audioOptions={{
              onPlay: (e) => {
                onMediaPlayed?.(e)
              },
            }}
            videoOptions={{
              onPlay: (e) => {
                onMediaPlayed?.(e)
              },
            }}
            onRefreshToken={() => {
              mutate?.()
              addToast?.({
                title: 'Refresh token',
                description: 'Request to refresh this token was accepted.',
              })
            }}
          />
        </Box>
      </Link>
      <Link
        href={`/collection/${routePrefix}/${token?.token?.contract}/${token?.token?.tokenId}`}
      >
        <Flex
          css={{ p: '$4', minHeight: 132, cursor: 'pointer' }}
          direction="column"
        >
          <Flex css={{ mb: '$4' }} align="center" justify="between">
            <Flex align="center" css={{ gap: '$2', minWidth: 0 }}>
              {collectionImage ? (
                <Image
                  style={{
                    borderRadius: '4px',
                    objectFit: 'cover',
                    aspectRatio: '1/1',
                  }}
                  loader={({ src }) => src}
                  src={collectionImage}
                  alt={`${token?.token?.name}`}
                  width={24}
                  height={24}
                />
              ) : null}
              <Text
                style="subtitle1"
                as="p"
                ellipsify
                css={{
                  pr: '$1',
                  flex: 1,
                }}
              >
                {token?.token?.name || '#' + token?.token?.tokenId}{' '}
              </Text>
            </Flex>
            {rarityEnabled &&
            token?.token?.kind !== 'erc1155' &&
            token?.token?.rarityRank ? (
              <Box
                css={{
                  px: '$1',
                  py: 2,
                  background: '$gray5',
                  borderRadius: 8,
                  minWidth: 'max-content',
                }}
              >
                <Flex align="center" css={{ gap: 5 }}>
                  <img
                    style={{ width: 13, height: 13 }}
                    src="/icons/rarity-icon.svg"
                  />
                  <Text style="subtitle3" as="p">
                    {formatNumber(token?.token?.rarityRank)}
                  </Text>
                </Flex>
              </Box>
            ) : null}
          </Flex>

          <Flex align="center" css={{ gap: '$2' }}>
            <Box
              css={{
                flex: 1,
                minWidth: 0,
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {token?.ownership?.floorAsk?.price && (
                <FormatCryptoCurrency
                  logoHeight={18}
                  amount={token?.ownership?.floorAsk?.price?.amount?.decimal}
                  address={
                    token?.ownership?.floorAsk?.price?.currency?.contract
                  }
                  textStyle="h6"
                  css={{
                    textOverflow: 'ellipsis',
                    minWidth: 0,
                    with: '100%',
                    overflow: 'hidden',
                  }}
                  maximumFractionDigits={4}
                />
              )}
            </Box>

            <>
              {token?.ownership?.floorAsk?.source?.name && (
                <img
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                  }}
                  src={`${proxyApi}/redirect/sources/${token?.ownership?.floorAsk?.source?.domain}/logo/v2`}
                />
              )}
            </>
          </Flex>
          {token?.token?.lastSale?.price?.amount?.decimal ? (
            <Flex css={{ gap: '$2', marginTop: 'auto' }}>
              <Text css={{ color: '$gray11' }} style="subtitle3">
                Last Sale
              </Text>
              <FormatCryptoCurrency
                logoHeight={12}
                amount={token.token.lastSale.price.amount?.decimal}
                address={token.token.lastSale.price.currency?.contract}
                decimals={token.token.lastSale.price.currency?.decimals}
                textStyle="subtitle3"
                maximumFractionDigits={4}
              />
            </Flex>
          ) : null}
        </Flex>
      </Link>
      {!isOwner && token?.ownership?.floorAsk?.price?.amount ? (
        <Flex
          className="token-button-container"
          css={{
            width: '100%',
            transition: 'bottom 0.25s ease-in-out',
            position: 'absolute',
            bottom: -44,
            left: 0,
            right: 0,
            gap: 1,
          }}
        >
          <BuyNow
            tokenId={token.token?.tokenId}
            collectionId={token.token?.collection?.id}
            mutate={mutate}
            buttonCss={{
              justifyContent: 'center',
              flex: 1,
            }}
            buttonProps={{
              corners: 'square',
            }}
            buttonChildren="Buy Now"
          />
        </Flex>
      ) : null}
      {isOwner ? (
        <Flex
          className="token-button-container"
          css={{
            width: '100%',
            transition: 'bottom 0.25s ease-in-out',
            position: 'absolute',
            bottom: -44,
            left: 0,
            right: 0,
            gap: 1,
          }}
        >
          <List
            token={token as ReturnType<typeof useTokens>['data'][0]}
            buttonCss={{
              justifyContent: 'center',
              flex: 1,
            }}
            buttonProps={{
              corners: 'square',
            }}
            buttonChildren="List"
            mutate={mutate}
          />
          <Dropdown
            modal={false}
            trigger={
              <Button
                corners="square"
                size="xs"
                css={{ width: 44, justifyContent: 'center' }}
              >
                <FontAwesomeIcon icon={faEllipsis} />
              </Button>
            }
            contentProps={{
              asChild: true,
              forceMount: true,
              align: 'start',
              alignOffset: -18,
            }}
          >
            {token?.token?.topBid?.price?.amount?.decimal && isOwner && (
              <AcceptBid
                tokenId={token.token.tokenId}
                collectionId={token?.token?.contract}
                mutate={mutate}
                buttonCss={{
                  gap: '$2',
                  px: '$2',
                  py: '$3',
                  borderRadius: 8,
                  outline: 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '$gray5',
                  },
                  '&:focus': {
                    backgroundColor: '$gray5',
                  },
                }}
                buttonChildren={
                  <>
                    <Box css={{ color: '$gray10' }}>
                      <FontAwesomeIcon icon={faHand} />
                    </Box>
                    <Text>Accept Best Offer</Text>
                  </>
                }
              />
            )}
            <DropdownMenuItem
              css={{ py: '$3', width: '100%' }}
              onClick={(e) => {
                if (isRefreshing) {
                  e.preventDefault()
                  return
                }
                setIsRefreshing(true)
                fetcher(
                  `${window.location.origin}/${proxyApi}/tokens/refresh/v1`,
                  undefined,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      token: `${contract}:${token.token?.tokenId}`,
                    }),
                  }
                )
                  .then(({ data, response }) => {
                    if (response.status === 200) {
                      addToast?.({
                        title: 'Refresh token',
                        description:
                          'Request to refresh this token was accepted.',
                      })
                    } else {
                      throw data
                    }
                    setIsRefreshing(false)
                  })
                  .catch((e) => {
                    const ratelimit = DATE_REGEX.exec(e?.message)?.[0]

                    addToast?.({
                      title: 'Refresh token failed',
                      description: ratelimit
                        ? `This token was recently refreshed. The next available refresh is ${timeTill(
                            ratelimit
                          )}.`
                        : `This token was recently refreshed. Please try again later.`,
                    })

                    setIsRefreshing(false)
                    throw e
                  })
              }}
            >
              <Flex align="center" css={{ gap: '$2' }}>
                <Box
                  css={{
                    color: '$gray10',
                    animation: isRefreshing
                      ? `${spin} 1s cubic-bezier(0.76, 0.35, 0.2, 0.7) infinite`
                      : 'none',
                  }}
                >
                  <FontAwesomeIcon icon={faRefresh} width={16} height={16} />
                </Box>
                <Text>Refresh Token</Text>
              </Flex>
            </DropdownMenuItem>

            {isOracleOrder &&
            token?.ownership?.floorAsk?.id &&
            token?.token?.tokenId &&
            token?.token?.collection?.id ? (
              <EditListingModal
                trigger={
                  <Flex
                    align="center"
                    css={{
                      gap: '$2',
                      px: '$2',
                      py: '$3',
                      borderRadius: 8,
                      outline: 'none',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '$gray5',
                      },
                      '&:focus': {
                        backgroundColor: '$gray5',
                      },
                    }}
                  >
                    <Box css={{ color: '$gray10' }}>
                      <FontAwesomeIcon icon={faEdit} />
                    </Box>
                    <Text>Edit Listing</Text>
                  </Flex>
                }
                listingId={token?.ownership?.floorAsk?.id}
                tokenId={token?.token?.tokenId}
                collectionId={token?.token?.collection?.id}
                onClose={(data, currentStep) => {
                  if (mutate && currentStep == EditListingStep.Complete)
                    mutate()
                }}
              />
            ) : null}

            {token?.ownership?.floorAsk?.id ? (
              <CancelListing
                listingId={token.ownership.floorAsk.id as string}
                mutate={mutate}
                trigger={
                  <Flex
                    css={{
                      px: '$2',
                      py: '$3',
                      borderRadius: 8,
                      outline: 'none',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '$gray5',
                      },
                      '&:focus': {
                        backgroundColor: '$gray5',
                      },
                    }}
                  >
                    {!isOracleOrder ? (
                      <Tooltip
                        content={
                          <Text style="body2" as="p">
                            Canceling this order requires gas.
                          </Text>
                        }
                      >
                        <Flex align="center" css={{ gap: '$2' }}>
                          <Box css={{ color: '$gray10' }}>
                            <FontAwesomeIcon icon={faGasPump} />
                          </Box>
                          <Text color="error">Cancel Listing</Text>
                        </Flex>
                      </Tooltip>
                    ) : (
                      <Text color="error">Cancel</Text>
                    )}
                  </Flex>
                }
              />
            ) : null}
          </Dropdown>
        </Flex>
      ) : null}
    </Box>
  )
}
