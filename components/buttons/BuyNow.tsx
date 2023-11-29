import React, {
  ComponentProps,
  ComponentPropsWithoutRef,
  FC,
  ReactNode,
  useContext,
} from 'react'
import { SWRResponse } from 'swr'
import { BuyModal, BuyStep } from '@reservoir0x/reservoir-kit-ui'
import { Button } from 'components/primitives'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { CSS } from '@stitches/react'
import { useMarketplaceChain } from 'hooks'
import { ReferralContext } from '../../context/ReferralContextProvider'

type Props = {
  tokenId?: string
  collectionId?: string
  orderId?: string
  buttonCss?: CSS
  buttonProps?: ComponentProps<typeof Button>
  buttonChildren?: ReactNode
  mutate?: SWRResponse['mutate']
  openState?: ComponentPropsWithoutRef<typeof BuyModal>['openState']
}

const BuyNow: FC<Props> = ({
  tokenId,
  collectionId,
  orderId = undefined,
  mutate,
  buttonCss,
  buttonProps = {},
  buttonChildren,
  openState,
}) => {
  const { openConnectModal } = useConnectModal()
  const marketplaceChain = useMarketplaceChain()
  const { feesOnTop } = useContext(ReferralContext)

  return (
    <BuyModal
      trigger={
        <Button css={buttonCss} color="primary" {...buttonProps}>
          {buttonChildren}
        </Button>
      }
      tokenId={tokenId}
      collectionId={collectionId}
      orderId={orderId}
      openState={openState}
      onConnectWallet={() => {
        openConnectModal?.()
      }}
      //CONFIGURABLE: set any fees on top of orders, note that these will only
      // apply to native orders (using the reservoir order book) and not to external orders (opensea, blur etc)
      // Refer to our docs for more info: https://docs.reservoir.tools/reference/sweepmodal-1
      // feesOnTopBps={["0xabc:50"]}
      feesOnTopUsd={feesOnTop}
      chainId={marketplaceChain.id}
      onClose={(data, stepData, currentStep) => {
        if (mutate && currentStep == BuyStep.Complete) mutate()
      }}
      onPointerDownOutside={(e) => {
        const privyLayer = document.getElementById('privy-dialog')

        const clickedInsidePrivyLayer =
          privyLayer && e.target ? privyLayer.contains(e.target as Node) : false

        if (clickedInsidePrivyLayer) {
          e.preventDefault()
        }
      }}
    />
  )
}

export default BuyNow
