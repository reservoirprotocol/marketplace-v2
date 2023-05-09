import React, { ComponentProps, FC, ReactNode } from 'react';
import { SWRResponse } from 'swr';
import { useNetwork, useSigner } from 'wagmi';
import { BuyModal, BuyStep, useTokens } from '@reservoir0x/reservoir-kit-ui';
import { useSwitchNetwork } from 'wagmi';
import { Button } from 'components/primitives';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { CSS } from '@stitches/react';
import { useMarketplaceChain } from 'hooks';
import va from '@vercel/analytics';

type Props = {
  tokenId?: string;
  collectionId?: string;
  orderId?: string;
  buttonCss?: CSS;
  buttonProps?: ComponentProps<typeof Button>;
  buttonChildren?: ReactNode;
  mutate?: SWRResponse['mutate'];
};

const BuyNow: FC<Props> = ({
  tokenId,
  collectionId,
  orderId = undefined,
  mutate,
  buttonCss,
  buttonProps = {},
  buttonChildren,
}) => {
  const { data: signer } = useSigner();
  const { openConnectModal } = useConnectModal();
  const { chain: activeChain } = useNetwork();
  const marketplaceChain = useMarketplaceChain();
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: marketplaceChain.id,
  });
  const isInTheWrongNetwork = Boolean(
    signer && activeChain?.id !== marketplaceChain.id
  );

  const trigger = (
    <Button css={buttonCss} color="primary" {...buttonProps}>
      {buttonChildren}
    </Button>
  );

  const handleClick = async () => {
    va.track('Buy Now');
    if (isInTheWrongNetwork && switchNetworkAsync) {
      const chain = await switchNetworkAsync(marketplaceChain.id);
      if (chain.id !== marketplaceChain.id) {
        return false;
      }
    }

    if (!signer) {
      openConnectModal?.();
    }
  };

  const canBuy = signer && tokenId && collectionId && !isInTheWrongNetwork;

  return !canBuy ? (
    <Button
      css={buttonCss}
      aria-haspopup="dialog"
      color="primary"
      onClick={handleClick}
      {...buttonProps}
    >
      {buttonChildren}
    </Button>
  ) : (
    <BuyModal
      trigger={React.cloneElement(trigger, {
        onClick: () => {
          va.track('Buy Now');
        },
      })}
      tokenId={tokenId}
      collectionId={collectionId}
      orderId={orderId}
      referrer={'0xd2f6BF9e792DbBCA466D93bCC5a939e2D1c72B2B'}
      referrerFeeBps={100}
      onClose={(data, stepData, currentStep) => {
        if (mutate && currentStep == BuyStep.Complete) mutate();
      }}
    />
  );
};

export default BuyNow;
