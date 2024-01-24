import {
  Marketplace,
  useCollections,
  useDynamicTokens,
  useMarketplaceConfigs,
} from '@reservoir0x/reservoir-kit-ui'
import CollectionActions from 'components/collections/CollectionActions'
import TokenCard from 'components/collections/TokenCard'
import { Box, Flex, Text, Tooltip } from 'components/primitives'
import { useChainCurrency } from 'hooks'
import { useRouter } from 'next/router'
import { FC, useState, useRef, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { styled } from 'stitches.config'
import optimizeImage from 'utils/optimizeImage'
import { truncateAddress } from 'utils/truncate'
import supportedChains, { DefaultChain } from 'utils/chains'

const StyledImage = styled('img', {})

const ItemGrid = styled(Box, {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '$4',
  '@md': {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
  '@bp1500': {
    gridTemplateColumns: 'repeat(5, 1fr)',
  },
})

type Props = {
  collection?: ReturnType<typeof useCollections>['data'][0]
  collectionId?: string
  tokens: ReturnType<typeof useDynamicTokens>['data']
}

export const CollectionDetails: FC<Props> = ({
  collection,
  collectionId,
  tokens,
}) => {
  const router = useRouter()
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const [isOverflowed, setIsOverflowed] = useState(false)

  const chainCurrency = useChainCurrency()

  const descriptionRef = useRef(null as any)

  const hasSecurityConfig =
    typeof collection?.securityConfig?.transferSecurityLevel === 'number'

  const contractKind = `${collection?.contractKind?.toUpperCase()}${
    hasSecurityConfig ? 'C' : ''
  }`

  const collectionChain =
    supportedChains.find(
      (chain) => router.query?.chain === chain.routePrefix
    ) || DefaultChain

  const { data: marketplaceConfigs } = useMarketplaceConfigs(
    collectionId,
    collection?.chainId,
    undefined,
    collection?.royalties?.bps === undefined
  )

  const reservoirMarketplace = useMemo(
    () =>
      marketplaceConfigs?.marketplaces?.find(
        (marketplace) => marketplace?.orderbook === 'reservoir'
      ),
    [marketplaceConfigs]
  )

  let creatorRoyalties = collection?.royalties?.bps
    ? collection?.royalties?.bps * 0.01
    : reservoirMarketplace?.royalties?.maxBps
    ? reservoirMarketplace?.royalties?.maxBps * 0.01
    : undefined

  let chainName = collectionChain?.name

  let rareTokenQuery: Parameters<typeof useDynamicTokens>['0'] = {
    limit: 8,
    collection: collectionId,
    includeLastSale: true,
    sortBy: 'rarity',
    sortDirection: 'asc',
  }

  useEffect(() => {
    setIsOverflowed(
      descriptionRef?.current?.scrollHeight >
        descriptionRef?.current?.clientHeight
    )
  }, [isOverflowed, descriptionRef])

  const { data: rareTokens } = useDynamicTokens(rareTokenQuery)

  return (
    <Flex wrap="wrap">
      <Box css={{ width: '100%', '@lg': { width: 440 }, pb: '$5' }}>
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
          {collection?.banner ? (
            <StyledImage
              src={optimizeImage(collection?.banner, 1000)}
              css={{
                borderRadius: 8,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                width: '100%',
                height: 300,
                '@md': {
                  height: 350,
                },
                '@lg': {
                  height: 200,
                },
                objectFit: 'cover',
              }}
            />
          ) : null}
          <Box css={{ p: '$4' }}>
            <Text style="h6" as="h6" css={{ mb: '$1', fontWeight: 700 }}>
              About {collection?.name}
            </Text>
            <Text
              style="body1"
              as="p"
              ref={(ref) => {
                if (!ref) return
                descriptionRef.current = ref
              }}
              css={{
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: descriptionExpanded ? 'reset' : 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <ReactMarkdown children={collection?.description || ''} />
            </Text>
            {isOverflowed && (
              <Text
                onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                style="body1"
                as="p"
                css={{
                  cursor: 'pointer',
                  mt: '$2',
                  fontWeight: 600,
                  textDecoration: 'underline',
                }}
              >
                {descriptionExpanded ? 'Close' : 'Expand'}
              </Text>
            )}
            <Box css={{ mt: '$4' }}>
              <Flex justify="start">
                {collection && <CollectionActions collection={collection} />}
              </Flex>
            </Box>
          </Box>
        </Box>
        <Box css={{ mt: '$5' }}>
          <Text css={{ mb: '$2', fontWeight: 700 }} as="h6" style="h6">
            Collection Details
          </Text>
          {[
            {
              label: 'Contract',
              value: truncateAddress(collection?.primaryContract || ''),
            },
            { label: 'Token Standard', value: contractKind },
            { label: 'Chain', value: chainName },
            {
              label: 'Creator Earning',
              value: creatorRoyalties ? (
                creatorRoyalties + '%'
              ) : (
                <Tooltip
                  content={
                    <Text
                      style="body3"
                      css={{
                        maxWidth: 130,
                        display: 'block',
                        textAlign: 'center',
                      }}
                    >
                      This collection has mixed royalties, with the royalty
                      varying from token to token.
                    </Text>
                  }
                  side="top"
                >
                  <Flex>
                    <Text style="body1" css={{ fontWeight: 600 }}>
                      Mixed
                    </Text>
                  </Flex>
                </Tooltip>
              ),
            },
            { label: 'Total Supply', value: collection?.tokenCount },
          ].map((data) => (
            <Flex
              css={{
                gap: '$4',
                justifyContent: 'space-between',
                mb: '$2',
              }}
            >
              <Text style="body1" color="subtle">
                {data.label}
              </Text>
              <Text style="body1" css={{ fontWeight: 600 }}>
                {data.value}
              </Text>
            </Flex>
          ))}
        </Box>
      </Box>
      <Box
        css={{
          flex: 1,
          '@lg': { pl: '$5', ml: '$2', pt: '$2', pb: '$6' },
        }}
      >
        <Text style="h7" as="h5" css={{ mb: '$3' }}>
          Collection Stats
        </Text>
        <ItemGrid>
          {[
            {
              name: 'Floor',
              value: collection?.floorAsk?.price?.amount?.decimal
                ? `${collection?.floorAsk?.price?.amount?.decimal} ${collection?.floorAsk?.price?.currency?.symbol}`
                : '-',
            },
            {
              name: 'Top Bid',
              value: collection?.topBid?.price?.amount?.decimal
                ? `${collection?.topBid?.price?.amount?.decimal || 0} ${
                    collection?.topBid?.price?.currency?.symbol
                  }`
                : '-',
            },
            {
              name: '24h Volume',
              value: `${Number(
                collection?.volume?.['1day']?.toFixed(2)
              ).toLocaleString()} ${chainCurrency.symbol}`,
            },

            {
              name: '24h Sales',
              value: Number(
                `${collection?.salesCount?.['1day'] || 0}`
              ).toLocaleString(),
            },
          ].map((stat) => (
            <Box
              css={{
                p: '$4',
                borderRadius: 8,
                overflow: 'hidden',
                background: '$neutralBgSubtle',
                $$shadowColor: '$colors$panelShadow',
                boxShadow: '0 0px 12px 0px $$shadowColor',
                position: 'relative',
              }}
            >
              <Text style="subtitle1" as="p">
                {stat.name}
              </Text>
              <Text style="h5" css={{ fontWeight: 800 }}>
                {stat.value}
              </Text>
            </Box>
          ))}
        </ItemGrid>

        <Text style="h7" as="h5" css={{ mb: '$3', mt: '$5' }}>
          Rare Tokens
        </Text>
        {rareTokens.length > 0 ? (
          <ItemGrid>
            {rareTokens.slice(0, 4).map((token) => (
              <TokenCard
                showAsk={false}
                token={token}
                showSource={false}
                rarityEnabled={false}
              />
            ))}
          </ItemGrid>
        ) : (
          <Text>No rare tokens</Text>
        )}

        <Text style="h7" as="h5" css={{ mb: '$3', mt: '$5' }}>
          Floor Tokens
        </Text>

        {rareTokens.length > 0 ? (
          <ItemGrid>
            {tokens.slice(0, 4).map((token) => (
              <TokenCard
                showAsk={false}
                token={token}
                showSource={false}
                rarityEnabled={false}
              />
            ))}
          </ItemGrid>
        ) : (
          <Text>No Tokens</Text>
        )}
      </Box>
    </Flex>
  )
}
