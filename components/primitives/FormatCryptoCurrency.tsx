import FormatCrypto from './FormatCrypto'
import React, { FC, ComponentProps } from 'react'
import { constants } from 'ethers'
import CryptoCurrencyIcon from './CryptoCurrencyIcon'

type FormatCryptoCurrencyProps = {
  logoHeight?: number
  address?: string
}

type Props = ComponentProps<typeof FormatCrypto> & FormatCryptoCurrencyProps

const FormatCryptoCurrency: FC<Props> = ({
  amount,
  address = constants.AddressZero,
  maximumFractionDigits,
  logoHeight = 8,
  textStyle,
  css,
  decimals,
}) => {
  return (
    <FormatCrypto
      css={css}
      textStyle={textStyle}
      amount={amount}
      maximumFractionDigits={maximumFractionDigits}
      decimals={decimals}
    >
      <CryptoCurrencyIcon css={{ height: logoHeight, width: logoHeight }} address={address} />
    </FormatCrypto>
  )
}

export default FormatCryptoCurrency
