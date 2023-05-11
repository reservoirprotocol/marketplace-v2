import { FC, useEffect, useState } from 'react'
import { AnimatedOverlay, Content } from 'components/primitives/Dialog'
import { useAccount, useDisconnect } from 'wagmi'
import { useENSResolver } from 'hooks'
import { Box, Button, Flex, Grid, Text } from 'components/primitives'
import { Avatar } from 'components/primitives/Avatar'
import Jazzicon from 'react-jazzicon/dist/Jazzicon'
import { jsNumberForAddress } from 'react-jazzicon'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartLine,
  faClose,
  faCopy,
  faHand,
  faList,
  faRightFromBracket,
  faStore,
} from '@fortawesome/free-solid-svg-icons'
import CopyText from 'components/common/CopyText'
import Link from 'next/link'
import Wallet from './Wallet'
import { useRouter } from 'next/router'

export const AccountSidebar: FC = () => {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const router = useRouter()
  const {
    avatar: ensAvatar,
    shortAddress,
    shortName: shortEnsName,
  } = useENSResolver(address)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [router.asPath])

  const trigger = (
    <Button
      css={{
        justifyContent: 'center',
      }}
      corners="circle"
      type="button"
      color="gray3"
    >
      {ensAvatar ? (
        <Avatar size="medium" src={ensAvatar} />
      ) : (
        <Jazzicon diameter={44} seed={jsNumberForAddress(address as string)} />
      )}
    </Button>
  )

  return (
    <DialogPrimitive.Root onOpenChange={setOpen} open={open}>
      {trigger && (
        <DialogPrimitive.DialogTrigger asChild>
          {trigger}
        </DialogPrimitive.DialogTrigger>
      )}
      <AnimatePresence>
        {open && (
          <DialogPrimitive.DialogPortal forceMount>
            <AnimatedOverlay
              css={{ backgroundColor: '$sidebarOverlay' }}
              style={{ opacity: 0.6 }}
            />
            <Content
              forceMount
              asChild
              css={{
                right: 0,
                top: 0,
                bottom: 0,
                transform: 'none',
                left: 'unset',
                width: 395,
                maxWidth: 395,
                minWidth: 395,
                maxHeight: '100vh',
                background: '$gray1',
                border: 0,
                borderRadius: 0,
              }}
            >
              <motion.div
                transition={{ type: 'tween', duration: 0.4 }}
                initial={{
                  opacity: 0,
                  right: '-100%',
                }}
                animate={{
                  opacity: 1,
                  right: 0,
                }}
                exit={{
                  opacity: 0,
                  right: '-100%',
                }}
              >
                <Flex direction="column" css={{ py: 42, px: '$4' }}>
                  <Button
                    color="ghost"
                    css={{ color: '$gray10', ml: 'auto', mr: 10 }}
                    onClick={() => {
                      setOpen(false)
                    }}
                  >
                    <FontAwesomeIcon icon={faClose} height={16} width={16} />
                  </Button>
                  <Flex align="center" css={{ gap: '$3', ml: '$3' }}>
                    {ensAvatar ? (
                      <Avatar size="medium" src={ensAvatar} />
                    ) : (
                      <Jazzicon
                        diameter={44}
                        seed={jsNumberForAddress(address as string)}
                      />
                    )}
                    <CopyText
                      text={address || ''}
                      css={{ width: 'max-content' }}
                    >
                      <Flex direction="column">
                        <Flex
                          align="center"
                          css={{
                            gap: 10,
                            color: '$gray11',
                            cursor: 'pointer',
                          }}
                        >
                          <Text style="body1">
                            {shortEnsName ? shortEnsName : shortAddress}
                          </Text>
                          {!shortEnsName ? (
                            <FontAwesomeIcon
                              icon={faCopy}
                              width={16}
                              height={16}
                            />
                          ) : null}
                        </Flex>
                        {shortEnsName ? (
                          <Flex
                            align="center"
                            css={{
                              gap: 10,
                              color: '$gray11',
                              cursor: 'pointer',
                            }}
                          >
                            <Text style="body2" color="subtle">
                              {shortAddress}
                            </Text>
                            <FontAwesomeIcon
                              icon={faCopy}
                              width={16}
                              height={16}
                            />
                          </Flex>
                        ) : null}
                      </Flex>
                    </CopyText>
                  </Flex>
                  <Grid css={{ gridTemplateColumns: '1fr 1fr', mt: 32 }}>
                    <Link href="/portfolio?tab=items">
                      <Flex
                        align="center"
                        css={{
                          gap: 6,
                          p: '$3',
                          color: '$gray10',
                          cursor: 'pointer',
                        }}
                      >
                        <FontAwesomeIcon icon={faStore} />
                        <Text style="body1">My Items</Text>
                      </Flex>
                    </Link>
                    <Link href="/portfolio?tab=listings">
                      <Flex
                        align="center"
                        css={{
                          gap: 6,
                          p: '$3',
                          color: '$gray10',
                          cursor: 'pointer',
                        }}
                      >
                        <FontAwesomeIcon icon={faList} />
                        <Text style="body1">Listings</Text>
                      </Flex>
                    </Link>
                    <Link href="/portfolio?tab=offers">
                      <Flex
                        align="center"
                        css={{
                          gap: 6,
                          p: '$3',
                          color: '$gray10',
                          cursor: 'pointer',
                        }}
                      >
                        <FontAwesomeIcon icon={faHand} />
                        <Text style="body1">Offers Made</Text>
                      </Flex>
                    </Link>
                    <Link href="/portfolio?tab=activity">
                      <Flex
                        align="center"
                        css={{
                          gap: 6,
                          p: '$3',
                          color: '$gray10',
                          cursor: 'pointer',
                        }}
                      >
                        <FontAwesomeIcon icon={faChartLine} />
                        <Text style="body1">Activity</Text>
                      </Flex>
                    </Link>
                  </Grid>
                  <Wallet />
                  <Flex
                    justify="between"
                    align="center"
                    css={{
                      cursor: 'pointer',
                      px: '$4',
                      my: '$3',
                    }}
                    onClick={() => disconnect()}
                  >
                    <Text style="body1">Logout</Text>
                    <Box css={{ color: '$gray10' }}>
                      <FontAwesomeIcon
                        icon={faRightFromBracket}
                        width={16}
                        height={16}
                      />
                    </Box>
                  </Flex>
                </Flex>
              </motion.div>
            </Content>
          </DialogPrimitive.DialogPortal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}
