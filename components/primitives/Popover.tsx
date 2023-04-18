import React, { ReactNode } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { styled } from '../../stitches.config'
import Box from './Box'

const Arrow = styled(Popover.Arrow, {
  width: 15,
  height: 7,
  fill: '$popoverBackground',
})

const Content = styled(Popover.Content, {
  filter: 'drop-shadow(0px 2px 16px rgba(0, 0, 0, 0.75))',
  zIndex: 1000,
})

type Props = {
  content?: ReactNode
  side?: any
  width?: any
} & Popover.PopoverProps

const RKPopover = ({
  children,
  content,
  side = 'bottom',
  width = '100%',
  ...props
}: Props) => {
  return (
    <Popover.Root {...props}>
      <Popover.Trigger
        style={{
          backgroundColor: 'transparent',
          borderWidth: 0,
          cursor: 'pointer',
          padding: 0,
        }}
      >
        {children}
      </Popover.Trigger>
      <Content side={side}>
        <Arrow />
        <Box
          css={{
            p: '$3',
            maxWidth: 320,
            overflowY: 'auto',
            maxHeight: 322,
            width: width,
            borderRadius: 8,
            backgroundColor: '$popoverBackground',
          }}
        >
          {content}
        </Box>
      </Content>
    </Popover.Root>
  )
}

RKPopover.Root = Popover.Root
RKPopover.Portal = Popover.Portal
RKPopover.Trigger = Popover.Trigger
RKPopover.Arrow = Arrow
RKPopover.Content = Content

export default RKPopover
