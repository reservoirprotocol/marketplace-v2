import {
  useCollectionActivity,
  useUsersActivity,
} from '@reservoir0x/reservoir-kit-ui'
import { FC, useEffect, useRef } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Text, Flex, FormatCryptoCurrency, Box, Anchor } from './primitives'
import { useIntersectionObserver } from 'usehooks-ts'
import Link from 'next/link'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import { useEnvChain, useTimeSince } from 'hooks'
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
import LoadingSpinner from './common/LoadingSpinner'
import { TableCell, TableRow } from './primitives/Table'

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
  const loadMoreRef = useRef<HTMLDivElement>(null)
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
      {!data.isValidating &&
      !data.isFetchingPage &&
      activities &&
      activities.length === 0 ? (
        <Flex direction="column" align="center" css={{ py: '$6', gap: '$4' }}>
          <img src="/activity-icon.svg" width={40} height={40} />
          <Text>No activity yet</Text>
        </Flex>
      ) : (
        <Flex direction="column" css={{ width: '100%' }}>
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
        </Flex>
      )}
      {data.isValidating && (
        <Flex align="center" justify="center" css={{ py: '$6' }}>
          <LoadingSpinner />
        </Flex>
      )}
    </>
  )
}

type ActivityTableRowProps = {
  activity: Activity
}

type Logos = {
  [key: string]: JSX.Element
}

