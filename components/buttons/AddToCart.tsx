import {useNetwork, useSigner, useSwitchNetwork} from "wagmi";
import {useConnectModal} from "@rainbow-me/rainbowkit";
import {useMarketplaceChain} from "../../hooks";
import {useRecoilState, useRecoilValue} from "recoil";
import recoilCartTokens, {getTokensMap, getPricingPools, getCartCurrency} from 'recoil/cart'
import {Dispatch, FC, SetStateAction} from "react";
import {useTokens} from "@nftearth/reservoir-kit-ui";
import {getPricing} from "../../utils/tokenPricing";
import {Button} from "../primitives";

type Props = {
  token?: ReturnType<typeof useTokens>['data'][0]
  setClearCartOpen?: Dispatch<SetStateAction<boolean>>
  setCartToSwap?: Dispatch<SetStateAction<any | undefined>>
}

const AddToCart: FC<Props> = ({ token, setClearCartOpen, setCartToSwap }) => {
  const { data: signer } = useSigner()
  const { openConnectModal } = useConnectModal()
  const { chain: activeChain } = useNetwork()
  const marketplaceChain = useMarketplaceChain()
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: marketplaceChain.id,
  })
  const cartPools = useRecoilValue(getPricingPools)
  const cartCurrency = useRecoilValue(getCartCurrency)
  const [cartTokens, setCartTokens] = useRecoilState(recoilCartTokens)
  const tokensMap = useRecoilValue(getTokensMap)
  const isInTheWrongNetwork = Boolean(
    signer && activeChain?.id !== marketplaceChain.id
  )
  let price = getPricing(cartPools, token)
  const tokenId = `${token?.token?.contract}:${token?.token?.tokenId}`
  const isInCart = Boolean(tokensMap[tokenId])
  const canAddToCart = !!token?.market?.floorAsk?.price?.amount;

  if (isInCart) {
    return (
      <Button
        onClick={() => {
          const newCartTokens = [...cartTokens]
          const index = newCartTokens.findIndex(
            (newCartToken) =>
              newCartToken.token.contract ===
              token?.token?.contract &&
              newCartToken.token.tokenId === token?.token?.tokenId
          )
          newCartTokens.splice(index, 1)
          setCartTokens(newCartTokens)
        }}
        color="ghost"
        css={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        Remove
      </Button>
    )
  }

  if (!isInCart && canAddToCart) {
    return (
      <Button
        color="secondary"
        disabled={isInTheWrongNetwork}
        onClick={() => {
          if (token && token.token && token.market) {
            if (
              !cartCurrency ||
              price?.currency?.contract === cartCurrency?.contract
            ) {
              setCartTokens([
                ...cartTokens,
                {
                  token: token.token,
                  market: token.market,
                },
              ])
            } else {
              setCartToSwap &&
              setCartToSwap([
                {
                  token: token.token,
                  market: token.market,
                },
              ])
              setClearCartOpen && setClearCartOpen(true)
            }
          }
        }}
      >
        Add to Cart
      </Button>
    )
  }

  return null;
}

export default AddToCart;