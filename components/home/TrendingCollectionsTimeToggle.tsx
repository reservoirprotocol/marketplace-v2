import { useCollections } from '@reservoir0x/reservoir-kit-ui'
import { ToggleGroup, ToggleGroupItem, Text } from '../primitives'
import { FC } from 'react'

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

const TrendingCollectionsTimeToggle: FC<Props> = ({
  compact = false,
  option,
  onOptionSelected,
}) => {
  return (
    <ToggleGroup
      type="single"
      value={option}
      onValueChange={(value) => {
        onOptionSelected(value as CollectionsSortingOption)
      }}
      css={{
        width: '100%',
        '@bp800': {
          width: 'auto',
        },
        '> *': {
          width: '100%',
          flex: 1,
          '@bp800': {
            width: 'auto',
            flex: '1 1 auto',
          },
        },
      }}
    >
      {sortingOptions.map((optionItem) => (
        <ToggleGroupItem
          key={optionItem}
          value={optionItem}
          disabled={optionItem === option}
        >
          <Text style="subtitle2">
            {nameForSortingOption(optionItem, compact)}
          </Text>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export default TrendingCollectionsTimeToggle
