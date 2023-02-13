import {ComponentProps, FC} from "react";
import { useDynamicTokens } from "@nftearth/reservoir-kit-ui";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus, faRemove } from '@fortawesome/free-solid-svg-icons'

import {useNetwork, useSigner} from "wagmi";
import {useMarketplaceChain} from "hooks";
import {Button} from "../primitives";
import {CSS} from "@stitches/react";

type Props = {
  token?: ReturnType<typeof useDynamicTokens>['data'][0],
  icon?: boolean,
  buttonCss?: CSS
  buttonProps?: ComponentProps<typeof Button>
}

const AddToCart: FC<Props> = ({ token, icon, buttonCss, buttonProps }) => {
  const { data: signer } = useSigner()
  const { chain: activeChain } = useNetwork()
  const marketplaceChain = useMarketplaceChain()
  const { add, remove } = useDynamicTokens(false);

  const isInTheWrongNetwork = Boolean(
    signer && activeChain?.id !== marketplaceChain.id
  )
  const tokenId = `${token?.token?.collection?.id}:${token?.token?.tokenId}`
  const canAddToCart = !!token?.market?.floorAsk?.price?.amount;

  if (token?.isInCart) {
    return (
      <Button
        onClick={() => remove([
          tokenId
        ])}
        color="gray4"
        css={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
        {...buttonProps}
      >
        {icon ? (
          <FontAwesomeIcon icon={faRemove} />
        ) : `Remove`}
      </Button>
    )
  }

  if (!token?.isInCart && canAddToCart) {
    return (
      <Button
        color="secondary"
        disabled={isInTheWrongNetwork}
        {...buttonProps}
        onClick={() => add([token], Number(activeChain?.id))}
      >
        {icon ? (
          <FontAwesomeIcon icon={faCartPlus} />
        ) : `Add to Cart`}
      </Button>
    )
  }

  return null;
}

export default AddToCart;