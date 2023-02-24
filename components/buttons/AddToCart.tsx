import { ComponentProps, FC } from 'react'
import { useCart, useDynamicTokens } from '@nftearth/reservoir-kit-ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus, faRemove } from '@fortawesome/free-solid-svg-icons'

import { useNetwork, useSigner, useSwitchNetwork } from 'wagmi'
import { useMarketplaceChain } from 'hooks'
import { useTheme } from 'next-themes'
import { Button } from '../primitives'
import { CSS } from '@stitches/react'

type Props = {
  token?: ReturnType<typeof useDynamicTokens>['data'][0]
  icon?: boolean
  buttonCss?: CSS
  buttonProps?: ComponentProps<typeof Button>
}

const AddToCart: FC<Props> = ({ token, icon, buttonCss, buttonProps }) => {
  const { data: signer } = useSigner()
  const { chain: activeChain } = useNetwork()
  const { theme } = useTheme()
  const marketplaceChain = useMarketplaceChain()
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: marketplaceChain.id,
  })
  const { add, remove } = useCart((cart) => cart.items)

  const isInTheWrongNetwork = Boolean(
    signer && activeChain?.id !== marketplaceChain.id
  )
  const tokenId = `${token?.token?.collection?.id}:${token?.token?.tokenId}`
  const canAddToCart = !!token?.market?.floorAsk?.price?.amount

  if (token?.isInCart) {
    return (
      <Button
        onClick={() => remove([tokenId])}
        color="gray4"
        css={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        {...buttonProps}
      >
        {icon ? <FontAwesomeIcon icon={faRemove} /> : `Remove`}
      </Button>
    )
  }

  if (!token?.isInCart && canAddToCart) {
    return (
      <Button
        color={
          theme ? (theme === 'dark' ? 'secondary' : 'tertiary') : 'secondary'
        }
        {...buttonProps}
        css={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onClick={async () => {
          if (isInTheWrongNetwork) {
            await switchNetworkAsync?.()
          }
          await add([token], Number(activeChain?.id))
        }}
      >
        {icon ? <FontAwesomeIcon icon={faCartPlus} /> : `Add to Cart`}
      </Button>
    )
  }

  return null
}

export default AddToCart
