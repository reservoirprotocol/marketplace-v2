import React, {FC, useContext} from 'react'
import { constants } from 'ethers'
import { styled } from '../../stitches.config'
import { StyledComponent } from '@stitches/react/types/styled-component'
import {ChainContext} from "../../context/ChainContextProvider";

type Props = {
  address: string
} & Parameters<StyledComponent>['0']

const StyledImg = styled('img', {})

const CryptoCurrencyIcon: FC<Props> = ({
  address = constants.AddressZero,
  css,
}) => {
  const { chain } = useContext(ChainContext)

  return (
    <StyledImg
      src={`${chain?.proxyApi}/redirect/currency/${address}/icon/v1`}
      css={css}
    />
  )
}

export default CryptoCurrencyIcon
