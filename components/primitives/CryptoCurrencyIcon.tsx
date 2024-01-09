import React, { FC } from 'react'
import { styled } from '../../stitches.config'
import { StyledComponent } from '@stitches/react/types/styled-component'
import { zeroAddress } from 'viem'
import { useMarketplaceChain } from 'hooks'

type Props = {
  address: string
  chainId?: number
} & Parameters<StyledComponent>['0']

const StyledImg = styled('img', {})

const CryptoCurrencyIcon: FC<Props> = ({
  address = zeroAddress,
  chainId,
  css,
}) => {
  const { proxyApi } = useMarketplaceChain()

  return (
    <StyledImg
      src={`${process.env.NEXT_PUBLIC_PROXY_URL}${proxyApi}/redirect/currency/${address}/icon/v1`}
      css={css}
    />
  )
}

export default CryptoCurrencyIcon
