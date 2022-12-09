import { useState, useEffect } from 'react'
import { styled } from '../../stitches.config'
import useUserCollections from '../../hooks/useUserCollections'
import { useUserTopBids } from '@reservoir0x/reservoir-kit-ui'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import { useMediaQuery } from 'react-responsive'
import { Flex, Box, Text, Value, Button, Tooltip } from '../primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBoltLightning,
  faEllipsisH,
  faInfoCircle,
  faRemove,
  faCircleMinus,
  faCircleNotch,
} from '@fortawesome/free-solid-svg-icons'
import { Table, Thead, TR } from './CollectionTable'
import round from '../../utils/round'
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons'

import {
  AcceptBidModal,
  useTokens,
  useCollections,
} from '@reservoir0x/reservoir-kit-ui'
import Link from 'next/link'

import { useAccount } from 'wagmi'
const Span = styled('span', {})

export const DesktopOnlyTd = styled('td', {
  display: 'none',
  '@lg': {
    display: 'table-cell',
  },
})

export const DesktopOnlyHr = styled('th', {
  display: 'none',
  '@lg': {
    display: 'table-cell',
  },
})

const HR = styled('hr', {
  borderWidth: 1,
  borderColor: '$gray6',

  my: '$3',
})

const TokenListItem = ({ token, owner, topBid, isMe }: any) => {
  const [image, setImage] = useState(token.token.image)
  return (
    <Box
      css={{
        mb: '$4',
        pb: '$4',
        borderBottom: '1px solid $gray5',
      }}
    >
      <Flex
        align="center"
        css={{
          mb: '$3',
        }}
      >
        <Box
          css={{
            width: 64,
            height: 64,
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: '$primary3',
          }}
        >
          {!!image && (
            <img
              src={image}
              onError={() => {
                setImage(token?.collection?.image || '')
              }}
              style={{ width: '100%', objectFit: 'cover' }}
            />
          )}
        </Box>
        <Box css={{ marginLeft: '$4', flex: 1 }}>
          <Flex align="center" css={{ marginBottom: 1 }}>
            <Text style="body2" css={{ color: '$gray10' }}>
              {token.token.collection.name}
            </Text>
          </Flex>
          <Text style="subtitle1">{token.token.name}</Text>
        </Box>
      </Flex>
      <Box>
        <Flex css={{ gap: '$5' }}>
          <Box>
            <Text
              style="body2"
              css={{ color: '$gray11', fontSize: 14, mb: '$1' }}
              as="p"
            >
              Floor
            </Text>

            <Value
              type="eth"
              value={token.token.collection.floorAskPrice || '0'}
            />
          </Box>

          <Box>
            <Text
              style="body2"
              css={{ color: '$gray11', fontSize: 14, mb: '$1' }}
              as="p"
            >
              You Get
            </Text>
            <Flex css={{ cursor: 'pointer', gap: '$2', alignItems: 'center' }}>
              <Value type="weth" value={round(token.value, 4)} />
              <img
                style={{ width: 20, height: 20 }}
                src={`https://api.reservoir.tools/redirect/sources/${token.source.domain}/logo/v2`}
              />
            </Flex>
          </Box>

          <Flex css={{ flex: 1 }} justify="end">
            {isMe && (
              <AcceptBidModal
                trigger={
                  <Button>
                    <FontAwesomeIcon icon={faBoltLightning} />
                    Sell
                  </Button>
                }
                collectionId={token.token.contract}
                tokenId={token.token.tokenId}
                onBidAccepted={(data) => {}}
              />
            )}
          </Flex>
        </Flex>
      </Box>
    </Box>
  )
}

