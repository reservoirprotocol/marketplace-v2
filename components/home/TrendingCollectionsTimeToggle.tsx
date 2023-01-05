import { useCollections } from '@reservoir0x/reservoir-kit-ui'
import { ToggleGroup, ToggleGroupItem, Text } from '../primitives'
import { FC } from 'react'

export type CollectionsSortingOption = NonNullable<
  Exclude<Parameters<typeof useCollections>[0], false | undefined>['sortBy']
>

const sortingOptions: CollectionsSortingOption[] = [
  'allTimeVolume',
  '1DayVolume',
  '7DayVolume',
  '30DayVolume',
]

const nameForSortingOption = (
  option: CollectionsSortingOption,
  compact: boolean
) => {
  switch (option) {
    case 'allTimeVolume':
      return compact ? 'All' : 'All Time'
    case '1DayVolume':
      return compact ? '24h' : '24 hours'
    case '7DayVolume':
      return compact ? '7d' : '7 days'
    case '30DayVolume':
      return compact ? '30d' : '30 days'
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
    >
      {sortingOptions.map((option) => (
        <ToggleGroupItem key={option} value={option}>
          <Text style="subtitle1">{nameForSortingOption(option, compact)}</Text>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export default TrendingCollectionsTimeToggle
