import { ListModal, useTokens } from '@reservoir0x/reservoir-kit-ui'
import { Button, Toast } from 'components/primitives'
import { ComponentProps, ComponentPropsWithoutRef, FC, useContext } from 'react'
import { CSS } from '@stitches/react'
import { SWRResponse } from 'swr'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { ToastContext } from 'context/ToastContextProvider'

type ListingCurrencies = ComponentPropsWithoutRef<
  typeof ListModal
>['currencies']

type Props = {
  token?: ReturnType<typeof useTokens>['data'][0]
  buttonCss?: CSS
  buttonProps?: ComponentProps<typeof Button>
  mutate?: SWRResponse['mutate']
}

const List: FC<Props> = ({ token, buttonCss, buttonProps, mutate }) => {
  const { isDisconnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { addToast } = useContext(ToastContext)

  let listingCurrencies: ListingCurrencies = undefined

  const tokenId = token?.token?.tokenId
  const contract = token?.token?.contract

  const trigger = (
    <Button css={buttonCss} color="primary" {...buttonProps}>
      {token?.market?.floorAsk?.price?.amount?.decimal
        ? 'Create New Listing'
        : 'List for Sale'}
    </Button>
  )
  if (isDisconnected) {
    return (
      <Button
        css={buttonCss}
        onClick={() => {
          openConnectModal?.()
        }}
        color="primary"
        {...buttonProps}
      >
        {token?.market?.floorAsk?.price?.amount?.decimal
          ? 'Create New Listing'
          : 'List for Sale'}
      </Button>
    )
  } else
    return (
      <ListModal
        trigger={trigger}
        collectionId={contract}
        tokenId={tokenId}
        currencies={listingCurrencies}
        onListingComplete={() => {
          if (mutate) {
            mutate()
          }
        }}
        onListingError={(err: any) => {
          if (err?.code === 4001) {
            addToast?.(
              <Toast
                title="User canceled transaction"
                description="You have canceled the transaction."
              />
            )
            return
          }
          addToast?.(
            <Toast
              title="Could not list token"
              description="The transaction was not completed."
            />
          )
        }}
      />
    )
}

export default List