const TokenRow = ({ token, owner, topBid, isMe }: any) => {
  const [image, setImage] = useState(token.token.image)

  const { data: tokens, error } = useTokens({
    tokens: [`${token.token.contract}:${token.token.tokenId}`],
  })

  const { data: collections } = useCollections({
    id: token.token.contract,
    limit: 1,
  })

  const collection = collections && collections[0] && collections[0]

  const royalties =
    (collections && collections[0] && collections[0].royalties?.bps) || 0

  let tokenData = tokens && tokens[0]

  let simulatedFloor =
    token.token.collection.floorAskPrice * (1 - 0.025 - royalties * 0.0001)

  let spread = (simulatedFloor - token.price) / simulatedFloor

  return !!token.token.image ? (
    <TR
      css={{
        borderBottom: '1px solid $gray5',
        '&:hover .open': {
          maxWidth: 200,
        },
      }}
    >
      <td>
        <Link href={`/${token.token.contract}/${token.token.tokenId}`}>
          <Flex
            css={{
              paddingTop: '$2',
              paddingBottom: '$2',
              maxWidth: 320,
              cursor: 'pointer',
            }}
            align="center"
          >
            <Box
              css={{
                width: 64,
                height: 64,
                borderRadius: 8,
                overflow: 'hidden',

                backgroundColor: '$primary3',
              }}
            >
              {!!image && (
                <img
                  src={image}
                  onError={() => {
                    setImage(token?.collection?.image || '')
                  }}
                  style={{ width: '100%', objectFit: 'cover' }}
                />
              )}
            </Box>
            <Box css={{ marginLeft: '$4', flex: 1 }}>
              <Flex align="center" css={{ marginBottom: 1 }}>
                <Text style="body2" css={{ color: '$gray10' }}>
                  {token.token.collection.name}
                </Text>
              </Flex>
              <Text style="subtitle1">{token.token.name}</Text>
            </Box>
          </Flex>
        </Link>
      </td>

      <DesktopOnlyTd
        css={{
          '@lg': {
            display: 'table-cell',
          },
        }}
      >
        {!tokenData ? (
          <FontAwesomeIcon icon={faCircleNotch} spin />
        ) : (
          <Value
            type="eth"
            value={round(tokenData?.token?.lastSell?.value || 0, 5).toString()}
          />
        )}
      </DesktopOnlyTd>
      <td>
        <Flex
          css={{
            cursor: 'pointer',
            gap: '$2',
            alignItems: 'center',
          }}
        >
          <Value
            type="eth"
            value={round(collection?.floorAsk?.price?.amount?.native || 0, 2)}
          />

          <img
            style={{ width: 20, height: 20 }}
            src={`https://api.reservoir.tools/redirect/sources/${collection?.floorAsk?.sourceDomain}/logo/v2`}
          />
        </Flex>
      </td>

      <td>
        <Flex>
          <Tooltip
            content={
              <Box css={{ width: 300 }}>
                <Flex justify="between" css={{ mb: '$2' }}>
                  <Text style="body1" as="p">
                    Total Bid
                  </Text>
                  <Value type="weth" value={round(token.price, 4)} />
                </Flex>

                {token.feeBreakdown.map((fee: any) => (
                  <Flex
                    justify="between"
                    css={{ mb: '$2' }}
                    key={fee.type + fee.bps}
                  >
                    <Text style="body1" as="p">
                      <Span css={{ color: '$gray9', mr: '$1' }}>
                        <FontAwesomeIcon icon={faCircleMinus} />
                      </Span>{' '}
                      {fee.kind} ({round(fee.bps / 100, 2)}%)
                    </Text>
                    <Value
                      type="weth"
                      value={round((fee.bps / 10000) * token.price, 4)}
                    />
                  </Flex>
                ))}

                <HR />

                <Flex justify="between">
                  <Text style="body1" as="p">
                    You Receive
                  </Text>
                  <Value type="weth" value={round(token.value, 4)} />
                </Flex>
              </Box>
            }
          >
            <Box>
              <Flex
                css={{
                  cursor: 'pointer',
                  gap: '$2',
                  alignItems: 'center',
                }}
              >
                <Value type="weth" value={round(token.value, 4)} />
                <img
                  style={{ width: 20, height: 20 }}
                  src={`https://api.reservoir.tools/redirect/sources/${token.source.domain}/logo/v2`}
                />
              </Flex>
            </Box>
          </Tooltip>
        </Flex>
      </td>
      <DesktopOnlyTd>
        <Text
          style="subtitle1"
          css={{
            px: '$2',
            py: '$1',
            borderRadius: 8,
            backgroundColor:
              spread < 0.05 ? '$green2' : spread < 0.1 ? '$amber2' : '$red2',
            color:
              spread < 0.05 ? '$green9' : spread < 0.1 ? '$amber11' : '$red9',
          }}
        >
          {round(spread * 100, 2).toString() + '%'}
        </Text>
      </DesktopOnlyTd>
      <td style={{ textAlign: 'right' }}>
        <Flex justify="end">
          {isMe && (
            <>
              {!!topBid && (
                <AcceptBidModal
                  trigger={
                    <Button css={{ ml: '$3' }}>
                      <FontAwesomeIcon icon={faBoltLightning} />
                      Sell
                    </Button>
                  }
                  collectionId={token.token.contract}
                  tokenId={token.token.tokenId}
                  onBidAccepted={(data) => {}}
                />
              )}
            </>
          )}

          {false && (
            <Button css={{ pr: 0 }} color="ghost">
              <FontAwesomeIcon icon={faEllipsisH} />
            </Button>
          )}
        </Flex>
      </td>
    </TR>
  ) : null
}

