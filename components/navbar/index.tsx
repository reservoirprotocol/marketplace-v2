import { useRef } from 'react'
import { Box, Flex } from '../primitives'
import GlobalSearch from './GlobalSearch'
import { useRouter } from 'next/router'
import { useHotkeys } from 'react-hotkeys-hook'
import Link from 'next/link'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import NavItem from './NavItem'
import ThemeSwitcher from './ThemeSwitcher'
import ChainSwitcher from './ChainSwitcher'
import HamburgerMenu from './HamburgerMenu'
import MobileSearch from './MobileSearch'
import { useTheme } from 'next-themes'
import { useMediaQuery } from 'react-responsive'
import { useMounted } from '../../hooks'
import { useAccount } from 'wagmi'
import { ProfileDropdown } from './ProfileDropdown'
import CartMenu from "./CartMenu";

export const NAVBAR_HEIGHT = 81
export const NAVBAR_HEIGHT_MOBILE = 77

const Navbar = () => {
  const { theme } = useTheme()
  const { isConnected } = useAccount()
  const isMobile = useMediaQuery({ query: '(max-width: 960px)' })
  const isMounted = useMounted()

  let searchRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  useHotkeys('meta+k', () => {
    if (searchRef?.current) {
      searchRef?.current?.focus()
    }
  })

  if (!isMounted) {
    return null
  }

  return isMobile ? (
    <Flex
      css={{
        height: NAVBAR_HEIGHT_MOBILE,
        px: '$4',
        width: '100%',
        borderBottom: '1px solid $gray4',
        zIndex: 999,
        background: '$slate1',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
      }}
      align="center"
      justify="between"
    >
      <Box css={{ flex: 1 }}>
        <Flex align="center">
          <Link href="/">
            <Box css={{ width: 34, cursor: 'pointer' }}>
              <img src="/nftearth-icon-new.png" style={{ width: 34, height: 34 }} />
            </Box>
          </Link>
        </Flex>
      </Box>
      <Flex align="center" css={{ gap: '$3' }}>
        <MobileSearch key={`${router.asPath}-search`} />
        <ChainSwitcher />
        <CartMenu />
        <HamburgerMenu key={`${router.asPath}-hamburger`} />
      </Flex>
    </Flex>
  ) : (
    <Flex
      css={{
        height: NAVBAR_HEIGHT,
        px: '$5',
        width: '100%',
        maxWidth: 1920,
        mx: 'auto',
        borderBottom: '1px solid $gray4',
        zIndex: 999,
        background: '$neutralBg',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
      }}
      align="center"
      justify="between"
    >
      <Box css={{ flex: 1 }}>
        <Flex align="center">
          <Link href="/">
            <Box css={{ cursor: 'pointer', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              {theme == 'dark' ? (
                <img src="/nftearth-icon-new.png" style={{ width: 40 }} />
              ) : (
                <img
                  src="/nftearth-icon-new.png"
                  style={{ width: 40, height: 40 }}
                />
              )}
            </Box>
          </Link>
          <Box css={{ flex: 1, ml: '$5', px: '$5', maxWidth: 460 }}>
            <GlobalSearch
              ref={searchRef}
              placeholder="Search collections and addresses"
              containerCss={{ width: '100%' }}
              key={router.asPath}
            />
          </Box>
          <Flex align="center" css={{ gap: '$5', mr: '$5' }}>
            <Link href="/explore" legacyBehavior>
              <NavItem active={router.pathname == '/explore'}>Explore</NavItem>
            </Link>
            <a href="/portfolio">
              <NavItem active={router.pathname == '/portfolio'}>Sell</NavItem>
            </a>
            <Link href="/launch/deploy" legacyBehavior>
              <NavItem active={router.pathname == '/launch/deploy'}>Launch</NavItem>
            </Link>
          </Flex>
        </Flex>
      </Box>
      <Flex css={{ gap: '$3' }} justify="end" align="center">
        <ThemeSwitcher />
        <CartMenu />
        <ChainSwitcher />
        {isConnected ? (
          <ProfileDropdown />
        ) : (
          <Box css={{ maxWidth: '185px' }}>
            <ConnectWalletButton />
          </Box>
        )}
      </Flex>
    </Flex>
  )
}

export default Navbar
