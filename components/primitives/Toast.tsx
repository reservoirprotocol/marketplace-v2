import { FC, ReactNode, useState } from 'react'
import { styled } from '@stitches/react'
import * as ToastPrimitive from '@radix-ui/react-toast'

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
  open: boolean
  title?: string
  description?: string
  action?: ReactNode
}

const Toast: FC<Props> = ({ open, title, description, action }) => {
  // const [open, setOpen] = useState(false)
  return (
    <ToastPrimitive.Provider swipeDirection="right">
      <ToastRoot open={open}>
        <ToastTitle>{title}</ToastTitle>
        <ToastDescription>{description}</ToastDescription>
        <ToastAction asChild altText="">
          {action}
        </ToastAction>
      </ToastRoot>
      <ToastViewport />
    </ToastPrimitive.Provider>
  )
}

export default Toast
