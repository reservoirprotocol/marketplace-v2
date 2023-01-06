import { CancelListingModal } from '@reservoir0x/reservoir-kit-ui'
import { ComponentProps, FC, ReactNode, useContext } from 'react'
import { CSS } from '@stitches/react'
import { SWRResponse } from 'swr'
import { Button } from 'components/primitives'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { ToastContext } from '../../context/ToastContextProvider'

type Props = {
  listingId: string
  disabled?: boolean
  openState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  buttonCss?: CSS
  buttonChildren?: ReactNode
  buttonProps?: ComponentProps<typeof Button>
  mutate?: SWRResponse['mutate']
}

const CancelListing: FC<Props> = ({
  listingId,
  disabled,
  buttonCss,
  buttonChildren,
  buttonProps,
  mutate,
}) => {
  const { isDisconnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { addToast } = useContext(ToastContext)

  const trigger = (
    <Button css={buttonCss} color="gray3" disabled={disabled} {...buttonProps}>
      {buttonChildren}
    </Button>
  )

  if (isDisconnected) {
    return (
      <Button
        css={buttonCss}
        onClick={() => {
          openConnectModal?.()
        }}
        color="gray3"
        {...buttonProps}
      >
        Cancel
      </Button>
    )
  } else
    return (
      <CancelListingModal
        listingId={listingId}
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
