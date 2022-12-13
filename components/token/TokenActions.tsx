import { useTokens } from '@reservoir0x/reservoir-kit-ui'
import { AcceptBid, Bid, BuyNow, List } from 'components/buttons'
import { Flex, Box, Button } from 'components/primitives'
import { useRouter } from 'next/router'
import { ComponentPropsWithoutRef, FC, useState } from 'react'
import { MutatorCallback } from 'swr'
import { useAccount, useNetwork, useSigner } from 'wagmi'
import { ConnectWalletButton } from '../ConnectWalletButton'

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID

type Props = {
  token: ReturnType<typeof useTokens>['data'][0]
  isOwner: boolean
  mutate?: MutatorCallback
}

export const TokenActions: FC<Props> = ({ token, isOwner, mutate }) => {
  const { isDisconnected } = useAccount()
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
    isOwner
      ? true
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
    <Flex
      align="center"
      css={{
        gap: '$3',
        flexDirection: 'column',
        width: '100%',
        '@sm': { flexDirection: 'row' },
      }}
    >
      {isDisconnected ? (
        <Box css={{ maxWidth: 200 }}>
          <ConnectWalletButton />
        </Box>
      ) : (
        <>
          {isOwner ? (
            <List token={token} mutate={mutate} buttonCss={buttonCss} />
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

          {/* TODO: Add CancelOffer RK modal*/}

          {/* TODO: Add CancelListing RK modal */}

          {/* TODO: Add to Cart */}
        </>
      )}
    </Flex>
  )
}
