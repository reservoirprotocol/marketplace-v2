import { FC, ReactNode, useContext } from 'react'
import { keyframes, styled } from '@stitches/react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { ToastContext } from 'context/ToastContextProvider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Box from './Box'
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import Flex from './Flex'

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
  borderRadius: 6,
  padding: 12,
  display: 'flex',
  gap: 8,
  alignItems: 'start',

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
  fontWeight: 500,
})

const ToastDescription = styled(ToastPrimitive.Description, {
  gridArea: 'description',
  fontSize: '12px',
  fontWeight: 400,
  color: '$gray11',
})

const ToastAction = styled(ToastPrimitive.Action, {})

type Props = {
  id?: string
  title?: string
  description?: string
  action?: ReactNode
  status?: 'success' | 'error'
}

const Toast: FC<Props> = ({ id, title, description, action, status }) => {
  const { toasts, setToasts } = useContext(ToastContext)

  return (
    <>
      <ToastRoot
        key={title}
        onOpenChange={(open) => {
          if (!open) {
            setTimeout(
              () => setToasts?.(toasts.filter((toast) => toast.id != id)),
              100
            )
          }
        }}
      >
        {status !== undefined ? (
          <Box css={{ color: status === 'error' ? '$red10' : '$green10' }}>
            <FontAwesomeIcon
              icon={status === 'error' ? faCircleXmark : faCircleCheck}
              width={16}
            />
          </Box>
        ) : null}
        <Flex direction="column">
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{description}</ToastDescription>
          <ToastAction asChild altText="Toast action">
            {action}
          </ToastAction>
        </Flex>
      </ToastRoot>
    </>
  )
}

export default Toast
