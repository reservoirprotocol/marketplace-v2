import { ListModal, useTokens } from '@reservoir0x/reservoir-kit-ui'
import { Button } from 'components/primitives'
import { ComponentProps, ComponentPropsWithoutRef, FC } from 'react'
import { CSS } from '@stitches/react'
import { SWRResponse } from 'swr'

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

  return (
    <>
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
            // TODO: add toast
            return
          }
          // TODO: add toast
        }}
      />
    </>
  )
}

export default List
