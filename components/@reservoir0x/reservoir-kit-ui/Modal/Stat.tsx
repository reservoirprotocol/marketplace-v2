import React, { FC, ReactElement } from 'react'
import {
  Flex,
  Text,
  FormatCryptoCurrency,
  FormatWrappedCurrency,
} from 'components/primitives'

type StatProps = {
  label: string | ReactElement
  value: string | number | null
  asNative?: boolean
  asWrapped?: boolean
  address?: string
}

const Stat: FC<StatProps> = ({
  label,
  value,
  asNative = false,
  asWrapped = false,
  address,
  ...props
}) => (
  <Flex
    align="center"
    justify="between"
    className="rk-stat-well"
    css={{
      backgroundColor: '$wellBackground',
      p: '$2',
      borderRadius: '$borderRadius',
      overflow: 'hidden',
    }}
    {...props}
  >
    <Flex
      css={{
        flex: 1,
        minWidth: '0',
        alignItems: 'center',
        gap: '$2',
        mr: '$1',
      }}
    >
      {label}
    </Flex>
    {asNative && !asWrapped && (
      <FormatCryptoCurrency amount={value} textStyle="subtitle2" />
    )}
    {asWrapped && !asNative && (
      <FormatWrappedCurrency
        amount={value}
        address={address}
        textStyle="subtitle2"
      />
    )}
    {!asNative && !asWrapped && (
      <Text
        style="subtitle2"
        as="p"
        css={{
          marginLeft: '$2',
        }}
        ellipsify
      >
        {value ? value : '-'}
      </Text>
    )}
  </Flex>
)

Stat.toString = () => '.rk-stat-well'

export default Stat
