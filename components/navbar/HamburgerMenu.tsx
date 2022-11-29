import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Flex } from 'components/primitives'
import { Dialog } from 'components/primitives/Dialog'
import * as RadixDialog from '@radix-ui/react-dialog'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

const HamburgerMenu = () => {
  const trigger = (
    <Button
      css={{ justifyContent: 'center', width: '44px', height: '44px' }}
      type="button"
      size="small"
      color="gray3"
    >
      <FontAwesomeIcon icon={faBars} width={16} height={16} />
    </Button>
  )

  const children = (
    <Flex css={{ justifyContent: 'space-between' }}>
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
          <Button
            css={{ justifyContent: 'center', width: '44px', height: '44px' }}
            type="button"
            size="small"
            color="gray3"
          >
            <FontAwesomeIcon icon={faXmark} width={16} height={16} />
          </Button>
        </RadixDialog.Close>
      </Flex>
      <Flex css={{}}></Flex>
    </Flex>
  )

  return (
    <Dialog
      trigger={trigger}
      children={children}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '0px',
        border: '0px',
        minWidth: '100%',
        maxWidth: '100vw',
        maxHeight: '100vh',
        top: '0%',
        zIndex: '99999',
      }}
    />
  )
}

export default HamburgerMenu
