import { FC, ReactNode } from 'react'
import { Content, Overlay } from 'components/primitives/Dialog'
import {
  Root as DialogRoot,
  DialogTrigger,
  DialogPortal,
} from '@radix-ui/react-dialog'

type Props = {
  trigger: ReactNode
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const FullscreenModal: FC<Props> = ({
  trigger,
  children,
  open,
  onOpenChange,
}) => {
  return (
    <DialogRoot modal={true} open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogPortal>
        <Content
          onInteractOutside={(e) => {
            e.preventDefault()
          }}
          css={{
            width: '100%',
            height: '100%',
            borderRadius: '0px',
            border: '0px',
            minWidth: '100%',
            maxWidth: '100vw',
            maxHeight: '100vh',
            top: 0,
          }}
        >
          {children}
        </Content>
      </DialogPortal>
    </DialogRoot>
  )
}
