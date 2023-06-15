import { ListModal, ListStep, useTokens } from '@reservoir0x/reservoir-kit-ui'
import { Button } from 'components/primitives'
import {
  cloneElement,
  ComponentProps,
  ComponentPropsWithoutRef,
  FC,
  ReactNode,
  useContext,
} from 'react'
import { CSS } from '@stitches/react'
import { SWRResponse } from 'swr'
import {
  useAccount,
  useNetwork,
  useWalletClient,
  mainnet,
  useSwitchNetwork,
} from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { ToastContext } from 'context/ToastContextProvider'
import { useMarketplaceChain } from 'hooks'
import { zeroAddress } from 'viem'

type ListingCurrencies = ComponentPropsWithoutRef<
  typeof ListModal
>['currencies']

type Props = {
  token?: ReturnType<typeof useTokens>['data'][0]
  buttonCss?: CSS
  buttonChildren?: ReactNode
  buttonProps?: ComponentProps<typeof Button>
  mutate?: SWRResponse['mutate']
}

const List: FC<Props> = ({
  token,
  buttonCss,
  buttonChildren,
  buttonProps,
  mutate,
}) => {
  const { isDisconnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { addToast } = useContext(ToastContext)

  const marketplaceChain = useMarketplaceChain()
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: marketplaceChain.id,
  })

  const { data: signer } = useWalletClient()
  const { chain: activeChain } = useNetwork()

  const isInTheWrongNetwork = Boolean(
    signer && marketplaceChain.id !== activeChain?.id
  )

  // CONFIGURABLE: Here you can configure which currencies you would like to support for listing
  let listingCurrencies: ListingCurrencies = undefined
  if (marketplaceChain.id === mainnet.id) {
    listingCurrencies = [
      {
        contract: zeroAddress,
        symbol: 'ETH',
        coinGeckoId: 'ethereum',
      },
      {
        contract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        symbol: 'USDC',
        decimals: 6,
        coinGeckoId: 'usd-coin',
      },
    ]
  }

  const tokenId = token?.token?.tokenId
  const contract = token?.token?.contract

  const trigger = (
    <Button css={buttonCss} color="primary" {...buttonProps}>
      {buttonChildren}
    </Button>
  )

  if (isDisconnected || isInTheWrongNetwork) {
    return cloneElement(trigger, {
      onClick: async () => {
        if (switchNetworkAsync && activeChain) {
          const chain = await switchNetworkAsync(marketplaceChain.id)
          if (chain.id !== marketplaceChain.id) {
            return false
          }
        }

        if (!signer) {
          openConnectModal?.()
        }
      },
    })
  } else
    return (
      <ListModal
        trigger={trigger}
        collectionId={contract}
        tokenId={tokenId}
        currencies={listingCurrencies}
        onClose={(data, stepData, currentStep) => {
          if (mutate && currentStep == ListStep.Complete) mutate()
        }}
        onListingError={(err: any) => {
          if (err?.code === 4001) {
            addToast?.({
              title: 'User canceled transaction',
              description: 'You have canceled the transaction.',
            })
            return
          }
          addToast?.({
            title: 'Could not list token',
            description: 'The transaction was not completed.',
          })
        }}
      />
    )
}

export default List
