import React, { FC } from 'react'
import { useChainCurrency } from '../../hooks'
import { constants } from 'ethers'
import { styled } from '../../stitches.config'
import { StyledComponent } from '@stitches/react/types/styled-component'
import { useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import { useTheme } from 'next-themes'

type Props = {
  address: string
  chainId?: number
} & Parameters<StyledComponent>['0']

const StyledImg = styled('img', {})

const CryptoCurrencyIcon: FC<Props> = ({
  address = constants.AddressZero,
  chainId,
  css,
}) => {
  const { theme } = useTheme()
  return (
    <StyledImg
      src={theme === 'dark' ? `/icons/eth-icon-light.svg`: `/icons/eth-icon-dark.svg`}
      css={css}
    />
  )
}

export default CryptoCurrencyIcon
