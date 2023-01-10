import { useConnectModal } from '@rainbow-me/rainbowkit'
import { CancelBidModal } from '@reservoir0x/reservoir-kit-ui'
import { Box } from 'components/primitives'
import { FC, ReactNode, useContext } from 'react'
import { SWRResponse } from 'swr'
import { useNetwork, useSigner, useSwitchNetwork } from 'wagmi'
import { ToastContext } from '../../context/ToastContextProvider'

type Props = {
  bidId: string
  openState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  trigger: ReactNode
  mutate?: SWRResponse['mutate']
}

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID

const CancelBid: FC<Props> = ({ bidId, openState, trigger, mutate }) => {
  const { addToast } = useContext(ToastContext)
  const { openConnectModal } = useConnectModal()
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: CHAIN_ID ? +CHAIN_ID : undefined,
  })

  const { data: signer } = useSigner()
  const { chain: activeChain } = useNetwork()

  const isInTheWrongNetwork = Boolean(
    signer && CHAIN_ID && activeChain?.id !== +CHAIN_ID
  )

  if (isInTheWrongNetwork) {
    return (
      <Box
        onClick={async () => {
          if (switchNetworkAsync && CHAIN_ID) {
            const chain = await switchNetworkAsync(+CHAIN_ID)
            if (chain.id !== +CHAIN_ID) {
              return false
            }
          }

          if (!signer) {
            openConnectModal?.()
          }
        }}
      >
        {trigger}
      </Box>
    )
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
      onClose={() => {
        if (mutate) {
          mutate()
        }
      }}
    />
  )
}

export default CancelBid
