import { faCompress, faExpand } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Flex } from 'components/primitives'
import { FC, useState } from 'react'
import {
  AnimatedContent,
  AnimatedOverlay,
  Content,
} from 'components/primitives/Dialog'
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
import { AnimatePresence, motion } from 'framer-motion'

type Props = {
  token?: ReturnType<typeof useTokens>['data'][0]
}

const FullscreenMedia: FC<Props> = ({ token }) => {
  const mediaType = extractMediaType(token?.token?.media)
  const [open, setOpen] = useState(false)

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
      <DialogRoot modal={true} open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <AnimatePresence>
          {open ? (
            <DialogPortal forceMount>
              <AnimatedOverlay
                style={{
                  position: 'fixed',
                  zIndex: 1000,
                  inset: 0,
                  width: '100vw',
                  height: '100vh',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: '20px',
                  opacity: 1,
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
              </AnimatedOverlay>
              <AnimatedContent
                style={{
                  zIndex: 2000,
                  top: '50%',
                  border: 'none',
                  borderRadius: 0,
                  background: 'none',
                }}
                forceMount={true}
              >
                <motion.div
                  transition={{ type: 'spring', duration: 1 }}
                  initial={{
                    opacity: 0,
                    top: '0%',
                  }}
                  animate={{
                    opacity: 1,
                    top: '50%',
                  }}
                  exit={{
                    opacity: 0,
                    top: '0%',
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
                </motion.div>
              </AnimatedContent>
            </DialogPortal>
          ) : null}
        </AnimatePresence>
      </DialogRoot>
    )
  else {
    return null
  }
}

export default FullscreenMedia
