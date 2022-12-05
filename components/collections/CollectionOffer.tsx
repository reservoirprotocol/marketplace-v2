import { BidModal, Trait } from '@reservoir0x/reservoir-kit-ui'
import { Button } from 'components/primitives'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useNetwork, useSigner } from 'wagmi'

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID

type ChainId = 1 | 3 | 4 | 5 | 10

export const CollectionOffer = ({ collection }) => {
  const router = useRouter()
  const [attribute, setAttribute] = useState<Trait>(undefined)
  const { data: signer } = useSigner()
  const { chain: activeChain } = useNetwork()

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

  const env = {
    chainId: +CHAIN_ID as ChainId,
  }

  const isSupported = !!collection?.collectionBidSupported
  const isInTheWrongNetwork = Boolean(signer && activeChain?.id !== env.chainId)
  const isAttributeModal = !!attribute

  return (
    <>
      {isSupported && (
        <BidModal
          collectionId={collection?.id}
          trigger={
            <Button disabled={isInTheWrongNetwork}>
              {isAttributeModal ? 'Attribute Offer' : 'Collection Offer'}
            </Button>
          }
          attribute={attribute}
          onBidComplete={() => {
            // Update when tokens grid is set up with swr
            // stats.mutate()
            // tokens.mutate()
          }}
          onBidError={(error) => {
            if (error) {
              if (
                (error as any).cause.code &&
                (error as any).cause.code === 4001
              ) {
                //TODO: add toast
                return
              }
            }
            //TODO: add toast
          }}
        />
      )}
    </>
  )
}
