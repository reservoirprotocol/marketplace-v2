import { Flex, FormatCryptoCurrency, Text } from 'components/primitives'
import { useTokens } from '@reservoir0x/reservoir-kit-ui'
import { formatNumber } from 'utils/numbers'
import Link from 'next/link'

type Token = NonNullable<
  NonNullable<ReturnType<typeof useTokens>['data']>[0]
>['token']

type Props = {
  attribute: NonNullable<NonNullable<Token>['attributes']>[0]
  collectionTokenCount: number | string
  collectionId?: string
}

export default ({ attribute, collectionTokenCount, collectionId }: Props) => {
  const attributeTokenCount = attribute?.tokenCount || 0
  const totalTokens = collectionTokenCount ? Number(collectionTokenCount) : 0
  const attributeRarity = formatNumber(
    (attributeTokenCount / totalTokens) * 100,
    1
  )
  const attributeHref = `/collections/${collectionId}?attributes[${attribute.key}]=${attribute.value}`
  return (
    <Link href={attributeHref}>
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
        <Text style="subtitle3" subtleColor>
          {attribute.key}
        </Text>
        <Flex justify="between">
          <Text style="subtitle2">{attribute.value}</Text>
          <FormatCryptoCurrency
            amount={attribute.floorAskPrice}
            logoHeight={16}
            textStyle="subtitle2"
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
    </Link>
  )
}
