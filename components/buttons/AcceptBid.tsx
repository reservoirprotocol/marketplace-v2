import { AcceptBidModal, useTokens } from '@reservoir0x/reservoir-kit-ui'
import { ComponentProps, FC } from 'react'
import { CSS } from '@stitches/react'
import { SWRResponse } from 'swr'
import { Button } from 'components/primitives'

type Props = {
  token?: ReturnType<typeof useTokens>['data'][0]
  bidId?: string | undefined
  collectionId?: string | undefined
  disabled?: boolean
  openState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  buttonCss?: CSS
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
  buttonProps,
  mutate,
}) => {
  const trigger = (
    <Button css={buttonCss} color="gray3" disabled={disabled} {...buttonProps}>
      Accept Offer
    </Button>
  )
  return (
    <AcceptBidModal
      trigger={trigger}
      openState={openState}
      bidId={bidId}
      collectionId={collectionId}
      tokenId={token?.token?.tokenId}
      onClose={() => {
        if (mutate) {
          mutate()
        }
      }}
      onBidAcceptError={(error: any) => {
        if (error?.type === 'price mismatch') {
          // TODO: add toast
          return
        }
        // Handle user rejection
        if (error?.code === 4001) {
          // TODO: add toast
          return
        }
        // TODO: add toast
      }}
    />
  )
}

export default AcceptBid
