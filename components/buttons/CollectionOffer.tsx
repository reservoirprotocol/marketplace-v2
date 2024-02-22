import { BidModal, BidStep, Trait } from '@reservoir0x/reservoir-kit-ui'
import { Button } from 'components/primitives'
import { useRouter } from 'next/router'
import {
  ComponentProps,
  ComponentPropsWithoutRef,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { useCollections } from '@reservoir0x/reservoir-kit-ui'
import { SWRResponse } from 'swr'
import { CSS } from '@stitches/react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { ToastContext } from 'context/ToastContextProvider'
import { useMarketplaceChain } from 'hooks'
import { mainnet } from 'wagmi/chains'

type Props = {
  collection: NonNullable<ReturnType<typeof useCollections>['data']>[0]
  mutate?: SWRResponse['mutate']
  buttonCss?: CSS
  buttonChildren?: ReactNode
  buttonProps?: ComponentProps<typeof Button>
}

type BiddingCurrencies = ComponentPropsWithoutRef<typeof BidModal>['currencies']

const orderFee = process.env.NEXT_PUBLIC_MARKETPLACE_FEE
const orderFees = orderFee ? [orderFee] : []

const CollectionOffer: FC<Props> = ({
  collection,
  mutate,
  buttonCss,
  buttonChildren,
  buttonProps = {},
}) => {
  const router = useRouter()
  const marketplaceChain = useMarketplaceChain()
  const [attribute, setAttribute] = useState<Trait>(undefined)
  const { data: signer } = useWalletClient()
  const { isDisconnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { addToast } = useContext(ToastContext)

  useEffect(() => {
    const keys = Object.keys(router.query)
    const attributesSelected = keys.filter(
      (key) =>
        key.startsWith('attributes[') &&
        key.endsWith(']') &&
        router.query[key] !== '' &&
        !Array.isArray(router.query[key])
    )

    // Only enable the attribute modal if one attribute is selected
    if (attributesSelected.length !== 1) {
      setAttribute(undefined)
      return
    }

    const value = router.query[attributesSelected[0]]?.toString()
    const key = attributesSelected[0].slice(11, -1)

    if (key && value) {
      setAttribute({
        key,
        value,
      })
    }
  }, [router.query])

  const isSupported = !!collection?.collectionBidSupported
  const isAttributeModal = !!attribute

  // CONFIGURABLE: Here you can configure which currencies you would like to support for bidding
  let bidCurrencies: BiddingCurrencies = undefined
  if (marketplaceChain.id === mainnet.id) {
    bidCurrencies = [
      {
        contract: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        symbol: 'WETH',
        coinGeckoId: 'ethereum',
      },
      {
        contract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        symbol: 'USDC',
        decimals: 6,
        coinGeckoId: 'usd-coin',
      },
    ]
  }

  const trigger = (
    <Button css={buttonCss} color="primary" {...buttonProps}>
      {buttonChildren
        ? buttonChildren
        : isAttributeModal
        ? 'Attribute Offer'
        : 'Collection Offer'}
    </Button>
  )

  if (isDisconnected) {
    return (
      <Button
        css={buttonCss}
        onClick={async () => {
          if (!signer) {
            openConnectModal?.()
          }
        }}
        {...buttonProps}
      >
        {buttonChildren
          ? buttonChildren
          : isAttributeModal
          ? 'Attribute Offer'
          : 'Collection Offer'}
      </Button>
    )
  } else
    return (
      <>
        {isSupported && (
          <BidModal
            collectionId={collection?.id}
            trigger={trigger}
            attribute={attribute}
            feesBps={orderFees}
            currencies={bidCurrencies}
            oracleEnabled={marketplaceChain.oracleBidsEnabled}
            chainId={marketplaceChain.id}
            onClose={(data, stepData, currentStep) => {
              if (mutate && currentStep == BidStep.Complete) mutate()
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
        )}
      </>
    )
}

export default CollectionOffer