const logos: Logos = {
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

type ActivityDescription = {
  [key: string]: string
}

const activityTypeToDesciptionMap: ActivityDescription = {
  ask_cancel: 'Listing Canceled',
  bid_cancel: 'Offer Canceled',
  mint: 'Mint',
  ask: 'List',
  bid: 'Offer',
  transfer: 'Transfer',
  sale: 'Sale',
}

const activityTypeToDesciption = (activityType: string) => {
  return activityTypeToDesciptionMap[activityType] || activityType
}

const formatAddress = (contract: string, userAddress: string) => {
  if (contract.toLowerCase() === userAddress.toLowerCase()) {
    return 'You'
  }

  return truncateAddress(contract)
}

const ActivityTableRow: FC<ActivityTableRowProps> = ({ activity }) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 700 })
  const { address } = useAccount()

  const envChain = useEnvChain()
  const blockExplorerBaseUrl =
    envChain?.blockExplorers?.default?.url || 'https://etherscan.io'
  const href = activity?.token?.tokenId
    ? `/${activity?.collection?.collectionId}/${activity?.token?.tokenId}`
    : `/collections/${activity?.collection?.collectionId}`

  if (!activity) {
    return null
  }

  let imageSrc: string = (
    activity?.token?.tokenId
      ? activity?.token?.tokenImage || activity?.collection?.collectionImage
      : activity?.collection?.collectionImage
  ) as string

  let activityDescription = activityTypeToDesciption(activity?.type || '')

  let toShortAddress = formatAddress(activity?.toAddress || '', address || '')
  let fromShortAddress = formatAddress(
    activity?.fromAddress || '',
    address || ''
  )

  if (isSmallDevice) {
    return (
      <TableRow key={activity.txHash} css={{ gridTemplateColumns: '1fr' }}>
        <TableCell css={{ pr: '0' }}>
          <Flex direction="column" css={{ gap: '$3' }}>
            <Flex css={{ color: '$gray11' }} align="center" justify="between">
              <Flex align="center">
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
                    src={(activity.order?.source?.icon as string) || ''}
                    alt={`${activity.order?.source?.name} Source`}
                  />
                )}
                <Text
                  style="subtitle3"
                  css={{ fontSize: '12px', color: '$gray11' }}
                >
                  {useTimeSince(activity?.timestamp)}
                </Text>

                {activity.txHash && (
                  <Link
                    href={`${blockExplorerBaseUrl}/tx/${activity.txHash}`}
                    passHref
                    legacyBehavior={true}
                  >
                    <Anchor
                      color="primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faExternalLink}
                        width={12}
                        height={15}
                      />
                    </Anchor>
                  </Link>
                )}
              </Flex>
            </Flex>
            <Flex align="center" justify="between">
              <Link href={href} passHref>
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
                </Flex>
              ) : (
                <span>-</span>
              )}
            </Flex>

            <Flex align="baseline" css={{ gap: '$2' }}>
              <Text
                style="subtitle3"
                css={{ fontSize: '12px', color: '$gray11' }}
              >
                From
              </Text>
              {activity.fromAddress &&
              activity.fromAddress !== constants.AddressZero ? (
                <Link href={`/address/${activity.fromAddress}`}>
                  <Anchor
                    color="primary"
                    weight="medium"
                    css={{ fontSize: 12 }}
                  >
                    {fromShortAddress}
                  </Anchor>
                </Link>
              ) : (
                <span>-</span>
              )}
              <Text
                style="subtitle3"
                css={{ fontSize: '12px', color: '$gray11' }}
              >
                to
              </Text>
              {activity.toAddress &&
              activity.toAddress !== constants.AddressZero ? (
                <Link href={`/address/${activity.toAddress}`}>
                  <Anchor
                    color="primary"
                    weight="medium"
                    css={{ fontSize: 12 }}
                  >
                    {toShortAddress}
                  </Anchor>
                </Link>
              ) : (
                <span>-</span>
              )}
            </Flex>
          </Flex>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableRow key={activity.txHash} css={{}}>
      <TableCell css={{ color: '$gray11' }}>
        <Flex align="center">
          {activity.type && logos[activity.type]}
          <Text
            style="subtitle1"
            css={{ ml: '$2', color: '$gray11', fontSize: '14px' }}
          >
            {activityDescription}
          </Text>
        </Flex>
      </TableCell>

      <TableCell>
        <Link href={href} passHref>
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
        </Link>
      </TableCell>
      <TableCell>
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
          </Flex>
        ) : (
          <span>-</span>
        )}
      </TableCell>
      <TableCell>
        {activity.amount ? (
          <Flex direction="column" align="start">
            <Text style="subtitle3" css={{ color: '$gray11' }}>
              Quantity
            </Text>
            <Text style="subtitle3">{activity.amount}</Text>
          </Flex>
        ) : (
          <span>-</span>
        )}
      </TableCell>
      <TableCell>
        {activity.fromAddress &&
        activity.fromAddress !== constants.AddressZero ? (
          <Flex direction="column" align="start">
            <Text style="subtitle3" css={{ color: '$gray11' }}>
              From
            </Text>
            <Link href={`/address/${activity.fromAddress}`}>
              <Anchor color="primary" weight="medium" css={{ fontSize: 12 }}>
                {fromShortAddress}
              </Anchor>
            </Link>
          </Flex>
        ) : (
          <span>-</span>
        )}
      </TableCell>
      <TableCell>
        {activity.toAddress && activity.toAddress !== constants.AddressZero ? (
          <Flex direction="column" align="start">
            <Text style="subtitle3" css={{ color: '$gray11' }}>
              To
            </Text>
            <Link href={`/address/${activity.fromAddress}`}>
              <Anchor color="primary" weight="medium" css={{ fontSize: 12 }}>
                {toShortAddress}
              </Anchor>
            </Link>
          </Flex>
        ) : (
          <span>-</span>
        )}
      </TableCell>
      <TableCell>
        <Flex align="center" justify="end" css={{ gap: '$3' }}>
          {!!activity.order?.source?.icon && (
            <img
              width="20px"
              height="20px"
              src={(activity.order?.source?.icon as string) || ''}
              alt={`${activity.order?.source?.name} Source`}
            />
          )}
          <Text style="subtitle3" css={{ color: '$gray11' }}>
            {useTimeSince(activity?.timestamp)}
          </Text>

          {activity.txHash && (
            <Anchor
              href={`${blockExplorerBaseUrl}/tx/${activity.txHash}`}
              color="primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faExternalLink} width={12} height={15} />
            </Anchor>
          )}
        </Flex>
      </TableCell>
    </TableRow>
  )
}
