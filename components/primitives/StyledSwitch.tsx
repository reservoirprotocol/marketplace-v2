import { styled } from '@stitches/react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

const Switch = styled(SwitchPrimitive.Root, {
  all: 'unset',
  width: 46,
  height: 24,
  backgroundColor: '$gray4',
  borderRadius: '9999px',
  position: 'relative',
  transition: 'background-color 250ms linear',
  '&[data-state="checked"]': { backgroundColor: '$primary9' },
})

const Thumb = styled(SwitchPrimitive.Thumb, {
  display: 'block',
  width: 20,
  height: 20,
  backgroundColor: '$gray12',
  borderRadius: '9999px',
  transition: 'transform 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  transform: 'translateX(4px)',
  willChange: 'transform',
  '&[data-state="checked"]': { transform: 'translateX(22px)' },
})

const StyledSwitch = () => (
  <Switch>
    <Thumb />
  </Switch>
)

export default StyledSwitch
