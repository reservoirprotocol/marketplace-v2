import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Flex, Text } from 'components/primitives'
import { Content } from 'components/primitives/Dialog'
import {
  Root as DialogRoot,
  DialogTrigger,
  DialogPortal,
} from '@radix-ui/react-dialog'
import * as RadixDialog from '@radix-ui/react-dialog'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { ConnectWalletButton } from 'components/ConnectWalletButton'

const HamburgerMenu = () => {
  const { address, isConnected } = useAccount()

  const children = (
    <Flex
      css={{
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <Flex
        css={{
          py: '$4',
          px: '$4',
          width: '100%',
          borderBottom: '1px solid $gray4',
        }}
        align="center"
        justify="between"
      >
        <Link href="/">
          <Box css={{ width: 34, cursor: 'pointer' }}>
            <img src="/reservoirLogo.svg" style={{ width: '100%' }} />
          </Box>
        </Link>
        <RadixDialog.Close>
          <Flex
            css={{
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              alignItems: 'center',
              borderRadius: 8,
              backgroundColor: '$gray3',
              color: '$gray12',
              '&:hover': {
                backgroundColor: '$gray4',
              },
            }}
          >
            <FontAwesomeIcon icon={faXmark} width={16} height={16} />
          </Flex>
        </RadixDialog.Close>
      </Flex>
      {isConnected ? (
        <Flex
          css={{
            flexDirection: 'column',
            justifyContent: 'flex-start',
            height: '100%',
            py: '$5',
            px: '$4',
          }}
        >
          <Link href="/profile">
            <Text
              style="subtitle1"
              css={{
                borderBottom: '1px solid $gray4',
                cursor: 'pointer',
                pb: '$4',
                pt: '24px',
              }}
            >
              Profile
            </Text>
          </Link>
          <Link href="/sell">
            <Text
              style="subtitle1"
              css={{
                borderBottom: '1px solid $gray4',
                cursor: 'pointer',
                pb: '$4',
                pt: '24px',
              }}
            >
              Sell
            </Text>
          </Link>
          <Flex
            css={{
              justifyContent: 'space-between',
              borderBottom: '1px solid $gray4',
            }}
          >
            <Text
              style="subtitle1"
              css={{
                pb: '$4',
                pt: '24px',
              }}
            >
              Balance
            </Text>
          </Flex>
        </Flex>
      ) : (
        <Flex
          css={{
            flexDirection: 'column',
            justifyContent: 'flex-end',
            height: '100%',
            py: '$5',
            px: '$4',
          }}
        >
          <Box>
            <ConnectWalletButton />
          </Box>
        </Flex>
      )}
      <Flex
        css={{
          pt: '24px',
          pb: '$5',
          px: '$4',
          gap: '$4',
          width: '100%',
          borderTop: '1px solid $gray4',
        }}
      >
        <Link href="/">
          <Button
            css={{ justifyContent: 'center', width: '44px', height: '44px' }}
            type="button"
            size="small"
            color="gray3"
          >
            <FontAwesomeIcon icon={faTwitter} width={20} height={20} />
          </Button>
        </Link>
        <Link href="/">
          <Button
            css={{ justifyContent: 'center', width: '44px', height: '44px' }}
            type="button"
            size="small"
            color="gray3"
          >
            <FontAwesomeIcon icon={faDiscord} width={20} height={20} />
          </Button>
        </Link>
      </Flex>
    </Flex>
  )
  return (
    <DialogRoot modal={false}>
      <DialogTrigger asChild>
        <Button
          css={{ justifyContent: 'center', width: '44px', height: '44px' }}
          type="button"
          size="small"
          color="gray3"
        >
          <FontAwesomeIcon icon={faBars} width={16} height={16} />
        </Button>
      </DialogTrigger>
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

export default HamburgerMenu
