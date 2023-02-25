import { ElementRef, forwardRef, ComponentPropsWithoutRef } from 'react'
import { styled } from 'stitches.config'

export const StyledAnchor = styled('a', {
  cursor: 'pointer',
  fontFamily: '$body',
  fontSize: 16,
  transition: '0.2s',
  transitionTimingFunction: 'ease-in-out',
  $$focusColor: '$colors$gray12',
  '&:focus-visible': {
    color: '$gray12',
    outline: 'none',
    borderRadius: '$sm',
    boxShadow: '0 0 0 2px $$focusColor',
  },
  variants: {
    color: {
      primary: {
        color: '$primary13',
        '&:hover': {
          color: '$primary14',
        },
      },
      gray: {
        color: '$gray11',
        '&:hover': {
          color: '$primary11',
        },
      },
    },
    weight: {
      heavy: {
        fontWeight: 700,
      },
      medium: {
        fontWeight: 500,
      },
      normal: {
        fontWeight: 400,
      },
    },
  },
  defaultVariants: {
    color: 'gray',
    weight: 'heavy',
  },
})

export const Anchor = forwardRef<
  ElementRef<typeof StyledAnchor>,
  ComponentPropsWithoutRef<typeof StyledAnchor>
>(({ children, ...props }, forwardedRef) => (
  <StyledAnchor ref={forwardedRef} {...props} tabIndex={0}>
    {children}
  </StyledAnchor>
))
