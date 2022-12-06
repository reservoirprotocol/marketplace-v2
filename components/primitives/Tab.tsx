import * as TabsPrimitive from '@radix-ui/react-tabs'
import { FC } from 'react'
import { styled } from 'stitches.config'

const TabsList = styled(TabsPrimitive.List, {
  display: 'flex',
  gap: '$5',
  borderBottom: '1px solid $gray5',
  mt: '$5',
  mb: '$4',
})

const TabsTrigger = styled(TabsPrimitive.Trigger, {
  fontWeight: '700',
  pb: '$3',
  '&[data-state="active"]': {
    // boxShadow:
    //   '0px -1px 0px 0px var(--colors-violet9), 0px 1px 0px 0px var(--colors-violet9)',
    boxShadow:
      'inset 0 -1px 0 0 var(--colors-violet9), 0 1px 0 0 var(--colors-violet9)',
  },
})

const TabsContent = styled(TabsPrimitive.Content, {})

// TODO
// type Props = {
//   defaultValue?: string
//   triggers?: Array<typeof TabsPrimitive.Trigger>
// }

// const Tabs: FC<Props> = ({ defaultValue }) => {
//   return (
//     <TabsPrimitive.Root defaultValue={defaultValue}>
//       <TabsList>
//         <TabsTrigger value="tab1">Items</TabsTrigger>
//         <TabsTrigger value="tab2">Activity</TabsTrigger>
//       </TabsList>
//       <TabsContent value="tab1">Items Content</TabsContent>
//       <TabsContent value="tab2">Activity Content</TabsContent>
//     </TabsPrimitive.Root>
//   )
// }
// export default Tabs

export { TabsList, TabsTrigger, TabsContent }
