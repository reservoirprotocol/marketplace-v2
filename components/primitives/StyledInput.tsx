import { styled } from '@stitches/react'
import { Flex } from 'components/primitives/Flex'
import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactNode,
} from 'react'

const StyledInput = styled('input', {
  all: 'unset',
  width: '100%',
  px: 16,
  py: 12,
  borderRadius: 8,
  fontFamily: '$bodyFont',
  fontSize: 16,
  color: '$gray12',
  backgroundColor: '$gray3',
  $$focusColor: '$colors$primary8',
  '&:placeholder': { color: '$gray11' },
  '&:focus': { boxShadow: '0 0 0 2px $$focusColor' },
})

const Input = forwardRef<
  ElementRef<typeof StyledInput>,
  ComponentPropsWithoutRef<typeof StyledInput> & {
    icon?: ReactNode
    width?: number
  }
>(({ children, icon, width = 200, ...props }, forwardedRef) => (
  <Flex css={{ w: width, position: 'relative' }}>
    {icon && (
      <div style={{ position: 'absolute', top: 16, left: 16 }}>{icon}</div>
    )}
    <StyledInput css={{ pl: 48 }} ref={forwardedRef} {...props} />
  </Flex>
))

export default Input
