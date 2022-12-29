import { BidModal } from '@reservoir0x/reservoir-kit-ui'
import { Button } from 'components/primitives'
import { ComponentProps, FC, useContext } from 'react'
import { CSS } from '@stitches/react'
import { SWRResponse } from 'swr'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { ToastContext } from 'context/ToastContextProvider'

type Props = {
  tokenId?: string | undefined
  collectionId?: string | undefined
  disabled?: boolean
  openState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  buttonCss?: CSS
  buttonProps?: ComponentProps<typeof Button>
  mutate?: SWRResponse['mutate']
}

const Bid: FC<Props> = ({
  tokenId,
  collectionId,
  disabled,
  openState,
  buttonCss,
  buttonProps,
  mutate,
}) => {
  const { isDisconnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { addToast } = useContext(ToastContext)

  const trigger = (
    <Button css={buttonCss} disabled={disabled} {...buttonProps} color="gray3">
      Make Offer
    </Button>
  )

  if (isDisconnected) {
    return (
      <Button
        css={buttonCss}
        onClick={() => {
          openConnectModal?.()
        }}
        {...buttonProps}
        color="gray3"
      >
        Make Offer
      </Button>
    )
  } else
    return (
      <BidModal
        tokenId={tokenId}
        collectionId={collectionId}
        trigger={trigger}
        openState={openState}
        onBidComplete={() => {
          if (mutate) {
            mutate()
          }
        }}
        onBidError={(error) => {
          if (error) {
            if (
              (error as any).cause.code &&
              (error as any).cause.code === 4001
            ) {
              addToast?.({
                title: 'User canceled transaction',
                description: 'You have canceled the transaction.',
              })
              return
            }
          }
          addToast?.({
            title: 'Could not place bid',
            description: 'The transaction was not completed.',
          })
        }}
      />
    )
}

export default Bid