const CollectionBlock = ({ collection: data, onSelect, isSelected }: any) => {
  const { collection, ownership } = data

  return (
    <Flex
      onClick={onSelect}
      direction="column"
      css={{
        cursor: 'pointer',
        background: '$gray2',
        border: `1px solid ${isSelected ? '$gray11' : '$gray5'}`,
        transition: 'border 300ms ease-in-out',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 8,
        position: 'relative',
        minWidth: 180,
        width: 180,
        overflow: 'hidden',
        '&:hover > div:first-of-type': {
          transform: 'scale(1.1)',
        },
      }}
    >
      <Box
        css={{
          backgroundColor: '$gray2',
          //backgroundImage: `url("${collection.banner}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'all 200ms',
          overflow: 'hidden',
          width: '100%',
        }}
      />

      <Box css={{ p: '$3' }}>
        <img
          src={collection.image}
          style={{
            width: 40,
            height: 40,
            borderRadius: 6,

            objectFit: 'cover',
          }}
        />
      </Box>

      <Box css={{ position: 'absolute', right: '$3', top: '$3' }}>
        <Flex
          css={{
            borderRadius: '4px',
            fontSize: '12px',
            color: '$gray11',
          }}
        >
          <Box>
            <FontAwesomeIcon icon={faLayerGroup} size="1x" />
          </Box>

          <Box>
            <Text
              style="subtitle2"
              as="p"
              css={{
                ml: '$1',
                fontWeight: 700,
                color: '$gray11',
              }}
            >
              {ownership.tokenCount}
            </Text>
          </Box>
        </Flex>
      </Box>
      <Flex
        css={{
          p: '$3',
          pt: '$0',
          //backgroundColor: "$gray1",
          height: 90,
          zIndex: 100,
        }}
        direction="column"
        justify={'between'}
      >
        <Text
          style="subtitle1"
          css={{
            fontSize: 14,
            zIndex: 100,
            display: '-webkit-box',
            color: isSelected ? '$' : '$gray12',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {collection.name}
        </Text>

        <Flex
          css={{
            cursor: 'pointer',
            gap: '$2',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Value type="weth" value={round(collection.topBidValue, 4)} />
          <img
            style={{ width: 18, height: 18, display: 'none' }}
            src={`https://api.reservoir.tools/redirect/sources/${collection.topBidSourceDomain}/logo/v2`}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

const TokenTable = ({ address }: any) => {
  const [selectedCollection, setCollection] = useState(null as any)
  const { address: me } = useAccount()
  const isMe = me === address
  const {
    data: tokens,
    mutate,
    fetchNextPage,
    hasNextPage,
    isFetchingPage,
  } = useUserTopBids(address, {
    sortDirection: 'desc',
    collection: selectedCollection?.collection?.id,
    limit: 20,
  })

  const isMobile = useMediaQuery({ query: '(max-width: 720px)' })

  const { data } = useUserCollections(address || '')

  const [sentryRef] = useInfiniteScroll({
    rootMargin: '0px 0px 800px 0px',
    loading: isFetchingPage,
    hasNextPage,
    onLoadMore: () => {
      fetchNextPage()
    },
  } as any)

  useEffect(() => {
    mutate([])
  }, [address])

  useEffect(() => {
    setCollection(null)
  }, [address])
  return isMobile ? (
    <>
      <Box>
        {tokens &&
          tokens.map((token: any) => {
            return (
              <TokenListItem
                key={token.token.tokenId + token.token.contract}
                token={token}
                topBid={token?.value}
                owner={address}
                isMe={isMe}
              />
            )
          })}
      </Box>

      {isFetchingPage && (
        <div ref={sentryRef}>
          <div className="flex justify-center">loading</div>
        </div>
      )}
    </>
  ) : (
    <>
      <Flex
        css={{ gap: '$4', mb: '$4', overflowX: 'auto', overflowY: 'visible,' }}
      >
        {selectedCollection && false ? (
          <Flex
            onClick={() => setCollection(null)}
            css={{
              border: '1px solid $gray7',
              borderRadius: 8,
              overflow: 'hidden',
              p: '$4',
              py: '$4',
            }}
            align="center"
          >
            <img
              src={selectedCollection.collection.image}
              style={{ width: 40, height: 40, borderRadius: 8 }}
            />
            <Flex
              css={{
                ml: '$4',
                width: 32,
                height: 32,
                fontSize: '12px',
                backgroundColor: '$primary2',
                borderRadius: '50%',
              }}
              align="center"
              justify="center"
            >
              <Box css={{ width: 14, color: '$gray11' }}>
                <FontAwesomeIcon icon={faRemove} size="1x" />
              </Box>
            </Flex>
          </Flex>
        ) : (
          data
            ?.filter((collection: any) => collection.collection.topBidValue)
            .sort(
              (a: any, b: any) =>
                b.ownership.tokenCount - a.ownership.tokenCount
            )
            .map((collection: any) => {
              return (
                <CollectionBlock
                  key={JSON.stringify(collection)}
                  isSelected={collection == selectedCollection}
                  collection={collection}
                  onSelect={() => {
                    setCollection(
                      selectedCollection == collection ? null : collection
                    )
                  }}
                />
              )
            })
        )}
      </Flex>

      <Table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          borderSpacing: '16px 0rem',
        }}
      >
        <Thead
          css={{
            backgroundColor: '$gray5',
            textAlign: 'left',
            borderRadius: 8,
            overflow: 'hidden',
            padding: '$3',

            position: 'sticky',
            top: 24 + 80,
            zIndex: 2,
          }}
        >
          <TR
            css={{
              backgroundColor: '$gray4',
              fontSize: 14,
              textAlign: 'left',
              borderRadius: '8px',
              overflow: 'hidden',
              padding: '$3',
              marginBottom: '$4',
              color: '$gray12',
              $$focusColor: '$colors$gray1',
              boxShadow:
                '0px 4px 12px rgba(0, 0, 0, 0.1), 0px 0px 0px 1px $colors$gray5',
            }}
          >
            <th
              style={{
                paddingTop: 12,
                paddingBottom: 12,
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
                overflow: 'hidden',
              }}
            >
              Token
            </th>

            <DesktopOnlyHr
              style={{
                paddingTop: 12,
                paddingBottom: 12,
              }}
            >
              Last Sale
            </DesktopOnlyHr>

            <th
              style={{
                paddingTop: 12,
                paddingBottom: 12,
                overflow: 'hidden',
              }}
            >
              Collection Floor
            </th>

            <th
              style={{
                paddingTop: 12,
                paddingBottom: 12,
              }}
            >
              You Get
            </th>

            <DesktopOnlyHr
              style={{
                paddingTop: 12,
                paddingBottom: 12,
              }}
            >
              <Flex css={{ gap: '$1' }} align="center">
                Floor Difference
                <Tooltip
                  content={
                    <Box css={{ maxWidth: 300 }}>
                      <Text style="body1">
                        The percent difference between what you would get for
                        accepting the top bid vs what you would get listing on
                        the floor.
                      </Text>
                    </Box>
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                </Tooltip>
              </Flex>
            </DesktopOnlyHr>

            <th
              style={{
                padding: 12,
                paddingRight: 32,
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
                textAlign: 'right',
              }}
            ></th>
          </TR>
        </Thead>
        <tbody>
          {tokens &&
            tokens.map((token: any) => {
              return (
                <TokenRow
                  key={token.token.tokenId + token.token.contract}
                  token={token}
                  topBid={token?.price}
                  owner={address}
                  isMe={isMe}
                />
              )
            })}
        </tbody>
      </Table>

      {isFetchingPage && (
        <div ref={sentryRef}>
          <div className="flex justify-center">loading</div>
        </div>
      )}
    </>
  )
}

export default TokenTable
