import React, { ComponentProps, FC, ReactNode } from 'react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { CollectModal, CollectStep } from '@reservoir0x/reservoir-kit-ui'
import { useMarketplaceChain } from 'hooks'
import { useNetwork, useWalletClient, useSwitchNetwork } from 'wagmi'
import { CSS } from '@stitches/react'
import { Button } from 'components/primitives'
import { SWRResponse } from 'swr'

type Props = {
  collectionId?: string
  tokenId?: string
  buttonCss?: CSS
  buttonProps?: ComponentProps<typeof Button>
  buttonChildren?: ReactNode
  mutate?: SWRResponse['mutate']
}

const Mint: FC<Props> = ({
  collectionId,
  tokenId,
  buttonCss,
  buttonProps,
  buttonChildren,
  mutate,
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
      onClose={(data, currentStep) => {
        if (mutate && currentStep == CollectStep.Complete) mutate()
      }}
    />
  )
}

export default Mint
