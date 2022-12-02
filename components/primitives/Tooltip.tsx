// your-tooltip.jsx
import React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import Box from './Box'

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
        <Box
          css={{
            zIndex: 9999,
            boxShadow:
              '0px 4px 12px rgba(0, 0, 0, 0.1), 0px 0px 0px 1px $colors$primary4 ',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <Box
            css={{
              background: '$gray1',
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
