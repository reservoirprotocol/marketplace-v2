import { faFlag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TokenMedia, useTokens } from '@reservoir0x/reservoir-kit-ui'
import { Box, Flex, FormatCryptoCurrency, Text } from 'components/primitives'

type TokenCardProps = {
  token: ReturnType<typeof useTokens>['data'][0]
}

export default ({ token }: TokenCardProps) => (
  <Box
    css={{
      border: '1px solid $gray7',
      borderRadius: 8,
      overflow: 'hidden',
      background: '$gray4',
    }}
  >
    <TokenMedia
      token={token?.token}
      style={{ width: '100%', height: 300, borderRadius: 0 }}
    />
    <Box css={{ p: '$4' }}>
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
