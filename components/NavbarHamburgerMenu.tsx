import { faTwitter, faDiscord } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from 'components/primitives/Button'
import { AnimatedFlex, Flex } from 'components/primitives/Flex'
import { AnimatePresence } from 'framer-motion'
import { FC } from 'react'

type Props = {
  open: boolean
}

const NavbarHamburgerMenu: FC<Props> = ({ open }) => {
  return (
    <AnimatePresence>
      {open && (
        <AnimatedFlex
          css={{
            position: 'fixed',
            inset: 0,
            background: '$gray1',
            top: 81,
          }}
          direction="column"
          transition={{ type: 'tween', duration: 0.3 }}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
        >
          <Flex
            align="end"
            css={{
              p: 16,
              flex: 1,
              borderBottomColor: '$gray7',
              borderBottomWidth: 1,
            }}
          >
            <Button css={{ flex: 1, justifyContent: 'center' }}>
              Connect Wallet
            </Button>
          </Flex>
          <Flex css={{ px: 16, pt: 24, pb: 32, gap: 16 }}>
            <Button
              onClick={() => window.open('https://twitter.com/home', '_blank')}
              color="gray4"
              size="xs"
            >
              <FontAwesomeIcon icon={faTwitter} width={16} height={16} />
            </Button>
            <Button
              onClick={() => window.open('https://discord.com', '_blank')}
              color="gray4"
              size="xs"
            >
              <FontAwesomeIcon icon={faDiscord} width={16} height={16} />
            </Button>
          </Flex>
        </AnimatedFlex>
      )}
    </AnimatePresence>
  )
}

export default NavbarHamburgerMenu
