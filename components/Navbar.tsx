import { FC } from 'react'
import { Avatar } from './primitives/Avatar'
import Button from './primitives/Button'
import { Flex } from './primitives/Flex'
import Input from './primitives/Input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faBars } from '@fortawesome/free-solid-svg-icons'
import { Box } from './primitives/Box'
import { useMediaQuery } from '@react-hookz/web'
import Link from 'next/link'

type Props = {
  isWalletConnected?: boolean
}

const SearchIcon = () => (
  <Box css={{ color: '$gray10' }}>
    <FontAwesomeIcon icon={faMagnifyingGlass} width={16} height={16} />
  </Box>
)

const HamburgerMenuIcon = () => (
  <FontAwesomeIcon icon={faBars} width={16} height={16} />
)

const Navbar: FC<Props> = ({ isWalletConnected = false }) => {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 600px)')

  return (
    <Flex
      justify="between"
      css={{
        bg: '$gray1',
        borderBottomColor: '$gray7',
        borderBottomWidth: 1,
        px: 32,
        py: 16,
        gap: 24,
      }}
    >
      <Flex align="center" css={{ gap: 24 }}>
        <Avatar src="#" alt="" size={38} />
        <Input placeholder="Search Collections" icon={<SearchIcon />} />
      </Flex>
      <Flex justify="between" align="center" css={{ gap: 36 }}>
        {isSmallDevice ? (
          <Button>
            <HamburgerMenuIcon />
          </Button>
        ) : (
          <>
            {isWalletConnected && (
              <>
                <Link href="#">
                  <a>Portfolio</a>
                </Link>
                <Link href="#">
                  <a>Sell</a>
                </Link>
              </>
            )}
            <Button corners="pill">Connect Wallet</Button>
          </>
        )}
      </Flex>
    </Flex>
  )
}

export default Navbar
