import { Flex, Text, Button } from 'components/primitives'
import { Dispatch, FC, SetStateAction } from 'react'
import { UserToken } from 'pages/portfolio/[[...address]]'

type Props = {
  isOwner: boolean
  selectedItems: UserToken[]
  setSelectedItems: Dispatch<SetStateAction<UserToken[]>>
  setShowListingPage: Dispatch<SetStateAction<boolean>>
}

const BatchActionsFooter: FC<Props> = ({
  isOwner,
  selectedItems,
  setSelectedItems,
  setShowListingPage,
}) => {
  let selectedItemCount = selectedItems.length

  if (!isOwner) {
    return null
  }

  let itemSubject = selectedItemCount === 1 ? 'item' : 'items'

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
          {selectedItemCount} {itemSubject}
        </Text>
        <Button
          color={'ghost'}
          css={{ color: '$primary11' }}
          onClick={() => setSelectedItems([])}
        >
          Clear
        </Button>
      </Flex>

      <Flex align="center">
        <Button
          onClick={() => setShowListingPage(true)}
          disabled={selectedItemCount < 1}
        >
          {selectedItemCount > 0
            ? `List ${selectedItemCount} ${itemSubject}`
            : 'List'}
        </Button>
      </Flex>
    </Flex>
  )
}

export default BatchActionsFooter
