import { faCompress, faExpand } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Flex } from 'components/primitives'
import { FC } from 'react'
import { Content, Overlay } from 'components/primitives/Dialog'
import {
  Root as DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogClose,
} from '@radix-ui/react-dialog'
import {
  TokenMedia,
  useTokens,
  extractMediaType,
} from '@reservoir0x/reservoir-kit-ui'

type Props = {
  token: ReturnType<typeof useTokens>['data'][0]
}

const FullscreenMedia: FC<Props> = ({ token }) => {
  const mediaType = extractMediaType(token?.token)

  const trigger = (
    <Button
      color="gray3"
      corners="circle"
      css={{
        position: 'absolute',
        right: 12,
        top: 12,
      }}
    >
      <FontAwesomeIcon icon={faExpand} width={16} height={16} />
    </Button>
  )
  if (
    mediaType === 'png' ||
    mediaType === 'jpeg' ||
    mediaType === 'jpg' ||
    mediaType === 'gif' ||
    mediaType === null ||
    mediaType === undefined
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
          >
            <DialogClose>
              <Button
                color="gray3"
                corners="circle"
                css={{ position: 'absolute', right: 12, top: 12 }}
              >
                <FontAwesomeIcon icon={faCompress} width={16} height={16} />
              </Button>
            </DialogClose>
          </Overlay>
          <Content
            css={{
              zIndex: 2000,
              top: '50%',
              border: 'none',
              borderRadius: 0,
              background: 'none',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Flex
              direction="column"
              align="center"
              justify="center"
              css={{
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                maxWidth: '100%',
              }}
            >
              <TokenMedia
                token={token?.token}
                style={{
                  borderRadius: 0,
                  width: '100vw',
                  height: 'auto',
                  padding: '4px',
                }}
              />
            </Flex>
          </Content>
        </DialogPortal>
      </DialogRoot>
    )
  else {
    return null
  }
}

export default FullscreenMedia
