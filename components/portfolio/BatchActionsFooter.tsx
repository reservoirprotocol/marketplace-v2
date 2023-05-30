import { Flex, Text, Button } from 'components/primitives'
import { Dispatch, FC, SetStateAction, useMemo } from 'react'
import { UserToken } from 'pages/portfolio/[[...address]]'

type Props = {
  isOwner: boolean
  selectedItems: UserToken[]
  setSelectedItems: Dispatch<SetStateAction<UserToken[]>>
  setShowListingPage: Dispatch<SetStateAction<boolean>>
  setOpenAcceptBidModal: Dispatch<SetStateAction<boolean>>
}

const BatchActionsFooter: FC<Props> = ({
  isOwner,
  selectedItems,
  setSelectedItems,
  setShowListingPage,
  setOpenAcceptBidModal,
}) => {
  if (!isOwner) {
    return null
  }

  const sellableItems = useMemo(
    () => selectedItems.filter((item) => item.token?.topBid?.id !== null),
    [selectedItems]
  )

  const listItemSubject = selectedItems.length === 1 ? 'item' : 'items'
  const sellItemSubject = sellableItems.length === 1 ? 'item' : 'items'

  return (
    <Flex
      align="center"
      justify="between"
      css={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        px: '$5',
        py: '$4',
        borderTop: '1px solid $gray7',
        backgroundColor: '$neutralBg',
        zIndex: 999,
      }}
    >
      <Flex align="center" css={{ gap: 24 }}>
        <Text>
          {selectedItems.length} {listItemSubject}
        </Text>
        <Button
          color={'ghost'}
          css={{ color: '$primary11' }}
          onClick={() => setSelectedItems([])}
        >
          Clear
        </Button>
      </Flex>

      <Flex align="center" css={{ gap: '$4' }}>
        <Button
          onClick={() => setShowListingPage(true)}
          disabled={selectedItems.length < 1}
          color={sellableItems.length > 0 ? 'gray3' : 'primary'}
        >
          {selectedItems.length > 0
            ? `List ${selectedItems.length} ${listItemSubject}`
            : 'List'}
        </Button>
        {sellableItems.length > 0 ? (
          <Button
            onClick={() => setOpenAcceptBidModal(true)}
            disabled={sellableItems.length < 1}
          >
            {sellableItems.length > 0
              ? `Sell ${sellableItems.length} ${sellItemSubject}`
              : 'Sell'}
          </Button>
        ) : null}
      </Flex>
    </Flex>
  )
}

export default BatchActionsFooter
