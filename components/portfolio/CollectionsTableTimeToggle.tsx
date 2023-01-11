import { ToggleGroup, ToggleGroupItem, Text } from '../primitives'
import { FC } from 'react'

export type CollectionsTableSortingOption = typeof sortingOptions[number]

const sortingOptions = ['allTime', '1day', '7day', '30day'] as const

const nameForSortingOption = (
  option: CollectionsTableSortingOption,
  compact: boolean
) => {
  switch (option) {
    case 'allTime':
      return compact ? 'All' : 'All Time'
    case '1day':
      return compact ? '24h' : '24 hours'
    case '7day':
      return compact ? '7d' : '7 days'
    case '30day':
      return compact ? '30d' : '30 days'
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
