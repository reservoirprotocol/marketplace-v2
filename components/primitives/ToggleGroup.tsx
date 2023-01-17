import {
  Root as ToggleGroupRoot,
  Item as ToggleGroupItem,
} from '@radix-ui/react-toggle-group'
import { styled } from 'stitches.config'

const StyledToggleGroupRoot = styled(ToggleGroupRoot, {
  borderRadius: 8,
  overflow: 'hidden',
  display: 'flex',
  gap: 1,
})

const StyledToggleGroupItem = styled(ToggleGroupItem, {
  background: '$gray3',
  color: '$gray12',
  p: '$3',
  '&[data-state=on]': { backgroundColor: '$primary5' },
})

export {
  StyledToggleGroupRoot as ToggleGroup,
  StyledToggleGroupItem as ToggleGroupItem,
  StyledToggleGroupRoot as ToggleGroupRoot,
}
