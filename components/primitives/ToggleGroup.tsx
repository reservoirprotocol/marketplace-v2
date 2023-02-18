import {
  Root as ToggleGroupRoot,
  Item as ToggleGroupItem,
} from '@radix-ui/react-toggle-group'
import { styled } from 'stitches.config'

const StyledToggleGroupRoot = styled(ToggleGroupRoot, {
  borderRadius: '$lg',
  overflow: 'hidden',
  display: 'flex',
  gap: 1,
})

const StyledToggleGroupItem = styled(ToggleGroupItem, {
  background: '$primary8',
  color: '#000',
  p: '$3',
  '&[data-state=on]': { backgroundColor: '$primary9' },
})

export {
  StyledToggleGroupRoot as ToggleGroup,
  StyledToggleGroupItem as ToggleGroupItem,
  StyledToggleGroupRoot as ToggleGroupRoot,
}
