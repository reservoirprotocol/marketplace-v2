import {
  useCollections,
  useTrendingCollections,
} from '@reservoir0x/reservoir-kit-ui'
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
  Exclude<
    Parameters<typeof useTrendingCollections>[0],
    false | undefined
  >['period']
>

const sortingOptions: CollectionsSortingOption[] = [
  '30d',
  '7d',
  '24h',
  '6h',
  '1h',
  '30m',
  '10m',
  '5m',
]

const nameForSortingOption = (
  option: CollectionsSortingOption,
  compact: boolean
) => {
  switch (option) {
    case '30d':
      return compact ? '30d' : '30 days'
    case '7d':
      return compact ? '7d' : '7 days'
    case '24h':
      return compact ? '24h' : '24 hours'
    case '6h':
      return compact ? '6h' : '6 hours'
    case '1h':
      return compact ? '1h' : '1 hour'
    case '30m':
      return compact ? '30m' : '30 minutes'
    case '10m':
      return compact ? '10m' : '10 minutes'
    case '5m':
      return compact ? '5m' : '5 minutes'
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
