import {
  useCollectionActivity,
  useUsersActivity,
} from '@reservoir0x/reservoir-kit-ui'
import { FC, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import {
  Box,
  Text,
  Table,
  TableBody,
  TableData,
  TableRow,
  Flex,
  FormatCryptoCurrency,
  FormatCurrency,
} from './primitives'
import { DateTime } from 'luxon'
import { useIntersectionObserver } from 'usehooks-ts'
import Link from 'next/link'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import { useEnvChain } from 'hooks'
import { truncateAddress } from 'utils/truncate'
import { constants } from 'ethers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faExternalLink,
  faHand,
  faRightLeft,
  faSeedling,
  faShoppingCart,
  faTag,
  faTrash,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { optimizeImage } from 'utils/optimizeImage'

const API_BASE = process.env.NEXT_PUBLIC_RESERVOIR_API_BASE

type CollectionActivityResponse = ReturnType<typeof useCollectionActivity>
type CollectionActivity = CollectionActivityResponse['data'][0]
export type CollectionActivityTypes = NonNullable<
  Exclude<Parameters<typeof useCollectionActivity>['0'], boolean>
>['types']

type UsersActivityResponse = ReturnType<typeof useCollectionActivity>
type UsersActivity = UsersActivityResponse['data'][0]
type ActivityResponse = CollectionActivityResponse | UsersActivityResponse
export type UserActivityTypes = NonNullable<
  Exclude<Parameters<typeof useUsersActivity>['1'], boolean>
>['types']

type Activity = CollectionActivity | UsersActivity
type Props = {
  data: ActivityResponse
}

export const ActivityTable: FC<Props> = ({ data }) => {
  const loadMoreRef = useRef<HTMLDivElement>()
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {
    rootMargin: '0px 0px 300px 0px',
  })

  const activities = data.data

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      data.fetchNextPage()
    }
  }, [loadMoreObserver?.isIntersecting])

  return (
    <>
      {!data.isValidating && (!activities || activities.length === 0) ? (
        <Text>No results</Text> // TODO: Update empty state
      ) : (
        <Table css={{ width: '100%' }}>
          <TableBody>
            {activities.map((activity, i) => {
              if (!activity) return null

              return (
                <ActivityTableRow
                  key={`${activity?.txHash}-${i}`}
                  activity={activity}
                />
              )
            })}
            <div ref={loadMoreRef}></div>
          </TableBody>
        </Table>
      )}
      {/* TODO: Update loading state */}
      {data.isValidating && (
        <Flex align="center" justify="center" css={{ py: '$3' }}>
          Loading...
        </Flex>
      )}
    </>
  )
}

type ActivityTableRowProps = {
  activity: Activity
}

