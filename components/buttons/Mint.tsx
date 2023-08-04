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
import { useNetwork, useWalletClient, useSwitchNetwork } from 'wagmi'
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
  const { data: signer } = useWalletClient()
  const { openConnectModal } = useConnectModal()
  const { chain: activeChain } = useNetwork()
  const marketplaceChain = useMarketplaceChain()
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: marketplaceChain.id,
  })
  const { feesOnTop } = useContext(ReferralContext)
  useRKModalPrepareDeeplink(marketplaceChain.id, openState ? true : false)
  const isInTheWrongNetwork = Boolean(
    signer && activeChain?.id !== marketplaceChain.id
  )

  const trigger = (
    <Button css={buttonCss} color="primary" {...buttonProps}>
      {buttonChildren}
    </Button>
  )
  const canSweep = signer && collectionId && !isInTheWrongNetwork

  return !canSweep ? (
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
    <CollectModal
      trigger={trigger}
      collectionId={collectionId}
      tokenId={tokenId}
      mode={'mint'}
      openState={openState}
      feesOnTopUsd={feesOnTop}
      onClose={(data, currentStep) => {
        if (mutate && currentStep == CollectStep.Complete) mutate()
      }}
    />
  )
}

export default Mint
