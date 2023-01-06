import { CancelBidModal } from '@reservoir0x/reservoir-kit-ui'
import { ComponentProps, FC, ReactNode, useContext } from 'react'
import { CSS } from '@stitches/react'
import { SWRResponse } from 'swr'
import { Button } from 'components/primitives'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { ToastContext } from '../../context/ToastContextProvider'

type Props = {
  bidId: string
  disabled?: boolean
  openState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  buttonCss?: CSS
  buttonChildren?: ReactNode
  buttonProps?: ComponentProps<typeof Button>
  mutate?: SWRResponse['mutate']
}

const CancelBid: FC<Props> = ({
  bidId,
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
      <CancelBidModal
        bidId={bidId}
        trigger={trigger}
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