const ActivityTableRow: FC<ActivityTableRowProps> = ({ activity }) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 700 })
  const { address } = useAccount()
  const [toShortAddress, setToShortAddress] = useState<string>(
    activity?.toAddress || ''
  )
  const [fromShortAddress, setFromShortAddress] = useState<string>(
    activity?.fromAddress || ''
  )
  const [imageSrc, setImageSrc] = useState(
    activity?.token?.tokenImage ||
      `${API_BASE}/redirect/collections/${activity?.collection?.collectionImage}/image/v1`
  )
  const [timeAgo, setTimeAgo] = useState(activity?.timestamp || '')
  const envChain = useEnvChain()
  const blockExplorerBaseUrl =
    envChain?.blockExplorers?.default?.url || 'https://etherscan.io'
  const href = activity?.token?.tokenId
    ? `/${activity?.collection?.collectionId}/${activity?.token?.tokenId}`
    : `/collections/${activity?.collection?.collectionId}`

  useEffect(() => {
    let toShortAddress = truncateAddress(activity?.toAddress || '')
    let fromShortAddress = truncateAddress(activity?.fromAddress || '')
    if (!!address) {
      if (address?.toLowerCase() === activity?.toAddress?.toLowerCase()) {
        toShortAddress = 'You'
      }
      if (address?.toLowerCase() === activity?.fromAddress?.toLowerCase()) {
        fromShortAddress = 'You'
      }
    }
    setToShortAddress(toShortAddress)
    setFromShortAddress(fromShortAddress)
    setTimeAgo(
      activity?.timestamp
        ? DateTime.fromSeconds(activity.timestamp).toRelative() || ''
        : ''
    )
  }, [activity, address])

  useEffect(() => {
    if (activity?.token?.tokenImage) {
      setImageSrc(optimizeImage(activity?.token?.tokenImage, 48))
    } else if (optimizeImage(activity?.collection?.collectionImage, 48)) {
      setImageSrc(activity?.collection?.collectionImage)
    }
  }, [activity])

  if (!activity) {
    return null
  }

  let activityDescription = ''

  const logos = {
    transfer: <FontAwesomeIcon icon={faRightLeft} width={16} height={16} />,
    sale: <FontAwesomeIcon icon={faShoppingCart} width={16} height={16} />,
    mint: <FontAwesomeIcon icon={faSeedling} width={16} height={16} />,
    burned: <FontAwesomeIcon icon={faTrash} width={16} height={16} />,
    listing_canceled: <FontAwesomeIcon icon={faXmark} width={16} height={16} />,
    ask_cancel: <FontAwesomeIcon icon={faXmark} width={16} height={16} />,
    offer_canceled: <FontAwesomeIcon icon={faXmark} width={16} height={16} />,
    ask: <FontAwesomeIcon icon={faTag} width={16} height={16} />,
    bid: <FontAwesomeIcon icon={faHand} width={16} height={16} />,
  }

  switch (activity?.type) {
    case 'ask_cancel': {
      activityDescription = 'Listing Canceled'
      break
    }
    case 'bid_cancel': {
      activityDescription = 'Offer Canceled'
      break
    }
    case 'mint': {
      activityDescription = 'Mint'
      break
    }
    case 'ask': {
      activityDescription = 'List'
      break
    }
    case 'bid': {
      activityDescription = 'Offer'
      break
    }
    case 'transfer': {
      activityDescription = 'Transfer'
      break
    }
    case 'sale': {
      activityDescription = 'Sale'
      break
    }
    default: {
      if (activity.type) activityDescription = activity.type
      break
    }
  }

  if (isSmallDevice) {
    return (
      <TableRow key={activity.txHash}>
        <TableData css={{ pr: '0' }}>
          <Flex direction="column" css={{ gap: '$3' }}>
            <Flex css={{ color: '$gray11' }} align="center" justify="between">
              <Flex align="center">
                {/* @ts-ignore */}
                {activity.type && logos[activity.type]}
                <Text
                  style="subtitle1"
                  css={{ ml: '$2', color: '$gray11', fontSize: '14px' }}
                >
                  {activityDescription}
                </Text>
              </Flex>
              <Flex align="center" justify="end" css={{ gap: '$3' }}>
                {!!activity.order?.source?.icon && (
                  <img
                    width="20px"
                    height="20px"
                    // @ts-ignore
                    src={activity.order?.source?.icon || ''}
                    alt={`${activity.order?.source?.name} Source`}
                  />
                )}
                <Text
                  style="subtitle2"
                  css={{ fontSize: '12px', color: '$gray11' }}
                >
                  {timeAgo}
                </Text>

                {activity.txHash && (
                  <Link href={`${blockExplorerBaseUrl}/tx/${activity.txHash}`}>
                    <a target="_blank" rel="noopener noreferrer">
                      <Box css={{ color: '$violet9' }}>
                        <FontAwesomeIcon
                          icon={faExternalLink}
                          width={12}
                          height={15}
                        />
                      </Box>
                    </a>
                  </Link>
                )}
              </Flex>
            </Flex>
            <Flex align="center" justify="between">
              <Link href={href} passHref>
                <a>
                  <Flex align="center">
                    <Image
                      style={{ borderRadius: '4px', objectFit: 'cover' }}
                      loader={({ src }) => src}
                      src={imageSrc}
                      alt={`${activity.token?.tokenName} Token Image`}
                      width={48}
                      height={48}
                    />
                    <Text ellipsify css={{ ml: '$2', fontSize: '14px' }}>
                      {activity.token?.tokenName ||
                        activity.token?.tokenId ||
                        activity.collection?.collectionName}
                    </Text>
                  </Flex>
                </a>
              </Link>
              {activity.price &&
              activity.price !== 0 &&
              activity.type &&
              !['transfer', 'mint'].includes(activity.type) ? (
                <Flex direction="column" align="center">
                  <FormatCryptoCurrency
                    amount={activity.price}
                    logoHeight={16}
                    textStyle="subtitle1"
                    css={{ mr: '$2', fontSize: '14px' }}
                  />
                  {/* TODO: convert to USD*/}
                </Flex>
              ) : (
                <span>-</span>
              )}
            </Flex>

            <Flex align="baseline" css={{ gap: '$2' }}>
              <Text
                style="subtitle2"
                css={{ fontSize: '12px', color: '$gray11' }}
              >
                From
              </Text>
              {activity.fromAddress &&
              activity.fromAddress !== constants.AddressZero ? (
                <Link href={`/address/${activity.fromAddress}`}>
                  <a>
                    <Text style="subtitle2" css={{ color: '$violet11' }}>
                      {fromShortAddress}
                    </Text>
                  </a>
                </Link>
              ) : (
                <span>-</span>
              )}
              <Text
                style="subtitle2"
                css={{ fontSize: '12px', color: '$gray11' }}
              >
                to
              </Text>
              {activity.toAddress &&
              activity.toAddress !== constants.AddressZero ? (
                <Link href={`/address/${activity.toAddress}`}>
                  <a>
                    <Text style="subtitle2" css={{ color: '$violet11' }}>
                      {toShortAddress}
                    </Text>
                  </a>
                </Link>
              ) : (
                <span>-</span>
              )}
            </Flex>
          </Flex>
        </TableData>
      </TableRow>
    )
  }

  return (
    <TableRow key={activity.txHash} css={{ height: '40px' }}>
      <TableData css={{ color: '$gray11' }}>
        <Flex align="center">
          {/* @ts-ignore */}
          {activity.type && logos[activity.type]}
          <Text
            style="subtitle1"
            css={{ ml: '$2', color: '$gray11', fontSize: '14px' }}
          >
            {activityDescription}
          </Text>
        </Flex>
      </TableData>
      <TableData>
        <Link href={href} passHref>
          <a>
            <Flex align="center">
              <Image
                style={{ borderRadius: '4px', objectFit: 'cover' }}
                loader={({ src }) => src}
                src={imageSrc}
                alt={`${activity.token?.tokenName} Token Image`}
                width={48}
                height={48}
              />
              <Text ellipsify css={{ ml: '$2', fontSize: '14px' }}>
                {activity.token?.tokenName ||
                  activity.token?.tokenId ||
                  activity.collection?.collectionName}
              </Text>
            </Flex>
          </a>
        </Link>
      </TableData>
      <TableData>
        {activity.price &&
        activity.price !== 0 &&
        activity.type &&
        !['transfer', 'mint'].includes(activity.type) ? (
          <Flex align="center">
            <FormatCryptoCurrency
              amount={activity.price}
              logoHeight={16}
              textStyle="subtitle1"
              css={{ mr: '$2', fontSize: '14px' }}
            />
            {/* TODO: convert to USD*/}
          </Flex>
        ) : (
          <span>-</span>
        )}
      </TableData>
      <TableData>
        {activity.amount ? (
          <Flex direction="column" align="start">
            <Text style="subtitle2" css={{ color: '$gray11' }}>
              Quantity
            </Text>
            <Text style="subtitle2">{activity.amount}</Text>
          </Flex>
        ) : (
          <span>-</span>
        )}
      </TableData>
      <TableData>
        {activity.fromAddress &&
        activity.fromAddress !== constants.AddressZero ? (
          <Link href={`/address/${activity.fromAddress}`}>
            <a>
              <Flex direction="column" align="start">
                <Text style="subtitle2" css={{ color: '$gray11' }}>
                  From
                </Text>
                <Text style="subtitle2" css={{ color: '$violet11' }}>
                  {fromShortAddress}
                </Text>
              </Flex>
            </a>
          </Link>
        ) : (
          <span>-</span>
        )}
      </TableData>
      <TableData>
        {activity.toAddress && activity.toAddress !== constants.AddressZero ? (
          <Link href={`/address/${activity.toAddress}`}>
            <a>
              <Flex direction="column" align="start">
                <Text style="subtitle2" css={{ color: '$gray11' }}>
                  To
                </Text>
                <Text style="subtitle2" css={{ color: '$violet11' }}>
                  {toShortAddress}
                </Text>
              </Flex>
            </a>
          </Link>
        ) : (
          <span>-</span>
        )}
      </TableData>
      <TableData>
        <Flex align="center" justify="end" css={{ gap: '$3' }}>
          {!!activity.order?.source?.icon && (
            <img
              width="20px"
              height="20px"
              // @ts-ignore
              src={activity.order?.source?.icon || ''}
              alt={`${activity.order?.source?.name} Source`}
            />
          )}
          <Text style="subtitle2" css={{ fontSize: '12px', color: '$gray11' }}>
            {timeAgo}
          </Text>

          {activity.txHash && (
            <Link href={`${blockExplorerBaseUrl}/tx/${activity.txHash}`}>
              <a target="_blank" rel="noopener noreferrer">
                <Box css={{ color: '$violet9' }}>
                  <FontAwesomeIcon
                    icon={faExternalLink}
                    width={12}
                    height={15}
                  />
                </Box>
              </a>
            </Link>
          )}
        </Flex>
      </TableData>
    </TableRow>
  )
}
