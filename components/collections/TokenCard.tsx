import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  extractMediaType,
  TokenMedia,
  useTokens,
} from '@reservoir0x/reservoir-kit-ui'
import BuyNow from 'components/buttons/BuyNow'
import {
  Box,
  Flex,
  FormatCryptoCurrency,
  Text,
  Tooltip,
} from 'components/primitives'
import { ToastContext } from 'context/ToastContextProvider'
import { useMarketplaceChain } from 'hooks'
import Link from 'next/link'
import { SyntheticEvent, useContext } from 'react'
import { MutatorCallback } from 'swr'
import { formatNumber } from 'utils/numbers'

type TokenCardProps = {
  token: ReturnType<typeof useTokens>['data'][0]
  rarityEnabled: boolean
  mutate?: MutatorCallback
  onMediaPlayed?: (
    e: SyntheticEvent<HTMLAudioElement | HTMLVideoElement, Event>
  ) => void
}

export default ({
  token,
  rarityEnabled = true,
  mutate,
  onMediaPlayed,
}: TokenCardProps) => {
  const { addToast } = useContext(ToastContext)
  const mediaType = extractMediaType(token?.token)
  const showPreview =
    mediaType === 'other' || mediaType === 'html' || mediaType === null
  const { routePrefix, proxyApi } = useMarketplaceChain()

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
          '&:hover button[aria-haspopup="dialog"]': {
            bottom: 0,
          },
        },
      }}
    >
      <Link
        passHref
        href={`/collection/${routePrefix}/${token?.token?.collection?.id}/${token?.token?.tokenId}`}
        onClick={(e) => {
          if (!showPreview || (e.target as HTMLElement)?.tagName === 'BUTTON') {
            e.preventDefault()
          }
        }}
      >
        <Box css={{ background: '$gray3', overflow: 'hidden' }}>
          <TokenMedia
            token={token?.token}
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
        href={`/collection/${routePrefix}/${token?.token?.collection?.id}/${token?.token?.tokenId}`}
      >
        <Flex
          css={{ p: '$4', minHeight: 132, cursor: 'pointer' }}
          direction="column"
        >
          <Flex css={{ mb: '$4' }} align="center" justify="between">
            <Flex align="center" css={{ gap: '$1', minWidth: 0 }}>
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
              {token?.token?.isFlagged && (
                <Tooltip
                  content={
                    <Text style="body2" as="p">
                      Not tradeable on OpenSea
                    </Text>
                  }
                >
                  <Text css={{ color: '$red10' }}>
                    <FontAwesomeIcon
                      icon={faCircleExclamation}
                      width={16}
                      height={16}
                    />
                  </Text>
                </Tooltip>
              )}
            </Flex>
            <Box
              css={{
                px: '$1',
                py: 2,
                background: '$gray5',
                borderRadius: 8,
                minWidth: 'max-content',
              }}
            >
              {rarityEnabled &&
                token?.token?.kind !== 'erc1155' &&
                token?.token?.rarityRank && (
                  <Flex align="center" css={{ gap: 5 }}>
                    <img
                      style={{ width: 13, height: 13 }}
                      src="/icons/rarity-icon.svg"
                    />
                    <Text style="subtitle3" as="p">
                      {formatNumber(token?.token?.rarityRank)}
                    </Text>
                  </Flex>
                )}
            </Box>
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
              <FormatCryptoCurrency
                logoHeight={18}
                amount={token?.market?.floorAsk?.price?.amount?.decimal}
                address={token?.market?.floorAsk?.price?.currency?.contract}
                textStyle="h6"
                css={{
                  textOverflow: 'ellipsis',
                  minWidth: 0,
                  with: '100%',
                  overflow: 'hidden',
                }}
                maximumFractionDigits={4}
              />
            </Box>

            <>
              {token?.market?.floorAsk?.source?.name && (
                <img
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                  }}
                  src={`${proxyApi}/redirect/sources/${token?.market?.floorAsk?.source?.name}/logo/v2`}
                />
              )}
            </>
          </Flex>
          {token?.token?.lastBuy?.value && (
            <Flex css={{ gap: '$2', marginTop: 'auto' }}>
              <Text css={{ color: '$gray11' }} style="subtitle3">
                Last Sale
              </Text>
              <FormatCryptoCurrency
                logoHeight={12}
                amount={token.token.lastBuy.value}
                textStyle="subtitle3"
                maximumFractionDigits={4}
              />
            </Flex>
          )}
        </Flex>
      </Link>
      <BuyNow
        token={token}
        mutate={mutate}
        buttonCss={{
          position: 'absolute',
          bottom: -44,
          left: 0,
          right: 0,
          justifyContent: 'center',
          transition: 'bottom 0.25s ease-in-out',
        }}
        buttonProps={{
          corners: 'square',
        }}
      />
    </Box>
  )
}
