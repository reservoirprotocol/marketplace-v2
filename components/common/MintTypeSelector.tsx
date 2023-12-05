import { ToggleGroupItem, ToggleGroupRoot } from 'components/primitives'
import { FC } from 'react'

export const MintTypeOptions = ['any', 'free', 'paid'] as const
export type MintTypeOption = (typeof MintTypeOptions)[number]

type Props = {
  option: MintTypeOption
  onOptionSelected: (option: MintTypeOption) => void
}

const MintTypeSelector: FC<Props> = ({ onOptionSelected, option }) => {
  return (
    <ToggleGroupRoot
      type="single"
      defaultChecked
      defaultValue="any"
      css={{
        width: '100%',
      }}
      value={option}
      onValueChange={(selectedOption) =>
        selectedOption && onOptionSelected(selectedOption as MintTypeOption)
      }
    >
      {MintTypeOptions.map((option) => (
        <ToggleGroupItem
          key={option}
          value={option}
          css={{
            flexGrow: 1,
            height: '44px',
            textTransform: 'capitalize',
            px: '$4',
            py: '$2',
            background: '$gray3',
            '&:first-of-type': {
              borderRadius: '8px 0 0 8px',
            },
            '&:last-of-type': {
              borderRadius: '0 8px 8px 0',
            },
          }}
        >
          {option}
        </ToggleGroupItem>
      ))}
    </ToggleGroupRoot>
  )
}

export default MintTypeSelector
