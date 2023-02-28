import { useTokens } from '@reservoir0x/reservoir-kit-ui'
import { AcceptBid, Bid, BuyNow, List } from 'components/buttons'
import AddToCart from 'components/buttons/AddToCart'
import CancelBid from 'components/buttons/CancelBid'
import CancelListing from 'components/buttons/CancelListing'
import { Button, Flex, Grid } from 'components/primitives'
import { useRouter } from 'next/router'
import { ComponentPropsWithoutRef, FC, useState } from 'react'
import { MutatorCallback } from 'swr'
import { useAccount } from 'wagmi'

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
  const bidOpenState = useState(true)

  const queryBidId = router.query.bidId as string
  const deeplinkToAcceptBid = router.query.acceptBid === 'true'
  const is1155 = token?.token?.kind === 'erc1155'

  const showAcceptOffer =
    !is1155 &&
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
  const isListed = token ? token?.market?.floorAsk?.id !== null : false

  const buttonCss: ComponentPropsWithoutRef<typeof Button>['css'] = {
    width: '100%',
    height: 52,
    justifyContent: 'center',
    minWidth: 'max-content',
    '@sm': {
      maxWidth: 250,
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
          maxWidth: 500,
        },
      }}
    >
      {isOwner && !is1155 && (
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
      )}
      {(!isOwner || is1155) && isListed && (
        <Flex
          css={{ ...buttonCss, borderRadius: 8, overflow: 'hidden', gap: 1 }}
        >
          <BuyNow
            token={token}
            buttonCss={{ flex: 1, justifyContent: 'center' }}
            buttonProps={{ corners: 'square' }}
            mutate={mutate}
          />
          <AddToCart
            token={token}
            buttonCss={{
              width: 52,
              p: 0,
              justifyContent: 'center',
            }}
            buttonProps={{ corners: 'square' }}
          />
        </Flex>
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

      {(!isOwner || is1155) && (
        <Bid
          tokenId={token?.token?.tokenId}
          collectionId={token?.token?.collection?.id}
          mutate={mutate}
          buttonCss={buttonCss}
        />
      )}

      {isTopBidder && !is1155 && (
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

      {isOwner && isListed && !is1155 && (
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
