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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  useCollectionActivity,
  useTokenActivity,
  useUsersActivity,
} from '@reservoir0x/reservoir-kit-ui'
import LoadingSpinner from 'components/common/LoadingSpinner'
import { constants } from 'ethers'
import { useENSResolver, useMarketplaceChain, useTimeSince } from 'hooks'
import Link from 'next/link'
import { FC, useEffect, useRef } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useIntersectionObserver } from 'usehooks-ts'
import {
  Anchor,
  Box,
  Flex,
  FormatCryptoCurrency,
  TableCell,
  TableRow,
  Text,
} from '../primitives'

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

type TokenActivityResponse = ReturnType<typeof useTokenActivity>
type TokenActivity = TokenActivityResponse['data'][0]
export type TokenActivityTypes = NonNullable<
  Exclude<Parameters<typeof useTokenActivity>['1'], boolean>
>['types']

type Activity = CollectionActivity | UsersActivity | TokenActivity
type Source = 'token' | 'user' | 'collection'

type Props = {
  data: ActivityResponse
}
type TokenActivityTableProps = {
  id: string
  activityTypes: NonNullable<
    Exclude<Parameters<typeof useTokenActivity>['1'], boolean>
  >['types']
}

export const TokenActivityTable: FC<TokenActivityTableProps> = ({
  id,
  activityTypes,
}) => {
  const data = useTokenActivity(
    id,
    {
      types: activityTypes,
    },
    {
      revalidateOnMount: true,
      fallbackData: [],
    }
  )

  useEffect(() => {
    data.mutate()
    return () => {
      data.setSize(1)
    }
  }, [])

  return <ActivityTable data={data} />
}

export const ActivityTable: FC<Props> = ({ data }) => {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})

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
          <img src="/icons/activity-icon.svg" width={40} height={40} />
          <Text>No activity yet</Text>
        </Flex>
      ) : (
        <Flex
          direction="column"
          css={{
            height: data.isLoading ? '225px' : '450px',
            overflowY: 'auto',
            width: '100%',
            pb: '$2',
            pr: 15,
          }}
        >
          {activities.map((activity, i) => {
            if (!activity) return null

            return (
              <ActivityTableRow
                key={`${activity?.txHash}-${i}`}
                activity={activity}
              />
            )
          })}
          <Box ref={loadMoreRef} css={{ height: 20 }}></Box>
        </Flex>
      )}
      {data.isValidating && (
        <Flex
          align="center"
          justify="center"
          css={{
            py: '$5',
          }}
        >
          <LoadingSpinner />
        </Flex>
      )}
    </>
  )
}

type ActivityTableRowProps = {
  source?: Source
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

const ActivityTableRow: FC<ActivityTableRowProps> = ({ activity }) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 700 })
  const marketplaceChain = useMarketplaceChain()
  const blockExplorerBaseUrl =
    marketplaceChain?.blockExplorers?.default?.url || 'https://etherscan.io'

  if (!activity) {
    return null
  }

  let activityDescription = activityTypeToDesciption(activity?.type || '')

  const { displayName: toDisplayName } = useENSResolver(activity?.toAddress)
  const { displayName: fromDisplayName } = useENSResolver(activity?.fromAddress)

  if (isSmallDevice) {
    return (
      <TableRow
        key={activity.txHash}
        css={{
          gridTemplateColumns: '0.75fr 1fr',
        }}
      >
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
          <Flex
            align="center"
            justify="end"
            css={{
              gap: '$3',
            }}
          >
            {!!activity.order?.source?.icon && (
              <img
                width="20px"
                height="20px"
                src={(activity.order?.source?.icon as string) || ''}
                alt={`${activity.order?.source?.name} Source`}
              />
            )}
            <Text style="subtitle3" color="subtle">
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
          <Flex
            align="baseline"
            justify="end"
            css={{
              gap: '$3',
            }}
          >
            {activity.fromAddress &&
            activity.fromAddress !== constants.AddressZero ? (
              <Link href={`/profile/${activity.fromAddress}`}>
                <Text
                  style="subtitle3"
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
            <Text
              style="subtitle3"
              css={{ fontSize: '12px', color: '$gray11' }}
            >
              to
            </Text>
            {activity.toAddress &&
            activity.toAddress !== constants.AddressZero ? (
              <Link href={`/profile/${activity.toAddress}`}>
                <Text
                  style="subtitle3"
                  css={{
                    color: '$primary11',
                    '&:hover': {
                      color: '$primary10',
                    },
                  }}
                >
                  {toDisplayName}
                </Text>
              </Link>
            ) : (
              <span>-</span>
            )}
          </Flex>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableRow
      key={activity.txHash}
      css={{
        gridTemplateColumns: '1fr 1fr',
      }}
    >
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
        <Flex
          align="center"
          justify="end"
          css={{
            gap: '$3',
          }}
        >
          {!!activity.order?.source?.icon && (
            <img
              width="20px"
              height="20px"
              src={(activity.order?.source?.icon as string) || ''}
              alt={`${activity.order?.source?.name} Source`}
            />
          )}
          <Text style="subtitle3" color="subtle">
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
        <Flex
          justify="end"
          css={{
            gap: '$3',
          }}
        >
          {activity.fromAddress &&
          activity.fromAddress !== constants.AddressZero ? (
            <Link
              style={{
                display: 'flex',
              }}
              href={`/profile/${activity.fromAddress}`}
            >
              <Text
                style="subtitle3"
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
          <Text style="subtitle3" css={{ fontSize: '12px', color: '$gray11' }}>
            to
          </Text>
          {activity.toAddress &&
          activity.toAddress !== constants.AddressZero ? (
            <Link
              style={{
                display: 'flex',
              }}
              href={`/profile/${activity.toAddress}`}
            >
              <Text
                style="subtitle3"
                css={{
                  color: '$primary11',
                  '&:hover': {
                    color: '$primary10',
                  },
                }}
              >
                {toDisplayName}
              </Text>
            </Link>
          ) : (
            <span>-</span>
          )}
        </Flex>
      </TableCell>
    </TableRow>
  )
}
