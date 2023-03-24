import { Flex, Text, Button } from 'components/primitives'
import { Dispatch, FC, SetStateAction } from 'react'
import { UserToken } from 'pages/portfolio'

type Props = {
  selectedItems: UserToken[]
  setSelectedItems: Dispatch<SetStateAction<UserToken[]>>
  setShowListingPage: Dispatch<SetStateAction<boolean>>
}

const BatchActionsFooter: FC<Props> = ({
  selectedItems,
  setSelectedItems,
  setShowListingPage,
}) => {
  let selectedItemCount = selectedItems.length

  if (selectedItemCount == 0) {
    return null
  }

  let itemSubject = selectedItemCount > 1 ? 'items' : 'item'

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
      }}
    >
      <Flex align="center" css={{ gap: 24 }}>
        <Text>
          {selectedItemCount} {itemSubject}
        </Text>
        {/* TODO: Select All button */}
        <Button
          color={'ghost'}
          css={{ color: '$primary11' }}
          onClick={() => setSelectedItems([])}
        >
          Clear
        </Button>
      </Flex>

      <Flex align="center">
        <Button onClick={() => setShowListingPage(true)}>
          List {selectedItemCount} {itemSubject}
        </Button>
      </Flex>
    </Flex>
  )
}

export default BatchActionsFooter
