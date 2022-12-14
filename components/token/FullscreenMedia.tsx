import { faCompress, faExpand } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Flex } from 'components/primitives'
import { FC } from 'react'
import { Content, AnimatedOverlay, Overlay } from 'components/primitives/Dialog'
import {
  Root as DialogRoot,
  DialogOverlay,
  DialogContent,
  DialogTrigger,
  DialogPortal,
  DialogClose,
} from '@radix-ui/react-dialog'

import { TokenMedia, useTokens } from '@reservoir0x/reservoir-kit-ui'
import { useMediaQuery } from 'react-responsive'
import { filter } from 'lodash'

type Props = {
  token: ReturnType<typeof useTokens>['data'][0]
}

const FullscreenMedia: FC<Props> = ({ token }) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })

  const trigger = (
    <Button
      color="gray3"
      corners="circle"
      css={{ position: 'absolute', right: 12, top: 12 }}
    >
      <FontAwesomeIcon icon={faExpand} width={16} height={16} />
    </Button>
  )
  return (
    <DialogRoot modal={true}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogPortal>
        <Overlay
          style={{
            position: 'fixed',
            zIndex: 1000,
            inset: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: '20px',
          }}
        />
        <Content css={{ zIndex: 1000 }}>
          <Flex
            align="center"
            css={{
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Flex align="center" justify="end">
              <DialogClose>
                <Button
                  color="gray3"
                  corners="circle"
                  css={{ position: 'absolute', right: 12, top: 12 }}
                >
                  <FontAwesomeIcon icon={faCompress} width={16} height={16} />
                </Button>
              </DialogClose>
            </Flex>
            <Flex
              justify="center"
              direction="column"
              align="center"
              css={{ height: '100%' }}
            >
              <TokenMedia
                token={token?.token}
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  minWidth: 'min-content',
                  height: 'min-content',
                  minHeight: 445,
                  borderRadius: 0,
                }}
              />
            </Flex>
          </Flex>
        </Content>
      </DialogPortal>
    </DialogRoot>
  )
}

export default FullscreenMedia
