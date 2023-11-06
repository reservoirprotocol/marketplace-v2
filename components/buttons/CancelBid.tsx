import { usePrivy } from '@privy-io/react-auth'
import { CancelBidModal, CancelBidStep } from '@reservoir0x/reservoir-kit-ui'
import { FC, ReactElement, cloneElement, useContext } from 'react'
import { SWRResponse } from 'swr'
import { useWalletClient } from 'wagmi'
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
  const { login } = usePrivy()
  const marketplaceChain = useMarketplaceChain()

  const { data: signer } = useWalletClient()

  if (!signer) {
    return cloneElement(trigger, {
      onClick: async () => {
        if (!signer) {
          login?.()
        }
      },
    })
  }

  return (
    <CancelBidModal
      bidId={bidId}
      trigger={trigger}
      openState={openState}
      chainId={marketplaceChain.id}
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
