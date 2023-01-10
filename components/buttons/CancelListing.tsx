import { CancelListingModal } from '@reservoir0x/reservoir-kit-ui'
import { FC, ReactNode, useContext } from 'react'
import { SWRResponse } from 'swr'
import { ToastContext } from '../../context/ToastContextProvider'

type Props = {
  listingId: string
  openState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  trigger: ReactNode
  mutate?: SWRResponse['mutate']
}

const CancelListing: FC<Props> = ({
  listingId,
  openState,
  trigger,
  mutate,
}) => {
  const { addToast } = useContext(ToastContext)

  return (
    <CancelListingModal
      listingId={listingId}
      openState={openState}
      trigger={trigger}
      onCancelComplete={(data: any) => {
        addToast?.({
          title: 'User canceled listing',
          description: 'You have canceled the listing.',
        })
      }}
      onCancelError={(error: any, data: any) => {
        console.log('Listing Cancel Error', error, data)
        addToast?.({
          title: 'Could not cancel listing',
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

export default CancelListing
