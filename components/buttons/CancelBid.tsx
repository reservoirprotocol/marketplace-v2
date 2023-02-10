import { useConnectModal } from '@rainbow-me/rainbowkit'
import { CancelBidModal, CancelBidStep } from '@reservoir0x/reservoir-kit-ui'
import { FC, ReactElement, cloneElement, useContext } from 'react'
import { SWRResponse } from 'swr'
import { useNetwork, useSigner, useSwitchNetwork } from 'wagmi'
import { ToastContext } from '../../context/ToastContextProvider'
import { useMarketplaceChain } from 'hooks'

type Props = {
  bidId: string
  openState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  trigger: ReactElement
  mutate?: SWRResponse['mutate']
}

const CancelBid: FC<Props> = ({ bidId, openState, trigger, mutate }) => {
  const { addToast } = useContext(ToastContext)
  const { openConnectModal } = useConnectModal()
  const marketplaceChain = useMarketplaceChain()
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: marketplaceChain.id,
  })

  const { data: signer } = useSigner()
  const { chain: activeChain } = useNetwork()

  const isInTheWrongNetwork = Boolean(
    signer && marketplaceChain.id !== activeChain?.id
  )

  if (isInTheWrongNetwork) {
    return cloneElement(trigger, {
      onClick: async () => {
        if (switchNetworkAsync && activeChain) {
          const chain = await switchNetworkAsync(marketplaceChain.id)
          if (chain.id !== marketplaceChain.id) {
            return false
          }
        }

        if (!signer) {
          openConnectModal?.()
        }
      },
    })
  }

  return (
    <CancelBidModal
      bidId={bidId}
      trigger={trigger}
      openState={openState}
      onCancelComplete={(data: any) => {
        addToast?.({
          title: 'User canceled bid',
          description: 'You have canceled the bid.',
        })
      }}
      onCancelError={(error: any, data: any) => {
        console.log('Bid Cancel Error', error, data)
        addToast?.({
          title: 'Could not cancel bid',
          description: 'The transaction was not completed.',
        })
      }}
      onClose={(data, currentStep) => {
        if (mutate && currentStep == CancelBidStep.Complete) mutate()
      }}
    />
  )
}

export default CancelBid
