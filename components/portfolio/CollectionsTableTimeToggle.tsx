import { ToggleGroup, ToggleGroupItem, Text } from '../primitives'
import { FC } from 'react'

export type CollectionsTableSortingOption = typeof sortingOptions[number]

const sortingOptions = ['1day', '7day', '30day', 'allTime'] as const

const nameForSortingOption = (
  option: CollectionsTableSortingOption,
  compact: boolean
) => {
  switch (option) {
    case '1day':
      return compact ? '24h' : '24 hours'
    case '7day':
      return compact ? '7d' : '7 days'
    case '30day':
      return compact ? '30d' : '30 days'
    case 'allTime':
      return compact ? 'All' : 'All Time'
  }
}

type Props = {
  compact?: boolean
  option: CollectionsTableSortingOption
  onOptionSelected: (option: CollectionsTableSortingOption) => void
}

const CollectionsTableTimeToggle: FC<Props> = ({
  compact = false,
  option,
  onOptionSelected,
}) => {
  return (
    <ToggleGroup
      type="single"
      value={option}
      onValueChange={(value) => {
        onOptionSelected(value as CollectionsTableSortingOption)
      }}
      css={{ maxWidth: 'max-content' }}
    >
      {sortingOptions.map((optionItem) => (
        <ToggleGroupItem
          key={optionItem}
          value={optionItem}
          disabled={optionItem === option}
          css={{ py: '$3' }}
        >
          <Text style="subtitle1">
            {nameForSortingOption(optionItem, compact)}
          </Text>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export default CollectionsTableTimeToggle
