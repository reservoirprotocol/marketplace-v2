import { ListModal, ListStep, useTokens } from '@reservoir0x/reservoir-kit-ui'
import { Button } from 'components/primitives'
import {
  cloneElement,
  ComponentProps,
  ComponentPropsWithoutRef,
  FC,
  ReactNode,
  useContext,
} from 'react'
import { CSS } from '@stitches/react'
import { SWRResponse } from 'swr'
import { useAccount, useWalletClient } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { ToastContext } from 'context/ToastContextProvider'
import { useMarketplaceChain } from 'hooks'

const orderFee = process.env.NEXT_PUBLIC_MARKETPLACE_FEE

type ListingCurrencies = ComponentPropsWithoutRef<
  typeof ListModal
>['currencies']

type Props = {
  token?: ReturnType<typeof useTokens>['data'][0]
  buttonCss?: CSS
  buttonChildren?: ReactNode
  buttonProps?: ComponentProps<typeof Button>
  mutate?: SWRResponse['mutate']
}

const List: FC<Props> = ({
  token,
  buttonCss,
  buttonChildren,
  buttonProps,
  mutate,
}) => {
  const { isDisconnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { addToast } = useContext(ToastContext)

  const marketplaceChain = useMarketplaceChain()

  const { data: signer } = useWalletClient()

  const listingCurrencies: ListingCurrencies =
    marketplaceChain.listingCurrencies
  const tokenId = token?.token?.tokenId
  const collectionId = token?.token?.collection?.id

  const trigger = (
    <Button css={buttonCss} color="primary" {...buttonProps}>
      {buttonChildren}
    </Button>
  )

  const orderFees = orderFee ? [orderFee] : []

  if (isDisconnected) {
    return cloneElement(trigger, {
      onClick: async () => {
        if (!signer) {
          openConnectModal?.()
        }
      },
    })
  } else
    return (
      <ListModal
        trigger={trigger}
        collectionId={collectionId}
        tokenId={tokenId}
        feesBps={orderFees}
        currencies={listingCurrencies}
        chainId={marketplaceChain.id}
        onClose={(data, stepData, currentStep) => {
          if (mutate && currentStep == ListStep.Complete) mutate()
        }}
        onListingError={(err: any) => {
          if (err?.code === 4001) {
            addToast?.({
              title: 'User canceled transaction',
              description: 'You have canceled the transaction.',
            })
            return
          }
          addToast?.({
            title: 'Could not list token',
            description: 'The transaction was not completed.',
          })
        }}
        oracleEnabled={marketplaceChain.oracleBidsEnabled}
        onPointerDownOutside={(e) => {
          const privyLayer = document.getElementById('privy-dialog')

          const clickedInsidePrivyLayer =
            privyLayer && e.target
              ? privyLayer.contains(e.target as Node)
              : false

          if (clickedInsidePrivyLayer) {
            e.preventDefault()
          }
        }}
      />
    )
}

export default List
