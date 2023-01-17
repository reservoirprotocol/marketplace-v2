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
  const rarityRank = token?.token?.rarityRank as number
  const tokenCount = collection?.tokenCount as string
  const rankPercentile = Math.floor((rarityRank / parseInt(tokenCount)) * 100)

  const topPercentile = (percentile: number) => {
    if (percentile <= 1) {
      return 1
    } else if (percentile <= 5) {
      return 5
    } else if (percentile <= 10) {
      return 10
    } else if (percentile <= 15) {
      return 15
    } else if (percentile <= 20) {
      return 20
    } else if (percentile <= 25) {
      return 25
    } else if (percentile <= 30) {
      return 30
    } else if (percentile <= 40) {
      return 40
    } else if (percentile <= 50) {
      return 50
    } else return
  }

  let topPercentileText =
    rankPercentile <= 50 && `Top ${topPercentile(rankPercentile)}%`

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
          <Text style="body2">{topPercentileText}</Text>
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
