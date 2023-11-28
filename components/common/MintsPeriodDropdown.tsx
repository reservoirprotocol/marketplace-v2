import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useTrendingMints } from '@reservoir0x/reservoir-kit-ui'
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from 'components/primitives/Dropdown'
import { FC } from 'react'
import { Box, Button, Text } from '../primitives'

export type MintsSortingOption = NonNullable<
  Exclude<Parameters<typeof useTrendingMints>[0], false | undefined>['period']
>

const sortingOptions: MintsSortingOption[] = [
  '24h',
  '6h',
  '1h',
  '30m',
  '10m',
  '5m',
]

const nameForSortingOption = (option: MintsSortingOption, compact: boolean) => {
  switch (option) {
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
  option: MintsSortingOption
  onOptionSelected: (option: MintsSortingOption) => void
}

const MintsPeriodDropdown: FC<Props> = ({
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
            onClick={() => onOptionSelected(optionItem as MintsSortingOption)}
          >
            {nameForSortingOption(optionItem, false)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu.Root>
  )
}

export default MintsPeriodDropdown
