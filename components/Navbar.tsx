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
import { truncateAddress } from 'utils/truncate'
import { Anchor } from 'components/primitives/Anchor'

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
  const isSmallDevice = useMediaQuery('only screen and (max-width : 725px)')
  const address = '0x0CccD55A5Ac261Ea29136831eeaA93bfE07f1231'

  const links = isSmallDevice ? null : (
    <>
      <Link href="#">
        <Anchor tabIndex={0}>Portfolio</Anchor>
      </Link>
      <Link href="#">
        <Anchor tabIndex={0}>Sell</Anchor>
      </Link>
    </>
  )

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
      <Flex align="center" css={{ gap: 24, flex: 1 }}>
        <Link href="/">
          <a>
            <img src="/superset.svg" alt="Navbar Logo" />
          </a>
        </Link>
        <Input
          containerCss={{ maxWidth: 420, width: '100%' }}
          placeholder="Search Collections"
          icon={<SearchIcon />}
        />
      </Flex>
      <Flex justify="between" align="center" css={{ gap: 36 }}>
        {isSmallDevice ? (
          <Button color="gray3" size="xs">
            <HamburgerMenuIcon />
          </Button>
        ) : (
          <>
            {isWalletConnected ? (
              <>
                {links}
                <Button corners="pill" color="gray3">
                  <Avatar
                    size="small"
                    src="https://lh3.googleusercontent.com/ak5vqxL5SBOu9m5zHYxydtBije8SKnnuynh8sSkIbBkabUE3CgKLoLzywf9Fp8iYZHhxpAGOtZxTU9eaDJjsV9ZBmQTHxdv1aTfMBEw=w140"
                  />
                  {truncateAddress(address)}
                </Button>
              </>
            ) : (
              <Button corners="pill">Connect Wallet</Button>
            )}
          </>
        )}
      </Flex>
    </Flex>
  )
}

export default Navbar
