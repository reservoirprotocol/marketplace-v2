import { usePrivy } from '@privy-io/react-auth'
import { CancelBidModal, CancelBidStep } from '@reservoir0x/reservoir-kit-ui'
import { FC, ReactElement, cloneElement, useContext, useMemo } from 'react'
import { SWRResponse } from 'swr'
import { useWalletClient } from 'wagmi'
import { ToastContext } from '../../context/ToastContextProvider'
import { useMarketplaceChain } from 'hooks'
import { adaptPrivyWallet } from 'utils/privyAdapter'

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

  const { data: wallet } = useWalletClient()

  const privyWallet = useMemo(() => {
    return wallet ? adaptPrivyWallet(wallet) : undefined
  }, [wallet, adaptPrivyWallet])

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
      walletClient={privyWallet}
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
      onPointerDownOutside={(e) => {
        const privyLayer = document.getElementById('privy-dialog')

        const clickedInsidePrivyLayer =
          privyLayer && e.target ? privyLayer.contains(e.target as Node) : false

        if (clickedInsidePrivyLayer) {
          e.preventDefault()
        }
      }}
    />
  )
}

export default CancelBid
