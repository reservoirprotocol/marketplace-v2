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
  const rarityRank = token?.token?.rarityRank
  const tokenCount = collection?.tokenCount
  const rankPercentile = Math.floor(
    ((rarityRank as number) / parseInt(tokenCount as string)) * 100
  )

  let displayPercentile = rankPercentile

  if (displayPercentile <= 1) {
    displayPercentile = 1
  } else if (displayPercentile <= 5) {
    displayPercentile = 5
  } else if (displayPercentile <= 10) {
    displayPercentile = 10
  } else if (displayPercentile <= 15) {
    displayPercentile = 15
  } else if (displayPercentile <= 20) {
    displayPercentile = 20
  } else if (displayPercentile <= 30) {
    displayPercentile = 30
  } else if (displayPercentile <= 40) {
    displayPercentile = 40
  } else if (displayPercentile <= 50) {
    displayPercentile = 50
  }

  const rarityEnabledCollection =
    tokenCount &&
    +tokenCount >= 2 &&
    collectionAttributes &&
    collectionAttributes?.length >= 2

  if (
    rarityRank === undefined ||
    rarityRank === null ||
    token?.token?.kind === 'erc1155' ||
    !rarityEnabledCollection
  ) {
    return null
  }

  return (
    <Tooltip
      content={
        <Flex direction="column" align="start">
          {displayPercentile <= 50 && (
            <Text style="body2">Top {displayPercentile}%</Text>
          )}
          <Text style="body2" ellipsify>
            Rarity rank:{' '}
            {`${formatNumber(rarityRank)}/
            ${formatNumber(tokenCount)}`}
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
        <Text style="subtitle2">{formatNumber(rarityRank)} </Text>
      </Flex>
    </Tooltip>
  )
}
