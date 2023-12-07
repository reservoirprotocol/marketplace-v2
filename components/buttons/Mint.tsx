import React, {
  ComponentProps,
  ComponentPropsWithoutRef,
  FC,
  ReactNode,
  useContext,
  useMemo,
} from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { MintStep, MintModal } from '@reservoir0x/reservoir-kit-ui'
import { useMarketplaceChain } from 'hooks'
import { CSS } from '@stitches/react'
import { Button } from 'components/primitives'
import { SWRResponse } from 'swr'
import { ReferralContext } from 'context/ReferralContextProvider'
import { useWalletClient } from 'wagmi'
import { adaptPrivyWallet } from 'utils/privyAdapter'

type Props = {
  collectionId?: string
  tokenId?: string
  buttonCss?: CSS
  buttonProps?: ComponentProps<typeof Button>
  buttonChildren?: ReactNode
  mutate?: SWRResponse['mutate']
  openState?: ComponentPropsWithoutRef<typeof MintModal>['openState']
}

const Mint: FC<Props> = ({
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
  const contract = collectionId?.split(':')?.[0]
  const token = tokenId ? `${contract}:${tokenId}` : undefined

  const { data: wallet } = useWalletClient()

  const privyWallet = useMemo(() => {
    return wallet ? adaptPrivyWallet(wallet) : undefined
  }, [wallet, adaptPrivyWallet])

  return (
    <MintModal
      trigger={
        <Button css={buttonCss} color="primary" {...buttonProps}>
          {buttonChildren}
        </Button>
      }
      collectionId={collectionId}
      token={token}
      openState={openState}
      walletClient={privyWallet}
      feesOnTopUsd={feesOnTop}
      chainId={marketplaceChain.id}
      onConnectWallet={() => {
        login?.()
      }}
      onClose={(data, currentStep) => {
        if (mutate && currentStep == MintStep.Complete) mutate()
      }}
    />
  )
}

export default Mint
