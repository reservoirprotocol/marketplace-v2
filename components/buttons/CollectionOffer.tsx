import { BidModal, Trait } from '@reservoir0x/reservoir-kit-ui'
import { Button } from 'components/primitives'
import { useRouter } from 'next/router'
import { ComponentProps, FC, useContext, useEffect, useState } from 'react'
import { useAccount, useNetwork, useSigner, useSwitchNetwork } from 'wagmi'
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

const CollectionOffer: FC<Props> = ({
  collection,
  mutate,
  buttonCss,
  buttonProps = {},
}) => {
  const router = useRouter()
  const marketplaceChain = useMarketplaceChain()
  const [attribute, setAttribute] = useState<Trait>(undefined)
  const { data: signer } = useSigner()
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
        )}
      </>
    )
}

export default CollectionOffer
