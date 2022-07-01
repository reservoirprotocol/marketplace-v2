import { BigNumberish } from 'ethers'
import { formatBN } from 'lib/numbers'
import { FC } from 'react'
import { Flex } from './primitives/Flex'
import { Text } from './primitives/Text'

type Props = {
  amount: BigNumberish | null | undefined
  maximumFractionDigits?: number
  children?: React.ReactNode
}

const FormatCurrency: FC<Props> = ({
  amount,
  maximumFractionDigits = 4,
  children,
}) => {
  const value = formatBN(amount, maximumFractionDigits)

  return (
    <Flex align="center" css={{ gap: '$1' }}>
      {value !== '-' ? children : null}
      <Text style="subtitle2">{value}</Text>
    </Flex>
  )
}

export default FormatCurrency
