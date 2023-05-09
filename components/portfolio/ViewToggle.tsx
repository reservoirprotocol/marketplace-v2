import { faList, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, ToggleGroup, ToggleGroupItem } from 'components/primitives'
import { Dispatch, FC, SetStateAction } from 'react'

type Props = {
  itemView: ItemView
  setItemView: Dispatch<SetStateAction<ItemView>>
}

export type ItemView = 'list' | 'grid'

export const ViewToggle: FC<Props> = ({ itemView, setItemView }) => {
  return (
    <ToggleGroup
      type="single"
      value={itemView}
      onValueChange={(value) => setItemView(value as ItemView)}
      css={{ flexShrink: 0 }}
    >
      <ToggleGroupItem value="list" css={{ width: 48, height: 48 }}>
        <Box css={{ color: '$gray12' }}>
          <FontAwesomeIcon icon={faList} width={16} height={16} />
        </Box>
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" css={{ width: 48, height: 48 }}>
        <Box css={{ color: '$gray12' }}>
          <FontAwesomeIcon icon={faTableCellsLarge} width={16} height={16} />
        </Box>
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
