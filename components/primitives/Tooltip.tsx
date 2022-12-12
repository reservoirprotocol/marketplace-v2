// your-tooltip.jsx
import React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import Box from './Box'
import { styled } from 'stitches.config'

const Arrow = styled(TooltipPrimitive.Arrow, {
  fill: '$gray5',
})

const Tooltip = ({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: any) => {
  return (
    <TooltipPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      delayDuration={250}
    >
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        sideOffset={12}
        side="bottom"
        align="center"
        style={{ zIndex: 100 }}
        {...props}
      >
        <Arrow />
        <Box
          css={{
            zIndex: 9999,
            $$shadowColor: '$colors$gray12',
            boxShadow: '0px 1px 5px rgba(0,0,0,0.2)',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <Box
            css={{
              background: '$gray5',
              p: '$4',
            }}
          >
            {content}
          </Box>
        </Box>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  )
}

export default Tooltip
