import React, { ComponentProps, FC, useEffect, useState } from 'react'
import { SWRResponse } from 'swr'
import { useAccount, useNetwork, useSigner } from 'wagmi'
import { BuyModal, BuyStep, useTokens } from '@reservoir0x/reservoir-kit-ui'
import { useSwitchNetwork } from 'wagmi'
import { Button } from 'components/primitives'
import { useModal } from 'connectkit'
import { CSS } from '@stitches/react'
import { useMarketplaceChain } from 'hooks'

type Props = {
  token?: ReturnType<typeof useTokens>['data'][0]
  buttonCss?: CSS
  buttonProps?: ComponentProps<typeof Button>
  mutate?: SWRResponse['mutate']
}

const BuyNow: FC<Props> = ({ token, mutate, buttonCss, buttonProps = {} }) => {
  const { data: signer } = useSigner()
  const { isConnected } = useAccount()
  const { open: connectModalOpen, setOpen: setConnectModalOpen } = useModal()
  const [hasBeenClicked, setHasBeenClicked] = useState(false)
  const [open, setOpen] = useState(false)
  const { chain: activeChain } = useNetwork()
  const marketplaceChain = useMarketplaceChain()
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: marketplaceChain.id,
  })
  const isInTheWrongNetwork = Boolean(
    signer && activeChain?.id !== marketplaceChain.id
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

  useEffect(() => {
    if (!connectModalOpen && isConnected && hasBeenClicked) {
      setOpen(true)
    }
    if (!connectModalOpen) {
      setHasBeenClicked(false)
    }
  }, [connectModalOpen])

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
          setHasBeenClicked(true)
          setConnectModalOpen(true)
        }
      }}
      {...buttonProps}
    >
      Buy Now
    </Button>
  ) : (
    <BuyModal
      openState={[open, setOpen]}
      trigger={trigger}
      tokenId={token?.token?.tokenId}
      collectionId={token?.token?.collection?.id}
      onClose={(data, stepData, currentStep) => {
        if (mutate && currentStep == BuyStep.Complete) mutate()
      }}
    />
  )
}

export default BuyNow
