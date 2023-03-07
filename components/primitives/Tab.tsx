import * as TabsPrimitive from '@radix-ui/react-tabs'
import { styled } from 'stitches.config'

const TabsList = styled(TabsPrimitive.List, {
  display: 'flex',
  gap: '$5',
  borderBottom: '1px solid $gray5',
  mt: '$5',
  mb: '$4',
})

const TabsTrigger = styled(TabsPrimitive.Trigger, {
  fontWeight: '$bold',
  pb: '$3',
  '&[data-state="active"]': {
    boxShadow:
      'inset 0 -1px 0 0 var(--colors-violet9), 0 1px 0 0 var(--colors-violet9)',
    borderBottom: '1px solid $primary9',
  },
})

const TabsContent = styled(TabsPrimitive.Content, {})

export { TabsList, TabsTrigger, TabsContent }
