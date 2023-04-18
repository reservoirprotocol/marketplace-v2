import { styled } from '../../stitches.config'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import React, {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactNode,
  useState,
  useEffect,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMediaQuery } from 'usehooks-ts'
import { ModalSize } from 'components/@reservoir0x/reservoir-kit-ui/Modal/Modal'

const Overlay = styled(DialogPrimitive.Overlay, {
  backgroundColor: '$overlayBackground',
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
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
  backgroundColor: '$contentBackground',
  borderRadius: '$borderRadius',
  $$shadowColor: '$colors$gray7',
  boxShadow: 'box-shadow: 0px 2px 16px $$shadowColor',
  border: '1px solid $borderColor',
  position: 'fixed',
  left: '50%',
  maxWidth: 516,
  top: '100%',
  width: '100%',
  zIndex: 1000,
  '&:focus': { outline: 'none' },
  '@media(max-width: 520px)': {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    border: 0,
  },
})

const AnimatedContent = forwardRef<
  ElementRef<typeof DialogPrimitive.DialogContent>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.DialogContent>
>(({ children, ...props }, forwardedRef) => {
  const isMobile = useMediaQuery('(max-width: 520px)')

  const animation = isMobile
    ? {
        initial: {
          opacity: 0,
          bottom: '-100%',
          top: 'auto',
          left: 0,
        },
        animate: {
          opacity: 1,
          bottom: 0,
          top: 'auto',
          left: 0,
        },

        exit: {
          opacity: 0,
          bottom: '-100%',
          top: 'auto',
          left: 0,
        },
      }
    : {
        initial: {
          opacity: 0,
          top: '14%',
          transform: 'translateX(-50%)',
        },
        animate: {
          opacity: 1,
          top: '9%',
          transform: 'translateX(-50%)',
        },

        exit: {
          opacity: 0,
          top: '14%',
          transform: 'translateX(-50%)',
        },
      }

  return (
    <Content forceMount asChild {...props}>
      <motion.div
        key={isMobile + 'modal'}
        ref={forwardedRef}
        transition={{ type: isMobile ? 'tween' : 'spring', duration: 0.5 }}
        {...animation}
      >
        {children}
      </motion.div>
    </Content>
  )
})

const StyledAnimatedContent = styled(AnimatedContent, {})

type Props = {
  trigger: ReactNode
  portalProps?: DialogPrimitive.PortalProps
  onOpenChange?: (open: boolean) => void
  open?: boolean
  size?: ModalSize
}

const DialogListing = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & Props
>(
  (
    { children, trigger, portalProps, onOpenChange, open, size, ...props },
    forwardedRef
  ) => {
    const [dialogOpen, setDialogOpen] = useState(false)

    useEffect(() => {
      if (open !== undefined && open !== dialogOpen) {
        setDialogOpen(open)
        if (onOpenChange) {
          onOpenChange(open)
        }
      }
    }, [open])

    return (
      <DialogPrimitive.Root
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (onOpenChange) {
            onOpenChange(open)
          }
        }}
        open={dialogOpen}
      >
        <DialogPrimitive.DialogTrigger asChild>
          {trigger}
        </DialogPrimitive.DialogTrigger>
        <AnimatePresence>
          {dialogOpen && (
            <DialogPrimitive.DialogPortal forceMount {...portalProps}>
              <AnimatedOverlay />
              <StyledAnimatedContent
                ref={forwardedRef}
                {...props}
                forceMount
                css={{
                  maxWidth: size === ModalSize.MD ? 516 : 750,
                }}
              >
                {children}
              </StyledAnimatedContent>
            </DialogPrimitive.DialogPortal>
          )}
        </AnimatePresence>
      </DialogPrimitive.Root>
    )
  }
)

export { DialogListing, Content, AnimatedContent, Overlay, AnimatedOverlay }
