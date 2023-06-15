import React, { ComponentProps, FC, ReactNode } from 'react'
import { SWRResponse } from 'swr'
import { useNetwork, useWalletClient } from 'wagmi'
import { BuyModal, BuyStep, useTokens } from '@reservoir0x/reservoir-kit-ui'
import { useSwitchNetwork } from 'wagmi'
import { Button } from 'components/primitives'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { CSS } from '@stitches/react'
import { useMarketplaceChain } from 'hooks'

type Props = {
  tokenId?: string
  collectionId?: string
  orderId?: string
  buttonCss?: CSS
  buttonProps?: ComponentProps<typeof Button>
  buttonChildren?: ReactNode
  mutate?: SWRResponse['mutate']
}

const BuyNow: FC<Props> = ({
  tokenId,
  collectionId,
  orderId = undefined,
  mutate,
  buttonCss,
  buttonProps = {},
  buttonChildren,
}) => {
  const { data: signer } = useWalletClient()
  const { openConnectModal } = useConnectModal()
  const { chain: activeChain } = useNetwork()
  const marketplaceChain = useMarketplaceChain()
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: marketplaceChain.id,
  })
  const isInTheWrongNetwork = Boolean(
    signer && activeChain?.id !== marketplaceChain.id
  )

  const trigger = (
    <Button css={buttonCss} color="primary" {...buttonProps}>
      {buttonChildren}
    </Button>
  )
  const canBuy = signer && tokenId && collectionId && !isInTheWrongNetwork

  return !canBuy ? (
    <Button
      css={buttonCss}
      aria-haspopup="dialog"
      color="primary"
      onClick={async () => {
        if (isInTheWrongNetwork && switchNetworkAsync) {
          const chain = await switchNetworkAsync(marketplaceChain.id)
          if (chain.id !== marketplaceChain.id) {
            return false
          }
        }

        if (!signer) {
          openConnectModal?.()
        }
      }}
      {...buttonProps}
    >
      {buttonChildren}
    </Button>
  ) : (
    <BuyModal
      trigger={trigger}
      tokenId={tokenId}
      collectionId={collectionId}
      orderId={orderId}
      //CONFIGURABLE: set any fees on top of orders, note that these will only
      // apply to native orders (using the reservoir order book) and not to external orders (opensea, blur etc)
      // Refer to our docs for more info: https://docs.reservoir.tools/reference/sweepmodal-1
      // feesOnTopBps={["0xabc:50"]}
      onClose={(data, stepData, currentStep) => {
        if (mutate && currentStep == BuyStep.Complete) mutate()
      }}
    />
  )
}

export default BuyNow
