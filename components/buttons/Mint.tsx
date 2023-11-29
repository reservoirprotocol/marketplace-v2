import React, {
  ComponentProps,
  ComponentPropsWithoutRef,
  FC,
  ReactNode,
  useContext,
} from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { CollectModal, CollectStep } from '@reservoir0x/reservoir-kit-ui'
import { useMarketplaceChain } from 'hooks'
import { CSS } from '@stitches/react'
import { Button } from 'components/primitives'
import { SWRResponse } from 'swr'
import { ReferralContext } from 'context/ReferralContextProvider'

type Props = {
  collectionId?: string
  tokenId?: string
  buttonCss?: CSS
  buttonProps?: ComponentProps<typeof Button>
  buttonChildren?: ReactNode
  mutate?: SWRResponse['mutate']
  openState?: ComponentPropsWithoutRef<typeof CollectModal>['openState']
}

const Mint: FC<Props> = ({
  collectionId,
  tokenId,
  buttonCss,
  buttonProps,
  buttonChildren,
  mutate,
  openState,
}) => {
  const { login } = usePrivy()
  const marketplaceChain = useMarketplaceChain()
  const { feesOnTop } = useContext(ReferralContext)

  return (
    <CollectModal
      trigger={
        <Button css={buttonCss} color="primary" {...buttonProps}>
          {buttonChildren}
        </Button>
      }
      collectionId={collectionId}
      tokenId={tokenId}
      mode={'mint'}
      openState={openState}
      feesOnTopUsd={feesOnTop}
      chainId={marketplaceChain.id}
      onConnectWallet={() => {
        login?.()
      }}
      onClose={(data, currentStep) => {
        if (mutate && currentStep == CollectStep.Complete) mutate()
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

export default Mint
