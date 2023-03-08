import { useCollections } from '@reservoir0x/reservoir-kit-ui'
import { Text, Button, Box } from '../primitives'
import {
  DropdownMenuItem,
  DropdownMenuContent,
} from 'components/primitives/Dropdown'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { FC } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

export type CollectionsSortingOption = NonNullable<
  Exclude<Parameters<typeof useCollections>[0], false | undefined>['sortBy']
>

const sortingOptions: CollectionsSortingOption[] = [
  '1DayVolume',
  '7DayVolume',
  '30DayVolume',
  'allTimeVolume',
]

const nameForSortingOption = (
  option: CollectionsSortingOption,
  compact: boolean
) => {
  switch (option) {
    case '1DayVolume':
      return compact ? '24h' : '24 hours'
    case '7DayVolume':
      return compact ? '7d' : '7 days'
    case '30DayVolume':
      return compact ? '30d' : '30 days'
    case 'allTimeVolume':
      return compact ? 'All' : 'All Time'
  }
}

type Props = {
  compact?: boolean
  option: CollectionsSortingOption
  onOptionSelected: (option: CollectionsSortingOption) => void
}

const CollectionsTimeDropdown: FC<Props> = ({
  compact = false,
  option,
  onOptionSelected,
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          color="gray3"
          css={{
            px: '14px',
            justifyContent: 'space-between',
            '@md': {
              width: '220px',
              minWidth: 'max-content',
              px: '$4',
            },
          }}
        >
          <Text style="body1">{nameForSortingOption(option, compact)}</Text>
          <Box
            css={{
              color: '$gray10',
              transition: 'transform',
              '[data-state=open] &': { transform: 'rotate(180deg)' },
            }}
          >
            <FontAwesomeIcon icon={faChevronDown} width={16} />
          </Box>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenuContent css={{ width: '220px', mt: '$2', zIndex: 1000 }}>
        {sortingOptions.map((optionItem) => (
          <DropdownMenuItem
            key={optionItem}
            css={{ py: '$3' }}
            onClick={() =>
              onOptionSelected(optionItem as CollectionsSortingOption)
            }
          >
            {nameForSortingOption(optionItem, false)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu.Root>
  )
}

export default CollectionsTimeDropdown
