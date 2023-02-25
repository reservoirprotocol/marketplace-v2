import { FC, ReactNode, useContext } from 'react'
import { keyframes, styled } from '@stitches/react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { ToastContext } from 'context/ToastContextProvider'

const VIEWPORT_PADDING = 25

export const ToastViewport = styled(ToastPrimitive.Viewport, {
  padding: VIEWPORT_PADDING,
  position: 'fixed',
  bottom: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '327px',
  maxWidth: '100vw',
  zIndex: 9999999999,
})

const hide = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
})

const swipeOut = keyframes({
  from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
  to: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
})

const ToastRoot = styled(ToastPrimitive.Root, {
  backgroundColor: '$gray3',
  borderRadius: '$md',
  padding: 12,
  display: 'grid',
  gridTemplateAreas: "'title action' 'description action'",
  gridTemplateColumns: 'auto max-content',
  columnGap: '15px',
  alignItems: 'center',

  '&[data-state="closed"]:first-child': {
    animation: `${hide} 100ms ease-in`,
  },
  '&[data-swipe="move"]': {
    transform: 'translateX(var(--radix-toast-swipe-move-x))',
  },
  '&[data-swipe="cancel"]': {
    transform: 'translateX(0)',
    transition: 'transform 200ms ease-out',
  },
  '&[data-swipe="end"]': {
    animation: `${swipeOut} 100ms ease-out`,
  },
})

const ToastTitle = styled(ToastPrimitive.Title, {
  gridArea: 'title',
  fontSize: '14px',
  fontWeight: '$medium',
  marginBottom: '2px',
})

const ToastDescription = styled(ToastPrimitive.Description, {
  gridArea: 'description',
  fontSize: '12px',
  fontWeight: '$regular',
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
  const { toasts, setToasts } = useContext(ToastContext)
  return (
    <>
      <ToastRoot
        key={title}
        onOpenChange={(open) => {
          if (!open) {
            setTimeout(
              () => setToasts?.(toasts.filter((toast) => toast.title != title)),
              100
            )
          }
        }}
      >
        <ToastTitle>{title}</ToastTitle>
        <ToastDescription>{description}</ToastDescription>
        <ToastAction asChild altText="Toast action">
          {action}
        </ToastAction>
      </ToastRoot>
    </>
  )
}

export default Toast
