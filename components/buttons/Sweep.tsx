import React, {
  ComponentProps,
  ComponentPropsWithoutRef,
  FC,
  ReactNode,
  useContext,
} from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { CollectModal, CollectStep } from '@reservoir0x/reservoir-kit-ui'
import { useMarketplaceChain } from 'hooks'
import { CSS } from '@stitches/react'
import { Button } from 'components/primitives'
import { SWRResponse } from 'swr'
import { ReferralContext } from 'context/ReferralContextProvider'

type Props = {
  collectionId?: string
  tokenId?: string
  buttonCss?: CSS
  buttonProps?: ComponentProps<typeof Button>
  buttonChildren?: ReactNode
  mutate?: SWRResponse['mutate']
  openState?: ComponentPropsWithoutRef<typeof CollectModal>['openState']
}

const Sweep: FC<Props> = ({
  collectionId,
  tokenId,
  buttonCss,
  buttonProps,
  buttonChildren,
  mutate,
  openState,
}) => {
  const { login } = usePrivy()
  const marketplaceChain = useMarketplaceChain()
  const { feesOnTop } = useContext(ReferralContext)

  return (
    <CollectModal
      trigger={
        <Button css={buttonCss} color="primary" {...buttonProps}>
          {buttonChildren}
        </Button>
      }
      collectionId={collectionId}
      tokenId={tokenId}
      mode={'trade'}
      openState={openState}
      //CONFIGURABLE: set any fees on top of orders, note that these will only
      // apply to native orders (using the reservoir order book) and not to external orders (opensea, blur etc)
      // Refer to our docs for more info: https://docs.reservoir.tools/reference/sweepmodal-1
      // feesOnTopBps={["0xabc:50"]}
      feesOnTopUsd={feesOnTop}
      chainId={marketplaceChain.id}
      onConnectWallet={() => {
        login?.()
      }}
      onClose={(data, currentStep) => {
        if (mutate && currentStep == CollectStep.Complete) mutate()
      }}
    />
  )
}

export default Sweep
