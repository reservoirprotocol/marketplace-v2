import React, { ComponentPropsWithoutRef, FC, useEffect, useState } from 'react'
import { Text } from './index'

type Props = {
  amount: string | number | null | undefined
  currency?: Intl.NumberFormatOptions['currency']
  maximumFractionDigits?: number
}

const FormatCurrency: FC<ComponentPropsWithoutRef<typeof Text> & Props> = ({
  amount,
  maximumFractionDigits = 2,
  currency = 'USD',
  ...props
}) => {
  const [formattedValue, setFormattedValue] = useState('-')

  useEffect(() => {
    if (amount) {
      const formatted = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency,
      }).format(+amount)
      setFormattedValue(formatted)
    } else {
      setFormattedValue('-')
    }
  }, [amount, maximumFractionDigits])

  return (
    <Text {...props} style={props.style || 'subtitle3'}>
      {formattedValue}
    </Text>
  )
}

export default FormatCurrency
