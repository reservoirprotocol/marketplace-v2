import { ConnectWalletButton } from 'components/ConnectWalletButton'
import { AccountSidebar } from 'components/navbar/AccountSidebar'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import LoreCartButton from 'plugins/lore/CartButton'
import { useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useMediaQuery } from 'react-responsive'
import { useAccount } from 'wagmi'
import { useMarketplaceChain, useMounted } from '../../hooks'
import { Box, Flex } from '../primitives'
import CartButton from './CartButton'
import GlobalSearch from './GlobalSearch'
import HamburgerMenu from './HamburgerMenu'
import MobileSearch from './MobileSearch'
import NavItem from './NavItem'
import ThemeSwitcher from './ThemeSwitcher'

export const NAVBAR_HEIGHT = 81
export const NAVBAR_HEIGHT_MOBILE = 77

const Navbar = () => {
  const { theme } = useTheme()
  const { isConnected } = useAccount()
  const isMobile = useMediaQuery({ query: '(max-width: 960px)' })
  const isMounted = useMounted()
  const { routePrefix } = useMarketplaceChain()

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
            <Box css={{ width: 68, cursor: 'pointer' }}>
              {theme == 'dark' ? (
                <Image
                  src="/dark-mode.svg"
                  width={68}
                  height={39}
                  alt="Lore logo"
                />
              ) : (
                <Image
                  src="/light-mode.svg"
                  width={68}
                  height={39}
                  alt="Lore logo"
                />
              )}
            </Box>
          </Link>
        </Flex>
      </Box>
      <Flex align="center" css={{ gap: '$3' }}>
        <MobileSearch key={`${router.asPath}-search`} />
        <CartButton />
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
          <Link href={`/${routePrefix}`}>
            <Box css={{ width: 112, cursor: 'pointer' }}>
              {theme == 'dark' ? (
                <Image
                  src="/dark-mode.svg"
                  width={112}
                  height={36}
                  alt="Lore logo"
                />
              ) : (
                <Image
                  src="/light-mode.svg"
                  width={112}
                  height={36}
                  alt="Lore logo"
                />
              )}
            </Box>
          </Link>
          <Box css={{ flex: 1, px: '$5', maxWidth: 600 }}>
            <GlobalSearch
              ref={searchRef}
              placeholder="Search collections and addresses"
              containerCss={{ width: '100%' }}
              key={router.asPath}
            />
          </Box>
          <Flex align="center" css={{ gap: '$5', mr: '$5' }}>
            <Link href={`/${routePrefix}/collection-rankings`}>
              <NavItem active={router.pathname.includes('collection-rankings')}>
                Collections
              </NavItem>
            </Link>
            <Link href="/portfolio">
              <NavItem active={router.pathname == '/portfolio'}>Sell</NavItem>
            </Link>
            <Link href="https://docs.reservoir.tools/docs">
              <NavItem active={false}>Docs</NavItem>
            </Link>
          </Flex>
        </Flex>
      </Box>

      <Flex css={{ gap: '$3' }} justify="end" align="center">
        <ThemeSwitcher />
        <CartButton />
        <LoreCartButton />
        {isConnected ? (
          <AccountSidebar />
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
