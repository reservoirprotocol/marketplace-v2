import React, { ComponentProps, FC, useEffect, useState } from 'react'
import { SWRResponse } from 'swr'
import { useAccount, useNetwork, useSigner } from 'wagmi'
import { BuyModal, BuyStep, useTokens } from '@reservoir0x/reservoir-kit-ui'
import { useSwitchNetwork } from 'wagmi'
import { Button } from 'components/primitives'
import { useModal } from 'connectkit'
import { CSS } from '@stitches/react'
import { useMarketplaceChain } from 'hooks'
import { useConnectAndSwitchNetwork } from 'hooks/useConnectAndSwitchNetwork'
import { id } from 'ethers/lib/utils.js'

type Props = {
  token?: ReturnType<typeof useTokens>['data'][0]
  buttonCss?: CSS
  buttonProps?: ComponentProps<typeof Button>
  mutate?: SWRResponse['mutate']
}

// const BuyNow: FC<Props> = ({ token, mutate, buttonCss, buttonProps = {} }) => {
//   const { data: signer } = useSigner()
//   const { isConnected } = useAccount()
//   const { open: connectModalOpen, setOpen: setConnectModalOpen } = useModal()
//   const [clickPendingResponse, setClickPendingResponse] = useState(false)
//   const [open, setOpen] = useState(false)
//   const { chain: activeChain } = useNetwork()
//   const marketplaceChain = useMarketplaceChain()
//   const { switchNetworkAsync } = useSwitchNetwork({
//     chainId: marketplaceChain.id,
//   })

//   const isInTheWrongNetwork = Boolean(
//     isConnected && activeChain?.id !== marketplaceChain.id
//   )

//   if (
//     token?.market?.floorAsk?.price?.amount === null ||
//     token?.market?.floorAsk?.price?.amount === undefined
//   ) {
//     return null
//   }

//   const trigger = (
//     <Button css={buttonCss} color="primary" {...buttonProps}>
//       Buy Now
//     </Button>
//   )
//   const canBuy =
//     signer &&
//     token?.token?.tokenId &&
//     token?.token?.collection?.id &&
//     !isInTheWrongNetwork

//   const handleSwitchNetwork = async () => {
//     if (isInTheWrongNetwork && switchNetworkAsync) {
//       const chain = await switchNetworkAsync(marketplaceChain.id)
//       if (chain.id !== marketplaceChain.id) {
//         return false
//       } else {
//         setOpen(true)
//       }
//     } else {
//       setOpen(true)
//     }
//   }

//   useEffect(() => {
//     const handleOpenModal = async () => {
//       if (!connectModalOpen && isConnected && clickPendingResponse) {
//         await handleSwitchNetwork()
//       }
//       if (!connectModalOpen) {
//         setClickPendingResponse(false)
//       }
//     }

//     handleOpenModal().catch((e) => console.log(e))
//   }, [connectModalOpen])

//   return !canBuy ? (
//     <Button
//       css={buttonCss}
//       aria-haspopup="dialog"
//       color="primary"
//       onClick={async () => {
//         handleSwitchNetwork()

//         if (!signer) {
//           setClickPendingResponse(true)
//           setConnectModalOpen(true)
//         }
//       }}
//       {...buttonProps}
//     >
//       Buy Now
//     </Button>
//   ) : (
//     <BuyModal
//       openState={[open, setOpen]}
//       trigger={trigger}
//       tokenId={token?.token?.tokenId}
//       collectionId={token?.token?.collection?.id}
//       onClose={(data, stepData, currentStep) => {
//         if (mutate && currentStep == BuyStep.Complete) mutate()
//       }}
//     />
//   )
// }

// export default BuyNow

const BuyNow: FC<Props> = ({ token, mutate, buttonCss, buttonProps = {} }) => {
  const {
    signer,
    isConnected,
    isInTheWrongNetwork,
    handleSwitchNetwork,
    openConnectModal,
  } = useConnectAndSwitchNetwork()

  const [open, setOpen] = useState(false)

  const { tokenId, collection } = token?.token || {}
  const { id: collectionId } = collection || {}

  const canBuy = signer && tokenId && collectionId && !isInTheWrongNetwork

  const trigger = (
    <Button css={buttonCss} color="primary" {...buttonProps}>
      Buy Now
    </Button>
  )

  if (
    token?.market?.floorAsk?.price?.amount === null ||
    token?.market?.floorAsk?.price?.amount === undefined
  ) {
    return null
  }

  const handleClick = async () => {
    if (!isConnected) {
      openConnectModal()
    }
    const switched = await handleSwitchNetwork()

    if (switched) {
      setOpen(true)
    } else {
      openConnectModal()
    }
  }

  return (
    <>
      {!canBuy ? (
        <Button
          // css={buttonCss}
          css={{ background: 'red' }}
          aria-haspopup="dialog"
          color="primary"
          onClick={handleClick}
          {...buttonProps}
        >
          Buy Now
        </Button>
      ) : (
        <BuyModal
          openState={[open, setOpen]}
          trigger={trigger}
          tokenId={tokenId}
          collectionId={collectionId}
          onClose={(data, stepData, currentStep) => {
            if (mutate && currentStep === BuyStep.Complete) mutate()
          }}
        />
      )}
    </>
  )
}

export default BuyNow
