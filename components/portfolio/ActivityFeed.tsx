import { Text, Flex, Box } from '../primitives'
import {
  faArrowRight,
  faHand,
  faMoneyBillWave,
  faStar,
  faTag,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useUserActivity from '../../hooks/useUserActivity'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import useTimeSince from 'hooks/useTimeSince'

const shortenAddress = (address: string) => {
  return address.slice(0, 4) + '...' + address.slice(-4 - 1)
}

const activityDescription = (activity: any, address: string) => {
  switch (activity.type) {
    case 'mint':
      return (
        <span>
          Minted{' '}
          <span style={{ fontWeight: '700' }}>{activity.token.tokenName}</span>{' '}
          for {activity.price} ETH
        </span>
      )

    case 'ask':
      return (
        <span>
          Listed{' '}
          <span style={{ fontWeight: '700' }}>{activity.token.tokenName}</span>{' '}
          for {activity.price} ETH
        </span>
      )

    case 'bid':
      if (activity.token.tokenId) {
        return (
          <span>
            Bid on{' '}
            <span style={{ fontWeight: '700' }}>
              {activity.token.tokenName}
            </span>{' '}
            for {activity.price} WETH
          </span>
        )
      } else {
        return (
          <span>
            Made a collection offer on{' '}
            <span style={{ fontWeight: '700' }}>
              {activity.collection.collectionName}
            </span>{' '}
            for {activity.price} WETH
          </span>
        )
      }
    case 'transfer':
      if (activity.toAddress.toLowerCase() === address.toLowerCase()) {
        return (
          <span>
            Received{' '}
            <span style={{ fontWeight: '700' }}>
              {activity.token.tokenName}
            </span>{' '}
            from {shortenAddress(activity.fromAddress)}
          </span>
        )
      } else {
        return (
          <span>
            Sent{' '}
            <span style={{ fontWeight: '700' }}>
              {activity.token.tokenName}
            </span>{' '}
            to {shortenAddress(activity.toAddress)}
          </span>
        )
      }
    case 'sale':
      if (activity.toAddress.toLowerCase() === address.toLowerCase()) {
        return (
          <span>
            Bought{' '}
            <span style={{ fontWeight: '700' }}>
              {activity.token.tokenName}
            </span>{' '}
            for {activity.price} ETH
          </span>
        )
      } else {
        return (
          <span>
            Sold{' '}
            <span style={{ fontWeight: '700' }}>
              {activity.token.tokenName}
            </span>{' '}
            for {activity.price} ETH
          </span>
        )
      }
  }
}

const typeToColor: any = {
  mint: '$mint9',
  ask: '$amber9',
  transfer: '$sky9',
  sale: '$lime9',
  bid: '$yellow9',
}

const typeToIcon: any = {
  mint: faStar,
  ask: faTag,
  transfer: faArrowRight,
  sale: faMoneyBillWave,
  bid: faHand,
}

const Activity = ({ activity, address }: any) => {
  return (
    <Flex
      css={{
        py: '$3',
        mb: '$3',
        borderBottom: '1px solid $gray4',
      }}
    >
      <Flex
        css={{
          width: 40,
          height: 40,
          mr: '$4',
          borderRadius: '50%',
          border: '1px solid $gray5',
          backgroundColor: '$gray1',
          p: '$2',
        }}
        direction="column"
        justify="center"
        align="center"
      >
        <Box
          css={{
            color: typeToColor[activity.type],
          }}
        >
          <FontAwesomeIcon
            icon={typeToIcon[activity.type]}
            style={{ width: 18 }}
          />
        </Box>
      </Flex>
      <Box css={{ width: '100%' }}>
        <Text style={'body1'} css={{ fontWeight: 400 }}>
          {activityDescription(activity, address)}
        </Text>
        <Flex css={{ mt: '$3', mb: '$2', width: '100%' }}>
          <Box css={{ width: '100%' }}>
            <img
              src={
                activity.token.tokenImage || activity.collection.collectionImage
              }
              style={{ maxWidth: 400, width: '100%', borderRadius: 8 }}
            />
          </Box>
        </Flex>
        <Text css={{ color: '$gray11' }} style="body2">
          {useTimeSince(activity.timestamp)}
        </Text>
      </Box>
    </Flex>
  )
}
const ActivityFeed = ({ address }: any) => {
  const { data, setSize, size, isFinished, isLoading } =
    useUserActivity(address)

  const [sentryRef] = useInfiniteScroll({
    rootMargin: '0px 0px 800px 0px',
    loading: isLoading,
    hasNextPage: !isFinished,
    onLoadMore: () => {
      setSize(size + 1)
    },
  } as any)
  return (
    <Box>
      {data
        .filter(
          (act: any) => act.token.tokenImage || act.collection.collectionImage
        )
        .map((act: any) => (
          <Activity
            key={JSON.stringify(act)}
            activity={act}
            address={address}
          />
        ))}

      {!isLoading && !isFinished && (
        <div ref={sentryRef}>
          <div className="flex justify-center">loading</div>
        </div>
      )}
    </Box>
  )
}

export default ActivityFeed
