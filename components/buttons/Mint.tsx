import React, {
  ComponentProps,
  ComponentPropsWithoutRef,
  FC,
  ReactNode,
  useContext,
} from 'react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { CollectModal, CollectStep } from '@reservoir0x/reservoir-kit-ui'
import { useMarketplaceChain, useRKModalPrepareDeeplink } from 'hooks'
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
  const { openConnectModal } = useConnectModal()
  const marketplaceChain = useMarketplaceChain()
  const { feesOnTop } = useContext(ReferralContext)
  useRKModalPrepareDeeplink(openState ? true : false)

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
        openConnectModal?.()
      }}
      onClose={(data, currentStep) => {
        if (mutate && currentStep == CollectStep.Complete) mutate()
      }}
    />
  )
}

export default Mint
