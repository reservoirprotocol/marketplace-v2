import { styled, keyframes } from '@stitches/react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { FC } from 'react'

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
})

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.80)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
})

const StyledOverlay = styled(DialogPrimitive.Overlay, {
  backgroundColor: '$blackA9',
  position: 'fixed',
  inset: 0,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${overlayShow} 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
})

const StyledContent = styled(DialogPrimitive.Content, {
  backgroundColor: '$gray3',
  borderRadius: 8,
  $$shadowColor: '$colors$blackA12',
  boxShadow: 'box-shadow: 0px 2px 16px $$shadowColor',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '450px',
  maxHeight: '85vh',
  padding: 25,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${contentShow} 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
  '&:focus': { outline: 'none' },
})

type Props = {
  trigger: JSX.Element
  contentProps?: DialogPrimitive.DialogContentProps
  portalProps?: DialogPrimitive.PortalProps
}

const StyledDialog: FC<Props> = ({
  trigger,
  children,
  contentProps,
  portalProps,
}) => (
  <DialogPrimitive.Dialog>
    <DialogPrimitive.DialogTrigger asChild>
      {trigger}
    </DialogPrimitive.DialogTrigger>
    <DialogPrimitive.DialogPortal {...portalProps}>
      <StyledOverlay />
      <StyledContent {...contentProps}>{children}</StyledContent>
    </DialogPrimitive.DialogPortal>
  </DialogPrimitive.Dialog>
)

export default StyledDialog
