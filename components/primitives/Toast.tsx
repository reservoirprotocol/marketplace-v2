import {
  ComponentPropsWithoutRef,
  ElementRef,
  FC,
  forwardRef,
  ReactNode,
} from 'react'
import { styled } from '@stitches/react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { motion } from 'framer-motion'

const ToastViewport = styled(ToastPrimitive.Viewport, {
  padding: '25px',
  position: 'fixed',
  bottom: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '327px',
  maxWidth: '100vw',
})

const ToastRoot = styled(ToastPrimitive.Root, {
  backgroundColor: '$gray3',
  borderRadius: 6,
  padding: 12,
  display: 'grid',
  gridTemplateAreas: `'title action' 'description action'`,
  columnGap: '15px',
  alignItems: 'center',
})

// Struggling to get framer motion to work here
// const AnimatedToastRoot = forwardRef<
//   ElementRef<typeof ToastPrimitive.Root>,
//   ComponentPropsWithoutRef<typeof ToastPrimitive.Root>
// >(({ children, ...props }, forwardedRef) => (
//   <ToastRoot {...props} forceMount asChild>
//     <motion.div
//       //@ts-ignore
//       ref={forwardedRef}
//       transition={{ duration: 0.5 }}
//       initial={{
//         opacity: 0,
//       }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//     >
//       {children}
//     </motion.div>
//   </ToastRoot>
// ))

const ToastTitle = styled(ToastPrimitive.Title, {
  gridArea: 'title',
  fontSize: '14px',
  fontWeight: 500,
  marginBottom: '2px',
})

const ToastDescription = styled(ToastPrimitive.Description, {
  gridArea: 'description',
  fontSize: '12px',
  fontWeight: 400,
  color: '$gray11',
})

const ToastAction = styled(ToastPrimitive.Action, {
  gridArea: 'action',
})

type Props = {
  title?: string
  description?: string
  action?: ReactNode
}

const Toast: FC<Props> = ({ title, description, action }) => {
  return (
    <>
      <ToastRoot defaultOpen={true} duration={5000}>
        <ToastTitle>{title}</ToastTitle>
        <ToastDescription>{description}</ToastDescription>
        <ToastAction asChild altText="">
          {action}
        </ToastAction>
      </ToastRoot>
      <ToastViewport />
    </>
  )
}

export default Toast
