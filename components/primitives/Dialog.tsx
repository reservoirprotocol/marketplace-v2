import { styled } from '@stitches/react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactNode,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const Overlay = styled(DialogPrimitive.Overlay, {
  backgroundColor: '$neutralBg',
  position: 'fixed',
  inset: 0,
  zIndex: 5000,
})

const AnimatedOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ ...props }, forwardedRef) => (
  <Overlay {...props} forceMount asChild>
    <motion.div
      ref={forwardedRef}
      transition={{ duration: 0.5 }}
      initial={{
        opacity: 0,
      }}
      animate={{ opacity: props['style']?.opacity }}
      exit={{ opacity: 0 }}
    />
  </Overlay>
))

const Content = styled(DialogPrimitive.Content, {
  backgroundColor: '$neutralBg',
  borderRadius: '$lg',
  $$shadowColor: '$colors$gray7',
  boxShadow: '0px 2px 16px $$shadowColor',
  border: '1px solid $gray7',
  position: 'fixed',
  top: '12.5%',
  left: '50%',
  transform: 'translateX(-50%)',
  minWidth: 490,
  maxWidth: '90vw',
  maxHeight: '85vh',
  overflowY: 'auto',
  '&:focus': { outline: 'none' },
  zIndex: 5000,
})

const AnimatedContent = forwardRef<
  ElementRef<typeof DialogPrimitive.DialogContent>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.DialogContent>
>(({ children, ...props }, forwardedRef) => (
  <Content forceMount asChild {...props} css={{minWidth: 400}}>
    <motion.div
      ref={forwardedRef}
      transition={{ type: 'spring', duration: 0.5 }}
      initial={{
        opacity: 0,
        top: '30%',
      }}
      animate={{
        opacity: 1,
        top: '9%',
      }}
      exit={{
        opacity: 0,
        top: '14%',
      }}
    >
      {children}
    </motion.div>
  </Content>
))

type Props = {
  trigger?: ReactNode
  portalProps?: DialogPrimitive.PortalProps
  overlayProps?: DialogPrimitive.DialogOverlayProps
  open?: ComponentPropsWithoutRef<typeof DialogPrimitive.Root>['open']
  onOpenChange: ComponentPropsWithoutRef<
    typeof DialogPrimitive.Root
  >['onOpenChange']
}

const Dialog = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & Props
>(
  (
    {
      children,
      trigger,
      portalProps,
      overlayProps,
      open,
      onOpenChange,
      ...props
    },
    forwardedRef
  ) => {
    const [_open, _onOpenChange] = useState(false)

    return (
      <DialogPrimitive.Root
        onOpenChange={onOpenChange || _onOpenChange}
        open={open || _open}
      >
        {trigger && (
          <DialogPrimitive.DialogTrigger asChild>
            {trigger}
          </DialogPrimitive.DialogTrigger>
        )}
        <AnimatePresence>
          {open && (
            <DialogPrimitive.DialogPortal forceMount {...portalProps}>
              <AnimatedOverlay style={{ opacity: 1 }} {...overlayProps} />
              <AnimatedContent ref={forwardedRef} {...props} forceMount>
                {children}
              </AnimatedContent>
            </DialogPrimitive.DialogPortal>
          )}
        </AnimatePresence>
      </DialogPrimitive.Root>
    )
  }
)

export { Dialog, Content, AnimatedContent, Overlay, AnimatedOverlay }
