import { useState } from 'react'
import { styled } from '../../stitches.config'
import { Box, Text, Flex, Value } from '../primitives'
import round from '../../utils/round'
import useUserCollections from '../../hooks/useUserCollections'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import { useMediaQuery } from 'react-responsive'
import { DesktopOnlyHr, DesktopOnlyTd } from './OldTokenTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

export const Table = styled('table', {
  '& > tr:nth-child(2n + 1)': {
    backgroundColor: '$primary1',
  },

  '& > tr:hover': {
    backgroundColor: '$primary2',
  },

  width: '100%',
  borderCollapse: 'collapse',
  borderSpacing: '16px 0rem',
})

export const Thead = styled('thead', {
  backgroundColor: '$gray5',
  textAlign: 'left',
  borderRadius: 8,
  overflow: 'hidden',
  padding: '$3',

  position: 'sticky',
  top: 24 + 80,
  zIndex: 2,
})

export const TR = styled('tr', {
  '& td, & th': {
    paddingLeft: '$3',
    paddingRight: '$3',
  },
})

type PercentChangeProps = {
  percent: number
}

const CollectionListItem = ({ collection }: any) => {
  let image = collection.collection.image
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
            <img src={image} style={{ width: '100%', objectFit: 'cover' }} />
          )}
        </Box>
        <Box css={{ marginLeft: '$4', flex: 1 }}>
          <Text style="subtitle1">{collection.collection.name}</Text>
          <Flex align="center" css={{ marginTop: 1 }}>
            <Text style="body2" css={{ color: '$gray10' }}>
              {Number(collection.collection.tokenCount).toLocaleString('en-US')}{' '}
              tokens
            </Text>
          </Flex>
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
              value={collection.collection.floorAskPrice || '0'}
            />
          </Box>

          <Box>
            <Text
              style="body2"
              css={{ color: '$gray11', fontSize: 14, mb: '$1' }}
              as="p"
            >
              Top Bid
            </Text>
            <Flex css={{ cursor: 'pointer', gap: '$2', alignItems: 'center' }}>
              <Value
                type="weth"
                value={round(collection.collection.topBidValue || '0', 4)}
              />
              {collection.collection.topBidValue && (
                <img
                  style={{ width: 20, height: 20 }}
                  src={`https://api.reservoir.tools/redirect/sources/${collection.collection.topBidSourceDomain}/logo/v2`}
                />
              )}
            </Flex>
          </Box>

          <Flex css={{ flex: 1 }} justify="end"></Flex>
        </Flex>
      </Box>
    </Box>
  )
}

const PercentChange = ({ percent }: PercentChangeProps) => {
  const isPositive = round(percent, 2) > 0
  return (
    <Flex css={{ color: isPositive ? '$green9' : '$red9' }} align="center">
      <FontAwesomeIcon
        icon={isPositive ? faCaretUp : faCaretDown}
        size="sm"
        style={{ fontSize: 12 }}
      />
      <Text
        style="body2"
        css={{
          color: isPositive ? '$green9' : '$red9',
          ml: '$1',
        }}
      >
        {round(percent, 2)}%
      </Text>
    </Flex>
  )
}

const CollectionRow = ({ collection, owner, ...props }: any) => {
  const [image, setImage] = useState(collection.collection.image)

  return collection.collection.image ? (
    <TR
      css={{
        borderBottom: '1px solid $gray5',
      }}
      {...props}
    >
      <td>
        <Flex
          css={{ paddingTop: '$2', paddingBottom: '$2', maxWidth: 320 }}
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
              <img src={image} style={{ width: '100%', objectFit: 'cover' }} />
            )}
          </Box>

          <Box css={{ marginLeft: '$4', flex: 1 }}>
            <Flex align="center" css={{ marginBottom: 1 }}></Flex>
            <Text style="subtitle1">{collection.collection.name}</Text>
          </Box>
        </Flex>
      </td>

      <td>
        <Flex align="center" css={{ gap: '$2' }}>
          <Value type="weth" value={collection.collection.topBidValue || '0'} />
          {collection.collection.topBidValue && (
            <img
              style={{ width: 20, height: 20 }}
              src={`https://api.reservoir.tools/redirect/sources/${collection.collection.topBidSourceDomain}/logo/v2`}
            />
          )}
        </Flex>
      </td>
      <td>
        <Value type="eth" value={collection.collection.floorAskPrice || '0'} />
      </td>

      <DesktopOnlyTd>
        <Text style="subtitle1">
          {collection.ownership.onSaleCount} / {collection.ownership.tokenCount}
        </Text>
      </DesktopOnlyTd>

      <td>
        <Value
          type="eth"
          value={round(collection.collection.volume['7day'] || '0', 1)}
        />
        <PercentChange percent={collection.collection.volumeChange['7day']} />
      </td>

      <DesktopOnlyTd>
        <Value
          type="eth"
          value={round(collection.collection.volume['1day'] || '0', 1)}
        />

        <PercentChange percent={collection.collection.volumeChange['1day']} />
      </DesktopOnlyTd>
    </TR>
  ) : null
}

const CollectionTable = ({ address }: any) => {
  const { data, setSize, size, isFinished, isLoading } =
    useUserCollections(address)

  const [sentryRef] = useInfiniteScroll({
    rootMargin: '0px 0px 800px 0px',
    loading: isLoading,
    hasNextPage: !isFinished,
    onLoadMore: () => {
      setSize(size + 1)
    },
  } as any)

  const isMobile = useMediaQuery({ query: '(max-width: 720px)' })
  return isMobile ? (
    <Box>
      {data &&
        data.map((collection: any) => {
          return (
            <CollectionListItem
              key={collection.collection.id}
              collection={collection}
            />
          )
        })}
    </Box>
  ) : (
    <>
      <Table>
        <Thead>
          <TR
            css={{
              backgroundColor: '$primary3',
              fontSize: 14,
              textAlign: 'left',
              borderRadius: '8px',
              overflow: 'hidden',
              padding: '$3',
              marginBottom: '$4',
              color: '$primary11',
              $$focusColor: '$colors$gray1',
              boxShadow:
                '0px 4px 12px rgba(0, 0, 0, 0.1), 0px 0px 0px 1px $colors$primary4 ',
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
              Collection
            </th>

            <th
              style={{
                paddingTop: 12,
                paddingBottom: 12,
                overflow: 'hidden',
              }}
            >
              Top Bid
            </th>
            <th
              style={{
                paddingTop: 12,
                paddingBottom: 12,
                overflow: 'hidden',
              }}
            >
              Floor
            </th>

            <DesktopOnlyHr
              style={{
                paddingTop: 12,
                paddingBottom: 12,
                overflow: 'hidden',
              }}
            >
              # Listed / Owned
            </DesktopOnlyHr>

            <th
              style={{
                paddingTop: 12,
                paddingBottom: 12,
              }}
            >
              7d volume
            </th>

            <DesktopOnlyHr
              style={{
                paddingTop: 12,
                paddingBottom: 12,
              }}
            >
              24hr volume
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
          {data &&
            data?.map((collection: any) => {
              return (
                <CollectionRow
                  key={Math.random()}
                  collection={collection}
                  owner={address}
                />
              )
            })}
        </tbody>
      </Table>

      {!isLoading && !isFinished && (
        <div ref={sentryRef}>
          <div className="flex justify-center">loading</div>
        </div>
      )}
    </>
  )
}
export default CollectionTable
