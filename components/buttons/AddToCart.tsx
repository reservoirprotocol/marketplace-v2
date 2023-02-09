import React, { ComponentProps, FC, useContext } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { useCart } from '@reservoir0x/reservoir-kit-ui'
import { useSwitchNetwork } from 'wagmi'
import { Button } from 'components/primitives'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { CSS } from '@stitches/react'
import { useMarketplaceChain } from 'hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { ToastContext } from 'context/ToastContextProvider'

type Props = {
  token?: Parameters<ReturnType<typeof useCart>['add']>[0][0]
  buttonCss?: CSS
  buttonProps?: ComponentProps<typeof Button>
}

const AddToCart: FC<Props> = ({ token, buttonCss, buttonProps }) => {
  const { addToast } = useContext(ToastContext)
  const { data: items, add, remove } = useCart((cart) => cart.items)
  const { isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { chain: activeChain } = useNetwork()
  const marketplaceChain = useMarketplaceChain()
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: marketplaceChain.id,
  })
  const isInTheWrongNetwork = Boolean(
    isConnected && activeChain?.id !== marketplaceChain.id
  )

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
    <Button
      css={buttonCss}
      color="primary"
      onClick={async () => {
        if (isInTheWrongNetwork && switchNetworkAsync) {
          const chain = await switchNetworkAsync(marketplaceChain.id)
          if (chain.id !== marketplaceChain.id) {
            return false
          }
        }

        if (!isConnected) {
          openConnectModal?.()
        }

        if (isInCart) {
          remove([tokenKey])
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
  )
}

export default AddToCart
