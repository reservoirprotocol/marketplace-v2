import { CancelBidModal } from '@reservoir0x/reservoir-kit-ui'
import { FC, ReactNode, useContext } from 'react'
import { SWRResponse } from 'swr'
import { ToastContext } from '../../context/ToastContextProvider'

type Props = {
  bidId: string
  openState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  trigger: ReactNode
  mutate?: SWRResponse['mutate']
}

const CancelBid: FC<Props> = ({ bidId, openState, trigger, mutate }) => {
  const { addToast } = useContext(ToastContext)

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
