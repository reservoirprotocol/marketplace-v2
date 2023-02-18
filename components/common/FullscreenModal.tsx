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
}

export const FullscreenModal: FC<Props> = ({ trigger, children }) => {
  return (
    <DialogRoot modal={true}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogPortal>
        <Overlay
          css={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
        >
          <Content
            onInteractOutside={(e) => {
              e.preventDefault()
            }}
            css={{
              width: '100%',
              height: '100%',
              borderRadius: '$base',
              border: '0px',
              minWidth: '100%',
              maxWidth: '100vw',
              maxHeight: '100vh',
              top: 0,
            }}
          >
            {children}
          </Content>
        </Overlay>
      </DialogPortal>
    </DialogRoot>
  )
}
