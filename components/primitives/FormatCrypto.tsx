import { BigNumberish } from 'ethers'
import { formatBN } from '../../utils/numbers'
import React, { FC } from 'react'
import { Flex, Text } from './index'

type Props = {
  amount: BigNumberish | null | undefined
  maximumFractionDigits?: number
  decimals?: number
  css?: Parameters<typeof Text>['0']['css']
  textStyle?: Parameters<typeof Text>['0']['style']
  children?: React.ReactNode
}

const FormatCrypto: FC<Props> = ({
  amount,
  maximumFractionDigits = 4,
  decimals = 18,
  css,
  textStyle = 'subtitle3',
  children,
}) => {
  const value = formatBN(amount, maximumFractionDigits, decimals)
  return (
    <Flex align="center" css={{ gap: '$1', minWidth: 'max-content' }}>
      {value !== '-' ? children : null}
      <Text style={textStyle} css={css} as="p">
        {value}
      </Text>
    </Flex>
  )
}

export default FormatCrypto
