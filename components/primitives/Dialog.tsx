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
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  </Overlay>
))

const Content = styled(DialogPrimitive.Content, {
  backgroundColor: '$neutralBg',
  borderRadius: 8,
  $$shadowColor: '$colors$gray7',
  boxShadow: 'box-shadow: 0px 2px 16px $$shadowColor',
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
})

const AnimatedContent = forwardRef<
  ElementRef<typeof DialogPrimitive.DialogContent>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.DialogContent>
>(({ children, ...props }, forwardedRef) => (
  <Content forceMount asChild {...props}>
    <motion.div
      ref={forwardedRef}
      transition={{ type: 'spring', duration: 0.5 }}
      initial={{
        opacity: 0,
        top: '14%',
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
  trigger: ReactNode
  portalProps?: DialogPrimitive.PortalProps
}

const Dialog = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & Props
>(({ children, trigger, portalProps, ...props }, forwardedRef) => {
  const [open, setOpen] = useState(false)

  return (
    <DialogPrimitive.Root onOpenChange={setOpen} open={open}>
      <DialogPrimitive.DialogTrigger asChild>
        {trigger}
      </DialogPrimitive.DialogTrigger>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.DialogPortal forceMount {...portalProps}>
            <AnimatedOverlay />
            <AnimatedContent ref={forwardedRef} {...props} forceMount>
              {children}
            </AnimatedContent>
          </DialogPrimitive.DialogPortal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
})

export { Dialog, Content, AnimatedContent, Overlay, AnimatedOverlay }
