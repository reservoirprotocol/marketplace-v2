import React, { FC } from 'react'
import { useChainCurrency } from '../../hooks'
import { constants } from 'ethers'
import { styled } from '../../stitches.config'
import { StyledComponent } from '@stitches/react/types/styled-component'
import Box from './Box'
import wrappedContracts from '../../utils/wrappedContracts'
import { useReservoirClient } from '@reservoir0x/reservoir-kit-ui'

type Props = {
  address: string
} & Parameters<StyledComponent>['0']

const StyledImg = styled('img', {})

const CryptoCurrencyIcon: FC<Props> = ({
  address = constants.AddressZero,
  css,
}) => {
  const client = useReservoirClient()

  return (
    <StyledImg
      src={`${client?.apiBase}/redirect/currency/${address}/icon/v1`}
      css={css}
    />
  )
}

export default CryptoCurrencyIcon
