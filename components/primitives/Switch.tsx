import { styled } from '@stitches/react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

const StyledSwitch = styled(SwitchPrimitive.Root, {
  all: 'unset',
  width: 46,
  height: 24,
  backgroundColor: '$gray7',
  borderRadius: '9999px',
  position: 'relative',
  transition: 'background-color 250ms linear',
  $$focusColor: '$colors$gray12',
  '&[data-state="checked"]': { backgroundColor: '$primary9' },
  '&:focus-visible': {
    boxShadow: '0 0 0 2px $$focusColor',
  },
})

const Thumb = styled(SwitchPrimitive.Thumb, {
  display: 'block',
  width: 20,
  height: 20,
  backgroundColor: '$whiteA12',
  borderRadius: '9999px',
  transition: 'transform 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  transform: 'translateX(4px)',
  willChange: 'transform',
  $$borderColor: '$colors$gray7',
  boxShadow: '0 0 0 1px $$borderColor',
  '&[data-state="checked"]': { transform: 'translateX(22px)' },
})

const Switch = (props?: SwitchPrimitive.SwitchProps) => (
  <StyledSwitch {...props}>
    <Thumb />
  </StyledSwitch>
)

export default Switch
