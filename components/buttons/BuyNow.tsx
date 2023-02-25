import React, {ComponentProps, FC, ReactNode} from 'react'
import { SWRResponse } from 'swr'
import { useNetwork, useSigner } from 'wagmi'
import {BuyModal, BuyStep, useListings, useTokens} from '@nftearth/reservoir-kit-ui'
import { useSwitchNetwork } from 'wagmi'
import { Button } from 'components/primitives'
import { useModal } from 'connectkit'
import { CSS } from '@stitches/react'
import { useMarketplaceChain } from 'hooks'

type Props = {
  token?: ReturnType<typeof useTokens>['data'][0],
  order?: ReturnType<typeof useListings>['data'][0]
  buttonCss?: CSS
  buttonProps?: ComponentProps<typeof Button>
  buttonChildren?: ReactNode
  mutate?: SWRResponse['mutate'],
  compact?: boolean
}

const BuyNow: FC<Props> = ({ token, order, mutate, buttonCss, buttonProps = {}, buttonChildren }) => {
  const { data: signer } = useSigner()
  const { setOpen } = useModal()
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
      {buttonChildren || `Buy Now`}
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
          setOpen(true)
        }
      }}
      {...buttonProps}
    >
      {buttonChildren || `Buy Now`}
    </Button>
  ) : (
    <BuyModal
      trigger={trigger}
      orderId={order?.id}
      tokenId={token?.token?.tokenId}
      collectionId={token?.token?.collection?.id}
      onClose={(data, stepData, currentStep) => {
        if (mutate && currentStep == BuyStep.Complete) mutate()
      }}
    />
  )
}

export default BuyNow
