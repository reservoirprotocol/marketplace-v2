import React, { ComponentProps, FC, useContext, useState } from 'react'
import { useAccount } from 'wagmi'
import { useCart } from '@reservoir0x/reservoir-kit-ui'
import { Button } from 'components/primitives'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { CSS } from '@stitches/react'
import { useMarketplaceChain } from 'hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { ToastContext } from 'context/ToastContextProvider'
import { ConfirmationModal } from 'components/common/ConfirmationModal'

type Props = {
  token?: Parameters<ReturnType<typeof useCart>['add']>[0][0]
  buttonCss?: CSS
  buttonProps?: ComponentProps<typeof Button>
}

const AddToCart: FC<Props> = ({ token, buttonCss, buttonProps }) => {
  const { addToast } = useContext(ToastContext)
  const { data: items, add, remove, clear } = useCart((cart) => cart.items)
  const { data: cartChain } = useCart((cart) => cart.chain)
  const { isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const marketplaceChain = useMarketplaceChain()
  const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false)

  if (!token || (!('market' in token) && !('id' in token))) {
    return null
  }

  if (
    'market' in token &&
    (token?.market?.floorAsk?.price?.amount === null ||
      token?.market?.floorAsk?.price?.amount === undefined)
  ) {
    return null
  }

  let tokenKey = ''
  if ('id' in token) {
    tokenKey = token.id
  } else {
    tokenKey = `${token.token?.collection?.id}:${token.token?.tokenId}`
  }
  const isInCart = items.find(
    (item) => `${item.collection.id}:${item.token.id}` === tokenKey
  )

  return (
    <>
      <Button
        css={buttonCss}
        color="primary"
        onClick={async () => {
          if (!isConnected) {
            openConnectModal?.()
          }

          if (isInCart) {
            remove([tokenKey])
          } else if (cartChain && cartChain?.id !== marketplaceChain.id) {
            setConfirmationOpen(true)
          } else {
            add([token], marketplaceChain.id).then(() => {
              addToast?.({
                title: 'Added to cart',
              })
            })
          }
        }}
        {...buttonProps}
      >
        <FontAwesomeIcon
          icon={isInCart ? faMinus : faShoppingCart}
          width="16"
          height="16"
        />
      </Button>
      <ConfirmationModal
        title="Could not add item to cart"
        message="Your cart has items from a different chain than the item you are trying to add. Adding this item will clear your existing cart and start a new one."
        open={confirmationOpen}
        onOpenChange={setConfirmationOpen}
        onConfirmed={(confirmed) => {
          if (confirmed) {
            clear()
            add([token], marketplaceChain.id)
          }
        }}
      />
    </>
  )
}

export default AddToCart
