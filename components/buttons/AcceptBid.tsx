import {
  AcceptBidModal,
  AcceptBidStep,
  useTokens,
} from '@nftearth/reservoir-kit-ui'
import React, { cloneElement, ComponentProps, FC, ReactNode, useContext } from 'react'
import { CSS } from '@stitches/react'
import { SWRResponse } from 'swr'
import { Button } from 'components/primitives'
import { useAccount, useNetwork, useSigner, useSwitchNetwork } from 'wagmi'
import { useModal } from 'connectkit'
import { ToastContext } from '../../context/ToastContextProvider'
import { useMarketplaceChain } from 'hooks'

type Props = {
  token?: ReturnType<typeof useTokens>['data'][0]
  bidId?: string | undefined
  collectionId?: string | undefined
  disabled?: boolean
  openState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  buttonCss?: CSS
  buttonChildren?: ReactNode
  buttonProps?: ComponentProps<typeof Button>
  mutate?: SWRResponse['mutate']
}

const AcceptBid: FC<Props> = ({
  token,
  bidId,
  collectionId,
  disabled,
  openState,
  buttonCss,
  buttonChildren,
  buttonProps,
  mutate,
}) => {
  const { isDisconnected } = useAccount()
  const { setOpen } = useModal()
  const { addToast } = useContext(ToastContext)

  const marketplaceChain = useMarketplaceChain()
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: marketplaceChain.id,
  })

  const { data: signer } = useSigner()
  const { chain: activeChain } = useNetwork()

  const isInTheWrongNetwork = Boolean(
    signer && marketplaceChain.id !== activeChain?.id
  )

  const trigger = (
    <Button css={buttonCss} color="primary" disabled={disabled} {...buttonProps}>
      {buttonChildren}
    </Button>
  )

  if (isDisconnected || isInTheWrongNetwork) {
    return cloneElement(trigger, {
      onClick: async () => {
        if (switchNetworkAsync && activeChain) {
          const chain = await switchNetworkAsync(marketplaceChain.id)
          if (chain.id !== marketplaceChain.id) {
            return false
          }
        }

        if (!signer) {
          setOpen(true)
        }
      },
    })
  } else
    return (
      <AcceptBidModal
        trigger={trigger}
        openState={openState}
        bidId={bidId}
        collectionId={collectionId}
        tokenId={token?.token?.tokenId}
        onClose={(data, stepData, currentStep) => {
          if (mutate && currentStep == AcceptBidStep.Complete) mutate()
        }}
        onBidAcceptError={(error: any) => {
          if (error?.type === 'price mismatch') {
            addToast?.({
              title: 'Could not accept offer',
              description: 'Offer was lower than expected.',
            })
            return
          }
          // Handle user rejection
          if (error?.code === 4001) {
            addToast?.({
              title: 'User canceled transaction',
              description: 'You have canceled the transaction.',
            })
            return
          }
          addToast?.({
            title: 'Could not accept offer',
            description: 'The transaction was not completed.',
          })
        }}
      />
    )
}

export default AcceptBid
