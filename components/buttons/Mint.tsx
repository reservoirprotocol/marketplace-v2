import React, {
  ComponentProps,
  ComponentPropsWithoutRef,
  FC,
  ReactNode,
  useContext,
} from 'react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { MintStep, MintModal } from '@reservoir0x/reservoir-kit-ui'
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
  openState?: ComponentPropsWithoutRef<typeof MintModal>['openState']
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
  const contract = collectionId?.split(':')?.[0]
  const token = tokenId ? `${contract}:${tokenId}` : undefined

  return (
    <MintModal
      trigger={
        <Button css={buttonCss} color="primary" {...buttonProps}>
          {buttonChildren}
        </Button>
      }
      collectionId={collectionId}
      token={token}
      openState={openState}
      feesOnTopUsd={feesOnTop}
      chainId={marketplaceChain.id}
      onConnectWallet={() => {
        openConnectModal?.()
      }}
      onClose={(data, currentStep) => {
        if (mutate && currentStep == MintStep.Complete) mutate()
      }}
    />
  )
}

export default Mint
