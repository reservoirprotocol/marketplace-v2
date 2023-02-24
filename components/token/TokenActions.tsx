import { ComponentPropsWithoutRef, FC, useState } from 'react'
import {useDynamicTokens} from '@nftearth/reservoir-kit-ui'
import { useRouter } from 'next/router'
import { MutatorCallback } from 'swr'
import { useAccount } from 'wagmi'

import { Button, Grid } from 'components/primitives'
import { AcceptBid, Bid, BuyNow, List } from 'components/buttons'
import CancelBid from 'components/buttons/CancelBid'
import CancelListing from 'components/buttons/CancelListing'
import AddToCart from "components/buttons/AddToCart";

type Props = {
  token: ReturnType<typeof useDynamicTokens>['data'][0]
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
  const bidOpenState = useState(true)

  const queryBidId = router.query.bidId as string
  const deeplinkToAcceptBid = router.query.acceptBid === 'true'

  const showAcceptOffer =
    !!(token?.market?.topBid?.id !== null &&
      token?.market?.topBid?.id !== undefined &&
      isOwner &&
      token?.token?.owner)

  const isTopBidder =
    account.isConnected &&
    token?.market?.topBid?.maker?.toLowerCase() ===
      account?.address?.toLowerCase()

  const isListed = token
    ? token?.market?.floorAsk?.id !== null && token?.token?.kind !== 'erc1155'
    : false

  const buttonCss: ComponentPropsWithoutRef<typeof Button>['css'] = {
    width: '100%',
    justifyContent: 'center',
    minWidth: 'max-content',
    background: '$primary9',
    '@sm': {
      maxWidth: '200px',
    },
  }

  return (
    <Grid
      align="center"
      css={{
        gap: '$4',
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

      {!isOwner && isListed && (
        <AddToCart token={token}/>
      )}

      {!isOwner && (
        <Bid
          tokenId={token?.token?.tokenId}
          collectionId={token?.token?.collection?.id}
          mutate={mutate}
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
    </Grid>
  )
}
