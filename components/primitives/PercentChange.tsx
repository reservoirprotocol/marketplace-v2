import { ComponentProps, FC } from 'react'
import round from 'utils/round'
import { Text } from './'

type PercentChangeProps = {
  value: number | undefined | null
  decimals?: number
}

type Props = ComponentProps<typeof Text> & PercentChangeProps

export const PercentChange: FC<Props> = ({ value, decimals = 2, ...props }) => {
  if (value === undefined || value === null || value === 0) return null

  const percentage = (value - 1) * 100

  const isPositive = percentage > 0

  return (
    <Text
      style={props.style || 'subtitle3'}
      css={{
        color: isPositive ? '$green11' : '$red11',
        ml: '$1',
      }}
      {...props}
    >
      {round(percentage, decimals)}%
    </Text>
  )
}
