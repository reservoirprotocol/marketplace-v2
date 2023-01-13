import { Flex, Text, Tooltip } from 'components/primitives'
import {
  useAttributes,
  useCollections,
  useTokens,
} from '@reservoir0x/reservoir-kit-ui'
import { formatNumber } from 'utils/numbers'

type Props = {
  token: ReturnType<typeof useTokens>['data'][0] | null
  collection?: NonNullable<ReturnType<typeof useCollections>['data']>[0] | null
  collectionAttributes?: ReturnType<typeof useAttributes>['data']
}

export default ({ token, collection, collectionAttributes }: Props) => {
  const rarityEnabledCollection =
    collection?.tokenCount &&
    +collection.tokenCount >= 2 &&
    collectionAttributes &&
    collectionAttributes?.length >= 2

  if (
    token?.token?.rarityRank === undefined ||
    token?.token?.rarityRank === null ||
    token?.token?.kind === 'erc1155' ||
    !rarityEnabledCollection
  ) {
    return null
  }

  return (
    <Tooltip
      content={
        <Flex direction="column" align="start">
          <Text style="body2" ellipsify>
            {`${formatNumber(token?.token?.rarityRank)}/
            ${formatNumber(collection.tokenCount)}`}
          </Text>
          <Text style="body2" color="subtle">
            By Poprank
          </Text>
        </Flex>
      }
    >
      <Flex
        align="center"
        css={{
          background: '$gray2',
          mt: 24,
          mr: 'auto',
          px: '$2',
          py: '$1',
          borderRadius: 4,
          gap: '$1',
          cursor: 'pointer',
        }}
      >
        <img style={{ width: 13, height: 13 }} src="/icons/rarity-icon.svg" />
        <Text style="subtitle2" css={{ color: '$gray11' }}>
          Rank
        </Text>
        <Text style="subtitle2">{formatNumber(token?.token?.rarityRank)} </Text>
      </Flex>
    </Tooltip>
  )
}
