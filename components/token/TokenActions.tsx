import { useTokens } from '@reservoir0x/reservoir-kit-ui'
import { AcceptBid, Bid, BuyNow, List } from 'components/buttons'
import CancelBid from 'components/buttons/CancelBid'
import CancelListing from 'components/buttons/CancelListing'
import { Button, Grid } from 'components/primitives'
import { useRouter } from 'next/router'
import { ComponentPropsWithoutRef, FC, useState } from 'react'
import { MutatorCallback } from 'swr'
import { useAccount, useNetwork, useSigner } from 'wagmi'

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID

type Props = {
  token: ReturnType<typeof useTokens>['data'][0]
  isOwner: boolean
  mutate?: MutatorCallback
  account: ReturnType<typeof useAccount>
}

export const TokenActions: FC<Props> = ({
  token,
  isOwner,
  mutate,
  account,
}) => {
  const router = useRouter()
  const { data: signer } = useSigner()
  const { chain: activeChain } = useNetwork()
  const bidOpenState = useState(true)

  const queryBidId = router.query.bidId as string
  const deeplinkToAcceptBid = router.query.acceptBid === 'true'

  const isInTheWrongNetwork = Boolean(
    signer && CHAIN_ID && activeChain?.id !== +CHAIN_ID
  )

  const showAcceptOffer =
    token?.market?.topBid?.id !== null &&
    token?.market?.topBid?.id !== undefined &&
    isOwner &&
    token?.token?.owner
      ? true
      : false

  const isTopBidder =
    account.isConnected &&
    token?.market?.topBid?.maker?.toLowerCase() ===
      account?.address?.toLowerCase()

  const isListed = token
    ? token?.market?.floorAsk?.price?.amount?.native !== null &&
      token?.token?.kind !== 'erc1155'
    : false

  const buttonCss: ComponentPropsWithoutRef<typeof Button>['css'] = {
    width: '100%',
    justifyContent: 'center',
    minWidth: 'max-content',
    '@sm': {
      maxWidth: '200px',
    },
  }

  return (
    <Grid
      align="center"
      css={{
        gap: '$3',
        gridTemplateColumns: 'repeat(1,minmax(0,1fr))',
        width: '100%',
        '@sm': {
          gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
          width: 'max-content',
        },
      }}
    >
      {isOwner ? (
        <List
          token={token}
          mutate={mutate}
          buttonCss={buttonCss}
          buttonChildren={
            token?.market?.floorAsk?.price?.amount?.decimal
              ? 'Create New Listing'
              : 'List for Sale'
          }
        />
      ) : (
        <BuyNow token={token} mutate={mutate} buttonCss={buttonCss} />
      )}
      {showAcceptOffer && (
        <AcceptBid
          token={token}
          bidId={queryBidId}
          collectionId={token?.token?.contract}
          disabled={isInTheWrongNetwork}
          openState={
            isOwner && (queryBidId || deeplinkToAcceptBid)
              ? bidOpenState
              : undefined
          }
          mutate={mutate}
          buttonCss={buttonCss}
          buttonChildren="Accept Offer"
        />
      )}

      {!isOwner && (
        <Bid
          tokenId={token?.token?.tokenId}
          collectionId={token?.token?.contract}
          disabled={isInTheWrongNetwork}
          mutate={mutate}
          buttonCss={buttonCss}
        />
      )}

      {isTopBidder && (
        <CancelBid
          bidId={token?.market?.topBid?.id as string}
          mutate={mutate}
          trigger={
            <Button
              css={{ color: '$red11', justifyContent: 'center' }}
              color="gray3"
            >
              Cancel Offer
            </Button>
          }
        />
      )}

      {isOwner && isListed && (
        <CancelListing
          listingId={token?.market?.floorAsk?.id as string}
          mutate={mutate}
          trigger={
            <Button
              css={{ color: '$red11', justifyContent: 'center' }}
              color="gray3"
            >
              Cancel Listing
            </Button>
          }
        />
      )}

      {/* TODO: Add to Cart */}
    </Grid>
  )
}
