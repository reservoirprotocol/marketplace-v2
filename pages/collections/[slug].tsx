import { NextPage } from 'next'
import {
  Text,
  Switch,
  Flex,
  Box,
  FormatCryptoCurrency,
} from '../../components/primitives'
import {
  useCollections,
  useTokens,
  useAttributes,
} from '@reservoir0x/reservoir-kit-ui'
import Layout from 'components/Layout'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFlag,
  faChevronUp,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { truncateAddress } from 'utils/truncate'
import StatHeader from 'components/collections/StatHeader'
import CollectionActions from 'components/collections/CollectionActions'

const AttributeSelector = ({ attribute }) => {
  const [open, setOpen] = useState(false)

  return (
    <Box css={{ pt: '$2', borderBottom: '1px solid $gray7' }}>
      <Flex
        align="center"
        justify="between"
        css={{ mb: '$3', cursor: 'pointer' }}
        onClick={() => setOpen(!open)}
      >
        <Text as="h5" style="h6">
          {attribute.key}
        </Text>
        <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
      </Flex>
      {open && (
        <Box css={{ maxHeight: 300, overflow: 'auto', pb: '$2' }}>
          {attribute.values
            .sort((a, b) => b.count - a.count)
            .map((value) => (
              <Flex css={{ mb: '$3', gap: '$3' }} align="center">
                <Flex align="center">
                  <Switch />
                </Flex>
                <Text
                  style="body1"
                  css={{
                    color: '$gray11',
                    flex: 1,
                    whiteSpace: 'pre',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {value.value}
                </Text>

                <Text style="body2" css={{ color: '$gray11' }}>
                  {value.count}
                </Text>
              </Flex>
            ))}
        </Box>
      )}
    </Box>
  )
}

const TokenCard = ({ token }) => (
  <Box
    css={{
      border: '1px solid $gray7',
      borderRadius: 8,
      overflow: 'hidden',
      background: '$gray4',
    }}
  >
    <img src={token.token.image} />
    <Box css={{ p: '$3' }}>
      <Flex css={{ mb: '$4' }}>
        <Text
          style="subtitle1"
          as="p"
          css={{
            mb: '$1',
            pr: '$1',
            flex: 1,
            overflow: 'hidden',
            whiteSpace: 'pre',
            textOverflow: 'ellipsis',
          }}
        >
          {token.token.name || '#' + token.token.tokenId}{' '}
        </Text>
        {token.token.isFlagged ? (
          <Flex
            align="center"
            css={{
              border: '1px solid $gray9',
              px: '$2',
              py: '$1',
              background: '$red9',

              borderRadius: 8,
            }}
          >
            <Box css={{ color: '$red12', fontSize: 10 }}>
              <FontAwesomeIcon icon={faFlag} />
            </Box>
          </Flex>
        ) : (
          <Box
            css={{
              border: '1px solid $gray9',
              px: '$2',
              py: '$1',
              background: '$gray6',
              borderRadius: 8,
            }}
          >
            <Text style="body2" as="p" css={{ fontWeight: 800 }}>
              # {token.token.rarityRank}
            </Text>
          </Box>
        )}
      </Flex>

      <Flex align="center" css={{ gap: '$2' }}>
        <Box css={{ flex: 1 }}>
          <FormatCryptoCurrency
            logoWidth={11}
            css={{ fontSize: 16, fontWeight: 600, color: 'white' }}
            amount={token.market?.floorAsk?.price?.amount?.decimal}
            address={token.market?.floorAsk?.price?.currency?.contract}
          />
        </Box>
        <img
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
          }}
          src={`https://api.reservoir.tools/redirect/sources/${token.market.floorAsk.source.name}/logo/v2`}
        />
      </Flex>
    </Box>
  </Box>
)

const IndexPage: NextPage = () => {
  const router = useRouter()
  const { slug } = router.query

  const { data: collections } = useCollections({
    id: slug as string,
    includeTopBid: true,
  })

  let collection = collections && collections[0]

  const { data: tokens } = useTokens({
    collection: collection?.id,
  })

  let { data: attributes } = useAttributes(collection?.id)

  return (
    <Layout>
      {collection ? (
        <Box css={{ p: '$5', pb: 0 }}>
          <Flex justify="between">
            <Flex direction="column" css={{ gap: '$4' }}>
              <Flex css={{ gap: '$4', flex: 1 }} align="center">
                <img
                  src={collection.image}
                  style={{ width: 64, height: 64, borderRadius: 8 }}
                />
                <Box>
                  <Flex align="center">
                    <Text style="h5" as="h6">
                      {collection.name}
                    </Text>
                  </Flex>
                  <Text style="body2" css={{ color: '$gray11' }} as="p">
                    {truncateAddress(collection.id)}
                  </Text>
                </Box>
              </Flex>
              <StatHeader collection={collection} />
            </Flex>
            <CollectionActions collection={collection} />
          </Flex>

          <Flex
            css={{
              borderBottom: '1px solid $gray5',
              mt: '$5',
              mb: '$5',
              gap: '$5',
            }}
          >
            <Box css={{ pb: '$3', borderBottom: '1px solid $accent' }}>
              <Text style="h6">Tokens</Text>
            </Box>

            <Box>
              <Text style="h6">Activity</Text>
            </Box>
            <Box>
              <Text style="h6">Traits</Text>
            </Box>
            <Box>
              <Text style="h6">Overview</Text>
            </Box>
          </Flex>

          <Flex css={{ gap: '$5' }}>
            <Box
              css={{
                width: 320,
                background: '$gray3',
                border: '1px solid $gray5',
                position: 'sticky',
                top: 16 + 80,
                borderRadius: 8,
                overflow: 'auto',
                height: 'calc(100vh - 81px - 32px)',
              }}
            >
              <Box
                css={{
                  p: '$4',
                  '& > div:first-of-type': {
                    pt: 0,
                  },
                }}
              >
                {attributes &&
                  attributes.map((attribute) => (
                    <AttributeSelector attribute={attribute} />
                  ))}
              </Box>
            </Box>

            <Box
              css={{
                flex: 1,
                pb: '$5',
              }}
            >
              <Text style="body2" as="p" css={{ mb: '$1', color: '$gray11' }}>
                Floor Tokens
              </Text>
              <Box
                css={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                  gap: '$4',
                }}
              >
                {tokens.map((token) => (
                  <TokenCard token={token} />
                ))}
              </Box>
            </Box>
          </Flex>
        </Box>
      ) : (
        <Box />
      )}
    </Layout>
  )
}

export default IndexPage
