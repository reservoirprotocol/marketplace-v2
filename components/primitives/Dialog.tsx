import { styled, keyframes } from '@stitches/react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactNode,
} from 'react'

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
})

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.80)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
})

const Overlay = styled(DialogPrimitive.Overlay, {
  backgroundColor: '$blackA9',
  position: 'fixed',
  inset: 0,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${overlayShow} 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
})

const Content = styled(DialogPrimitive.Content, {
  backgroundColor: '$gray3',
  borderRadius: 8,
  $$shadowColor: '$colors$blackA12',
  boxShadow: 'box-shadow: 0px 2px 16px $$shadowColor',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 500,
  maxWidth: '90vw',
  maxHeight: '85vh',
  padding: 25,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${contentShow} 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
  '&:focus': { outline: 'none' },
})

type Props = {
  trigger: ReactNode
  portalProps?: DialogPrimitive.PortalProps
}

const Dialog = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & Props
>(({ children, trigger, portalProps, ...props }, forwardedRef) => (
  <DialogPrimitive.Root>
    <DialogPrimitive.DialogTrigger asChild>
      {trigger}
    </DialogPrimitive.DialogTrigger>
    <DialogPrimitive.DialogPortal {...portalProps}>
      <Overlay />
      <Content ref={forwardedRef} {...props}>
        {children}
      </Content>
    </DialogPrimitive.DialogPortal>
  </DialogPrimitive.Root>
))

export { Dialog, Content, Overlay }
