import React, { ComponentProps, FC } from 'react'
import { SWRResponse } from 'swr'
import { useNetwork, useSigner } from 'wagmi'
import { BuyModal, useTokens } from '@reservoir0x/reservoir-kit-ui'
import { useSwitchNetwork } from 'wagmi'
import { Button } from 'components/primitives'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { CSS } from '@stitches/react'

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID

type Props = {
  token?: ReturnType<typeof useTokens>['data'][0]
  buttonCss?: CSS
  buttonProps?: ComponentProps<typeof Button>
  mutate?: SWRResponse['mutate']
}

const BuyNow: FC<Props> = ({ token, mutate, buttonCss, buttonProps = {} }) => {
  const { data: signer } = useSigner()
  const { openConnectModal } = useConnectModal()
  const { chain: activeChain } = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: CHAIN_ID ? +CHAIN_ID : undefined,
  })
  const isInTheWrongNetwork = Boolean(
    signer && CHAIN_ID && activeChain?.id !== +CHAIN_ID
  )

  if (
    token?.market?.floorAsk?.price?.amount === null ||
    token?.market?.floorAsk?.price?.amount === undefined
  ) {
    return null
  }

  const trigger = (
    <Button css={buttonCss} color="primary" {...buttonProps}>
      Buy Now
    </Button>
  )
  const canBuy =
    signer &&
    token?.token?.tokenId &&
    token?.token?.collection?.id &&
    !isInTheWrongNetwork

  return !canBuy ? (
    <Button
      css={buttonCss}
      color="primary"
      disabled={isInTheWrongNetwork && !switchNetworkAsync}
      onClick={async () => {
        if (isInTheWrongNetwork && switchNetworkAsync && CHAIN_ID) {
          const chain = await switchNetworkAsync(+CHAIN_ID)
          if (chain.id !== +CHAIN_ID) {
            return false
          }
        }

        if (!signer) {
          openConnectModal?.()
        }
      }}
      {...buttonProps}
    >
      Buy Now
    </Button>
  ) : (
    <BuyModal
      trigger={trigger}
      tokenId={token?.token?.tokenId}
      collectionId={token?.token?.collection?.id}
      onClose={() => {
        if (mutate) {
          mutate()
        }
      }}
    />
  )
}

export default BuyNow
