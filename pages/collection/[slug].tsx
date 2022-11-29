import { NextPage } from 'next'
import Box from '../../components/primitives/Box'
import Flex from '../../components/primitives/Flex'
import Switch from 'components/primitives/Switch'
import Text from '../../components/primitives/Text'
import {
  useCollections,
  useTokens,
  useAttributes,
} from '@reservoir0x/reservoir-kit-ui'
import { formatNumber } from 'lib/numbers'

import truncateEthAddress from 'truncate-eth-address'

import Layout from 'components/Layout'
import { useRouter } from 'next/router'
import FormatEth from 'components/FormatEth'
import FormatWEth from 'components/FormatWEth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCertificate,
  faCheck,
  faGlobe,
  faRefresh,
  faArrowUpRightFromSquare,
  faFlag,
  faChevronUp,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons'

import { faTwitter, faDiscord } from '@fortawesome/free-brands-svg-icons'
import { useState } from 'react'

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

const StatBox = ({ label, children }) => (
  <Box
    css={{
      px: '$3',
      py: '$2',
      minWidth: 110,
    }}
  >
    <Text style="body2" css={{ color: '$gray11', mb: 2 }} as="p">
      {label}
    </Text>
    {children}
  </Box>
)

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
          <FormatEth
            logoWidth={11}
            css={{ fontSize: 16, fontWeight: 600, color: 'white' }}
            amount={token.market?.floorAsk?.price?.amount.native}
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

  //const { data: traits } = useTraits(collection?.id)
  let { data: attributes } = useAttributes(collection?.id)

  return (
    <Layout>
      {collection ? (
        <Box css={{ p: '$5', pb: 0 }}>
          <Flex align="center">
            <Flex css={{ gap: '$4', flex: 1 }} align="center">
              <img
                src={collection.image}
                style={{ width: 60, height: 60, borderRadius: 8 }}
              />
              <Box>
                <Flex align="center">
                  <Text style="h5" as="h6">
                    {collection.name}
                  </Text>
                  {collection.openseaVerificationStatus === 'verified' && (
                    <Box
                      css={{ color: '$accent', ml: '$2', position: 'relative' }}
                    >
                      <FontAwesomeIcon icon={faCertificate} />
                      <Box
                        css={{
                          color: 'white',
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          fontSize: 14,
                        }}
                      >
                        <FontAwesomeIcon icon={faCheck} size="xs" />
                      </Box>
                    </Box>
                  )}
                </Flex>
                <Text style="body2" css={{ color: '$gray11' }} as="p">
                  {truncateEthAddress(collection.id)}
                </Text>
              </Box>
            </Flex>

            <Flex css={{ flex: 1 }} align="center" justify="center">
              <Flex
                css={{
                  background: '$gray4',
                  borderRadius: 8,
                  '& > div': {
                    borderRight: '1px solid $gray1',
                  },
                }}
              >
                <StatBox label="Floor">
                  <FormatEth
                    amount={collection?.floorAsk?.price?.amount?.native}
                    logoWidth={10}
                    css={{ fontSize: 16 }}
                  />
                </StatBox>

                <StatBox label="Top Bid">
                  <FormatWEth
                    amount={collection?.topBid?.price?.amount?.native}
                    logoWidth={10}
                    css={{ fontSize: 16 }}
                  />
                </StatBox>

                <StatBox label="Count">
                  <Text style="subtitle1">
                    {formatNumber(collection?.tokenCount)}
                  </Text>
                </StatBox>

                <StatBox label="On Sale">
                  <Text style="subtitle1">
                    {formatNumber(collection?.onSaleCount)}
                  </Text>
                </StatBox>

                <StatBox label="Royalties">
                  <Text style="subtitle1">
                    {(Number(collection?.royalties?.bps) || 0) / 100 + '%'}
                  </Text>
                </StatBox>

                <StatBox label="7D Change">
                  <Text style="subtitle1">
                    {formatNumber(collection.volumeChange['7day'], 1) + '%'}
                  </Text>
                </StatBox>
              </Flex>
            </Flex>
            <Flex
              css={{
                flex: 1,
                gap: '$4',
                color: '$gray11',
                '& > div': {
                  cursor: 'pointer',
                  transition: 'color 200ms ease-in-out',
                },

                '& > div:hover': {
                  color: '$gray12',
                },
              }}
              justify="end"
            >
              <Box>
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </Box>

              <Box>
                <FontAwesomeIcon icon={faDiscord} size="lg" />
              </Box>

              <Box>
                <FontAwesomeIcon icon={faGlobe} size="lg" />
              </Box>
              <Text css={{ color: '$gray9' }}>|</Text>
              <Box>
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="lg" />
              </Box>

              <Box>
                <FontAwesomeIcon icon={faRefresh} size="lg" />
              </Box>
            </Flex>
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
