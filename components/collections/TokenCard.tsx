import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TokenMedia, useTokens } from '@reservoir0x/reservoir-kit-ui'
import BuyNow from 'components/buttons/BuyNow'
import { Box, Flex, FormatCryptoCurrency, Text } from 'components/primitives'
import Link from 'next/link'
import { MutatorCallback } from 'swr'

const API_BASE = process.env.NEXT_PUBLIC_RESERVOIR_API_BASE

type TokenCardProps = {
  token: ReturnType<typeof useTokens>['data'][0]
  rarityEnabled: boolean
  mutate?: MutatorCallback
}

export default ({ token, rarityEnabled = true, mutate }: TokenCardProps) => {
  return (
    <Box
      css={{
        border: '1px solid $gray7',
        borderRadius: 8,
        overflow: 'hidden',
        background: '$gray4',
        position: 'relative',
        '&:hover button[aria-haspopup="dialog"]': {
          bottom: 0,
        },
      }}
    >
      <TokenMedia
        token={token?.token}
        style={{ width: '100%', height: 300, borderRadius: 0 }}
      />
      <Flex css={{ p: '$4', minHeight: 132 }} direction="column">
        <Flex css={{ mb: '$4' }} align="center" justify="between">
          <Link
            href={`/${token?.token?.collection?.id}/${token?.token?.tokenId}`}
          >
            <Flex align="center" css={{ gap: '$1' }}>
              <Text
                style="subtitle1"
                as="p"
                ellipsify
                css={{
                  pr: '$1',
                  flex: 1,
                  cursor: 'pointer',
                }}
              >
                {token?.token?.name || '#' + token?.token?.tokenId}{' '}
              </Text>
              {token?.token?.isFlagged && (
                <Text css={{ color: '$red10' }}>
                  <FontAwesomeIcon
                    icon={faCircleExclamation}
                    width={16}
                    height={16}
                  />
                </Text>
              )}
            </Flex>
          </Link>
          <Box
            css={{
              px: '$1',
              py: 2,
              background: '$gray5',
              borderRadius: 8,
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
                  <Text style="subtitle2" as="p">
                    {token?.token?.rarityRank}
                  </Text>
                </Flex>
              )}
          </Box>
        </Flex>

        <Flex align="center" css={{ gap: '$2' }}>
          <Box css={{ flex: 1 }}>
            <FormatCryptoCurrency
              logoHeight={18}
              amount={token?.market?.floorAsk?.price?.amount?.decimal}
              address={token?.market?.floorAsk?.price?.currency?.contract}
              textStyle="h6"
            />
          </Box>
          <img
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
            }}
            src={`${API_BASE}/redirect/sources/${token.market.floorAsk.source.name}/logo/v2`}
          />
        </Flex>
        {token?.token?.lastBuy?.value && (
          <Flex css={{ gap: '$2', marginTop: 'auto' }}>
            <Text css={{ color: '$gray11' }} style="subtitle2">
              Last Sale
            </Text>
            <FormatCryptoCurrency
              logoHeight={12}
              amount={token.token.lastBuy.value}
              textStyle="subtitle2"
            />
          </Flex>
        )}
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
      </Flex>
    </Box>
  )
}
