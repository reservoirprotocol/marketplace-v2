import FormatCrypto from './FormatCrypto'
import React, { FC, ComponentProps } from 'react'
import { constants } from 'ethers'
import CryptoCurrencyIcon from './CryptoCurrencyIcon'

type FormatCryptoCurrencyProps = {
  logoWidth?: number
  address?: string
}

type Props = ComponentProps<typeof FormatCrypto> & FormatCryptoCurrencyProps

const FormatCryptoCurrency: FC<Props> = ({
  amount,
  address = constants.AddressZero,
  maximumFractionDigits,
  logoWidth = 8,
  textStyle,
  css,
  textColor,
  decimals,
}) => {
  return (
    <FormatCrypto
      css={css}
      textColor={textColor}
      textStyle={textStyle}
      amount={amount}
      maximumFractionDigits={maximumFractionDigits}
      decimals={decimals}
    >
      <CryptoCurrencyIcon css={{ height: logoWidth }} address={address} />
    </FormatCrypto>
  )
}

export default FormatCryptoCurrency
