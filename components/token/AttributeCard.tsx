import { Flex, FormatCryptoCurrency, Text } from 'components/primitives'
import { useTokens } from '@reservoir0x/reservoir-kit-ui'
import { formatNumber } from 'utils/numbers'

type Token = NonNullable<
  NonNullable<ReturnType<typeof useTokens>['data']>[0]
>['token']

type Props = {
  attribute: NonNullable<NonNullable<Token>['attributes']>[0]
  collectionTokenCount: number | string
}

export default ({ attribute, collectionTokenCount }: Props) => {
  const attributeTokenCount = attribute?.tokenCount || 0
  const totalTokens = collectionTokenCount ? Number(collectionTokenCount) : 0
  const attributeRarity = formatNumber(
    (attributeTokenCount / totalTokens) * 100,
    1
  )
  return (
    <Flex
      direction="column"
      css={{
        background: '$gray2',
        mr: 'auto',
        px: '$4',
        py: '$3',
        borderRadius: 8,
        gap: '$1',
        width: '100%',
      }}
    >
      <Text style="subtitle2" css={{ color: '$primary11' }}>
        {attribute.key}
      </Text>
      <Flex justify="between">
        <Text style="subtitle3">{attribute.value}</Text>
        <FormatCryptoCurrency
          amount={attribute.floorAskPrice}
          logoHeight={16}
          textStyle="subtitle3"
        />
      </Flex>
      <Flex justify="between">
        <Text style="body2" css={{ color: '$gray11' }}>
          {formatNumber(attribute.tokenCount)} ({attributeRarity}%) have this
        </Text>
        <Text style="body2" css={{ color: '$gray11' }}>
          floor
        </Text>
      </Flex>
    </Flex>
  )
}
