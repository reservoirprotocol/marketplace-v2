import { FC, ReactNode } from 'react'
import { Content } from 'components/primitives/Dialog'
import {
  Root as DialogRoot,
  DialogTrigger,
  DialogPortal,
} from '@radix-ui/react-dialog'

type Props = {
  trigger: ReactNode
}

export const FullscreenModal: FC<Props> = ({ trigger, children }) => {
  return (
    <DialogRoot modal={false}>
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
            top: '0%',
            zIndex: 9999,
          }}
        >
          {children}
        </Content>
      </DialogPortal>
    </DialogRoot>
  )
}
