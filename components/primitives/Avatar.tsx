import { styled } from 'stitches.config'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import {
  ComponentPropsWithoutRef,
  ComponentProps,
  ElementRef,
  forwardRef,
} from 'react'

type AvatarRootProps = ComponentProps<typeof AvatarRoot>

const AvatarRoot = styled(AvatarPrimitive.Root, {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  verticalAlign: 'middle',
  overflow: 'hidden',
  userSelect: 'none',
  flexShrink: 0,
  variants: {
    size: {
      xs: {
        size: 16,
      },
      small: {
        size: 24,
      },
      medium: {
        size: 36,
      },
      large: {
        size: 48,
      },
      xl: {
        size: 56,
      },
      xxl: {
        size: 64,
      },
      xxxl: {
        size: 240,
      }
    },
    corners: {
      rounded: {
        borderRadius: '$sm',
      },
      circle: {
        borderRadius: '100%',
      },
    },
  },
  defaultVariants: {
    size: 'medium',
    corners: 'circle',
  },
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
    size?: AvatarRootProps['size']
    corners?: AvatarRootProps['corners']
  }
>(({ size, corners, fallback, ...props }, forwardedRef) => (
  <AvatarRoot size={size} corners={corners}>
    <AvatarImage ref={forwardedRef} {...props} />
    <AvatarFallback delayMs={600}>{fallback}</AvatarFallback>
  </AvatarRoot>
))
