import {
  ComponentPropsWithoutRef,
  FC,
  ReactNode,
  useEffect,
  useState,
} from 'react'
import { Dialog } from 'components/primitives/Dialog'
import {
  Root as DialogRoot,
  DialogTrigger,
  DialogPortal,
} from '@radix-ui/react-dialog'
import { Box, Button, Flex, Text } from 'components/primitives'

type Props = {
  title: string
  message?: string
  confirmationText?: string
  open: ComponentPropsWithoutRef<typeof DialogRoot>['open']
  onOpenChange: ComponentPropsWithoutRef<typeof DialogRoot>['onOpenChange']
  onConfirmed?: (confirmed: boolean) => void
}

export const ConfirmationModal: FC<Props> = ({
  title,
  message,
  confirmationText = 'Continue',
  open,
  onOpenChange,
  onConfirmed = () => {},
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      overlayProps={{ style: { opacity: 0.7 } }}
    >
      <Flex direction="column" css={{ p: 24, gap: '$2', background: '$gray2' }}>
        <Text style="subtitle1">{title}</Text>
        <Text style="body1" color="subtle">
          {message}
        </Text>
        <Flex css={{ gap: '$2', mt: '$4' }} justify="end">
          <Button
            color="gray3"
            size="medium"
            onClick={() => {
              onConfirmed(true)
              onOpenChange?.(false)
            }}
          >
            <Text style="subtitle2" color="error">
              {confirmationText}
            </Text>
          </Button>
          <Button
            size="medium"
            onClick={() => {
              onConfirmed(false)
              onOpenChange?.(false)
            }}
          >
            <Text style="subtitle2" css={{ color: 'inherit' }}>
              Cancel
            </Text>
          </Button>
        </Flex>
      </Flex>
    </Dialog>
  )
}
