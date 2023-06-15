import { BidModal, BidStep, Trait } from '@reservoir0x/reservoir-kit-ui'
import { Button } from 'components/primitives'
import { useRouter } from 'next/router'
import {
  ComponentProps,
  ComponentPropsWithoutRef,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  mainnet,
  useAccount,
  useNetwork,
  useWalletClient,
  useSwitchNetwork,
} from 'wagmi'
import { useCollections } from '@reservoir0x/reservoir-kit-ui'
import { SWRResponse } from 'swr'
import { CSS } from '@stitches/react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { ToastContext } from 'context/ToastContextProvider'
import { useMarketplaceChain } from 'hooks'

type Props = {
  collection: NonNullable<ReturnType<typeof useCollections>['data']>[0]
  mutate?: SWRResponse['mutate']
  buttonCss?: CSS
  buttonProps?: ComponentProps<typeof Button>
}

type BiddingCurrencies = ComponentPropsWithoutRef<typeof BidModal>['currencies']

const CollectionOffer: FC<Props> = ({
  collection,
  mutate,
  buttonCss,
  buttonProps = {},
}) => {
  const router = useRouter()
  const marketplaceChain = useMarketplaceChain()
  const [attribute, setAttribute] = useState<Trait>(undefined)
  const { data: signer } = useWalletClient()
  const { chain: activeChain } = useNetwork()
  const { isDisconnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { addToast } = useContext(ToastContext)
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: marketplaceChain.id,
  })

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
  const isInTheWrongNetwork = Boolean(
    signer && activeChain?.id !== marketplaceChain.id
  )
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

  if (isDisconnected || isInTheWrongNetwork) {
    return (
      <Button
        css={buttonCss}
        disabled={isInTheWrongNetwork && !switchNetworkAsync}
        onClick={async () => {
          if (isInTheWrongNetwork && switchNetworkAsync) {
            const chain = await switchNetworkAsync(marketplaceChain.id)
            if (chain.id !== marketplaceChain.id) {
              return false
            }
          }

          if (!signer) {
            openConnectModal?.()
          }
        }}
        {...buttonProps}
      >
        {isAttributeModal ? 'Attribute Offer' : 'Collection Offer'}
      </Button>
    )
  } else
    return (
      <>
        {isSupported && (
          <BidModal
            collectionId={collection?.id}
            trigger={
              <Button css={buttonCss} {...buttonProps}>
                {isAttributeModal ? 'Attribute Offer' : 'Collection Offer'}
              </Button>
            }
            attribute={attribute}
            currencies={bidCurrencies}
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
          />
        )}
      </>
    )
}

export default CollectionOffer
