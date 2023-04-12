import { keyframes, styled } from '@stitches/react'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactNode,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export const slideDown = keyframes({
  from: { height: 0 },
  to: { height: 'var(--radix-collapsible-content-height)' },
})

export const slideUp = keyframes({
  from: { height: 'var(--radix-collapsible-content-height)' },
  to: { height: 0 },
})

const CollapsibleContent = styled(CollapsiblePrimitive.CollapsibleContent, {
  background: 'transparent',
  border: 'none',
  borderRadius: 0,
})

const CollapsibleRoot = styled(CollapsiblePrimitive.Root, {
  borderRadius: 8,
  overflow: 'hidden',
})

const AnimatedCollapsibleContent = forwardRef<
  ElementRef<typeof CollapsibleContent>,
  ComponentPropsWithoutRef<typeof CollapsibleContent>
>(({ children, ...props }, forwardedRef) => (
  <CollapsibleContent asChild forceMount {...props}>
    <motion.div
      ref={forwardedRef}
      initial={{ width: 0 }}
      animate={{
        width: '100%',
        transition: { mass: 1, duration: 0.15 },
      }}
      exit={{
        width: 0,
        transition: { duration: 0.3 },
      }}
    >
      {children}
    </motion.div>
  </CollapsibleContent>
))

type Props = {
  trigger: ReactNode
  contentProps?: CollapsiblePrimitive.CollapsibleContentProps
}

const Collapsible = forwardRef<
  ElementRef<typeof CollapsiblePrimitive.Content>,
  ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content> & Props
>(({ children, trigger, contentProps, ...props }, forwardedRef) => {
  const [open, setOpen] = useState(false)

  return (
    <CollapsiblePrimitive.Root {...props} open={open} onOpenChange={setOpen}>
      <CollapsiblePrimitive.Trigger asChild>
        {trigger}
      </CollapsiblePrimitive.Trigger>
      <AnimatePresence>
        {open && (
          <AnimatedCollapsibleContent ref={forwardedRef} {...contentProps}>
            {children}
          </AnimatedCollapsibleContent>
        )}
      </AnimatePresence>
    </CollapsiblePrimitive.Root>
  )
})

export {
  Collapsible,
  CollapsibleContent,
  AnimatedCollapsibleContent,
  CollapsibleRoot,
}
