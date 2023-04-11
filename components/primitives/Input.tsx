import { styled } from 'stitches.config'
import Flex from 'components/primitives/Flex'
import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactNode,
} from 'react'
import { CSS } from '@stitches/react'

const StyledInput = styled('input', {
  all: 'unset',
  width: '100%',
  px: 16,
  py: 12,
  borderRadius: 8,
  fontFamily: '$body',
  fontSize: 16,
  color: '$gray12',
  backgroundColor: '$gray3',
  $$focusColor: '$colors$primary8',
  '&::placeholder': { color: '$gray10' },
  '&:focus': { boxShadow: 'inset 0 0 0 2px $$focusColor' },
  '&:disabled': {
    backgroundColor: '$gray2',
    color: '$gray9',
  },

  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0,
  },

  '&[type=number]': {
    '-moz-appearance': 'textfield',
  },
})

const Input = forwardRef<
  ElementRef<typeof StyledInput>,
  ComponentPropsWithoutRef<typeof StyledInput> & {
    icon?: ReactNode
    containerCss?: CSS
  }
>(({ children, icon, containerCss, ...props }, forwardedRef) => (
  <Flex css={{ ...containerCss, position: 'relative' }}>
    {icon && (
      <div style={{ position: 'absolute', top: 16, left: 16 }}>{icon}</div>
    )}
    <StyledInput css={{ pl: icon ? 48 : 16 }} ref={forwardedRef} {...props} />
  </Flex>
))

export default Input
