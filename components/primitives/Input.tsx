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
  borderRadius: '$lg',
  fontFamily: '$body',
  fontSize: 16,
  color: '$gray12',
  backgroundColor: '$gray3',
  $$focusColor: '$colors$primary8',
  '&::placeholder': { color: '$gray10' },
  '&:focus': { boxShadow: '0 0 0 2px $$focusColor' },
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

export { StyledInput };

export default Input
