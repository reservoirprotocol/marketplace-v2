import React, { ComponentProps, FC, ReactNode } from 'react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { SweepModal, SweepStep } from '@reservoir0x/reservoir-kit-ui'
import { useMarketplaceChain } from 'hooks'
import { useNetwork, useWalletClient, useSwitchNetwork } from 'wagmi'
import { CSS } from '@stitches/react'
import { Button } from 'components/primitives'
import { SWRResponse } from 'swr'

type Props = {
  collectionId?: string
  buttonCss?: CSS
  buttonProps?: ComponentProps<typeof Button>
  buttonChildren?: ReactNode
  mutate?: SWRResponse['mutate']
}

const Sweep: FC<Props> = ({
  collectionId,
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
    <SweepModal
      trigger={trigger}
      collectionId={collectionId}
      //CONFIGURABLE: set any fees on top of orders, note that these will only
      // apply to native orders (using the reservoir order book) and not to external orders (opensea, blur etc)
      // Refer to our docs for more info: https://docs.reservoir.tools/reference/sweepmodal-1
      // feesOnTopBps={["0xabc:50"]}
      onClose={(data, currentStep) => {
        if (mutate && currentStep == SweepStep.Complete) mutate()
      }}
    />
  )
}

export default Sweep
