import { styled } from 'stitches.config'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

const AvatarRoot = styled(AvatarPrimitive.Root, {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  verticalAlign: 'middle',
  overflow: 'hidden',
  userSelect: 'none',
  w: 35,
  h: 35,
  borderRadius: '100%',
  flexShrink: 0,
})

const AvatarImage = styled(AvatarPrimitive.Image, {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 'inherit',
})

const AvatarFallback = styled(AvatarPrimitive.Fallback, {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$gray1',
})

export const Avatar = forwardRef<
  ElementRef<typeof AvatarImage>,
  ComponentPropsWithoutRef<typeof AvatarImage> & {
    fallback?: string
    size?: number
  }
>(({ size, fallback, ...props }, forwardedRef) => (
  <AvatarRoot css={{ w: size, h: size }}>
    <AvatarImage ref={forwardedRef} {...props} />
    <AvatarFallback delayMs={600}>{fallback}</AvatarFallback>
  </AvatarRoot>
))
