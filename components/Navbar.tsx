import { FC, useState } from 'react'
import { Avatar } from './primitives/Avatar'
import Button from './primitives/Button'
import { Flex } from './primitives/Flex'
import Input from './primitives/Input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMagnifyingGlass,
  faBars,
  faClose,
} from '@fortawesome/free-solid-svg-icons'
import { Box } from './primitives/Box'
import { useMediaQuery } from '@react-hookz/web'
import Link from 'next/link'
import { truncateAddress } from 'utils/truncate'
import { Anchor } from 'components/primitives/Anchor'
import NavbarHamburgerMenu from 'components/NavbarHamburgerMenu'

type Props = {
  isWalletConnected?: boolean
}

const SearchIcon = () => (
  <Box css={{ color: '$gray10' }}>
    <FontAwesomeIcon icon={faMagnifyingGlass} width={16} height={16} />
  </Box>
)

type HamburgerIconProps = {
  menuOpen: boolean
}

const HamburgerIcon: FC<HamburgerIconProps> = ({ menuOpen }) => {
  if (menuOpen) {
    return <FontAwesomeIcon icon={faClose} width={16} height={16} />
  }
  return <FontAwesomeIcon icon={faBars} width={16} height={16} />
}

const Navbar: FC<Props> = ({ isWalletConnected = false }) => {
  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false)
  const isSmallDevice = useMediaQuery(
    'only screen and (max-width : 725px)',
    true
  )
  const address = '0x0CccD55A5Ac261Ea29136831eeaA93bfE07f1231'

  return (
    <>
      <Flex
        justify="between"
        css={{
          background: '$gray1',
          borderBottomColor: '$gray7',
          borderBottomWidth: 1,
          px: 32,
          py: 16,
          gap: 24,
        }}
      >
        <Flex align="center" css={{ gap: 24, flex: 1 }}>
          <Link href="/">
            <Anchor>
              <img src="/superset.svg" alt="Navbar Logo" />
            </Anchor>
          </Link>
          <Input
            containerCss={{ maxWidth: 420, width: '100%' }}
            placeholder="Search Collections"
            icon={<SearchIcon />}
          />
        </Flex>
        <Flex justify="between" align="center" css={{ gap: 36 }}>
          {isSmallDevice ? (
            <Button
              color="gray3"
              size="xs"
              onClick={() => setHamburgerMenuOpen(!hamburgerMenuOpen)}
            >
              <HamburgerIcon menuOpen={hamburgerMenuOpen} />
            </Button>
          ) : (
            <>
              {isWalletConnected ? (
                <Button corners="pill" color="gray3">
                  <Avatar
                    size="small"
                    src="https://lh3.googleusercontent.com/ak5vqxL5SBOu9m5zHYxydtBije8SKnnuynh8sSkIbBkabUE3CgKLoLzywf9Fp8iYZHhxpAGOtZxTU9eaDJjsV9ZBmQTHxdv1aTfMBEw=w140"
                  />
                  {truncateAddress(address)}
                </Button>
              ) : (
                <Button corners="pill">Connect Wallet</Button>
              )}
            </>
          )}
        </Flex>
      </Flex>
      <NavbarHamburgerMenu open={hamburgerMenuOpen} />
    </>
  )
}

export default Navbar
