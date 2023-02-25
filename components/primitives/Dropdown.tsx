import { styled } from 'stitches.config'
import React, {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactNode,
  useState,
} from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { AnimatePresence, motion } from 'framer-motion'

const DropdownMenuContent = styled(DropdownMenuPrimitive.DropdownMenuContent, {
  mx: '$4',
  p: '$2',
  borderRadius: '$lg',
  zIndex: 5,
  background: '$panelBg',
  $$borderColor: '$colors$gray7',
  boxShadow: '0 0 0 1px $$borderColor',
})

const AnimatedDropdownMenuContent = forwardRef<
  ElementRef<typeof DropdownMenuContent>,
  ComponentPropsWithoutRef<typeof DropdownMenuContent>
>(({ children, ...props }, forwardedRef) => (
  <DropdownMenuContent asChild forceMount {...props}>
    <motion.div
      ref={forwardedRef}
      initial={{ scale: 0.9, opacity: 0, y: -20 }}
      animate={{
        scale: 1,
        opacity: 1,
        y: 0,
        transition: { mass: 0.05, type: 'spring', duration: 0.1 },
      }}
      exit={{
        y: -20,
        scale: 0.9,
        opacity: 0,
        transition: { duration: 0.1 },
      }}
    >
      {children}
    </motion.div>
  </DropdownMenuContent>
))

const DropdownMenuItem = styled(DropdownMenuPrimitive.DropdownMenuItem, {
  fontSize: 16,
  fontFamily: '$body',
  color: '$gray12',
  px: '$2',
  py: '$4',
  borderRadius: '$lg',
  outline: 'none',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '$gray5',
  },
  '&:focus': {
    backgroundColor: '$gray5',
  },
})

type Props = {
  trigger: ReactNode
  contentProps?: DropdownMenuPrimitive.DropdownMenuContentProps
}

const Dropdown = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Root>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root> & Props
>(({ children, trigger, contentProps, ...props }, forwardedRef) => {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenuPrimitive.Root {...props} open={open} onOpenChange={setOpen}>
      <DropdownMenuPrimitive.Trigger asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>
      <AnimatePresence>
        {open && (
          <AnimatedDropdownMenuContent ref={forwardedRef} {...contentProps}>
            {children}
          </AnimatedDropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenuPrimitive.Root>
  )
})

export { Dropdown, DropdownMenuContent, DropdownMenuItem }
