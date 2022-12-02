import { styled } from '@stitches/react'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactNode,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const CollapsibleContent = styled(CollapsiblePrimitive.CollapsibleContent, {
  pa: '$4',
  background: '$gray3',
  border: '1px solid $gray5',
  borderRadius: 8,
})

const AnimatedCollapsibleContent = forwardRef<
  ElementRef<typeof CollapsibleContent>,
  ComponentPropsWithoutRef<typeof CollapsibleContent>
>(({ children, ...props }, forwardedRef) => (
  <CollapsibleContent asChild forceMount {...props}>
    <motion.div ref={forwardedRef}>{children}</motion.div>
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

export { Collapsible, CollapsibleContent }
