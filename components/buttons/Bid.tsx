import { BidModal } from '@reservoir0x/reservoir-kit-ui'
import { Button } from 'components/primitives'
import { ComponentProps, FC } from 'react'
import { CSS } from '@stitches/react'
import { SWRResponse } from 'swr'

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
  const trigger = (
    <Button css={buttonCss} disabled={disabled} {...buttonProps} color="gray3">
      Make Offer
    </Button>
  )
  return (
    <>
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
      />
    </>
  )
}

export default Bid
