import { useRef } from 'react'
import { Box, Flex, Button } from '../primitives'
import GlobalSearch from './GlobalSearch'
import { useRouter } from 'next/router'
import { useHotkeys } from 'react-hotkeys-hook'
import Link from 'next/link'
import Image from 'next/image'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import NavItem from './NavItem'
import ThemeSwitcher from './ThemeSwitcher'
import HamburgerMenu from './HamburgerMenu'
import MobileSearch from './MobileSearch'
import { useTheme } from 'next-themes'
import { useMediaQuery } from 'react-responsive'
import { useMarketplaceChain, useMounted } from '../../hooks'
import { useAccount } from 'wagmi'
import CartButton from './CartButton'
import { AccountSidebar } from 'components/navbar/AccountSidebar'
import {
  faBolt, faRankingStar,
} from '@fortawesome/free-solid-svg-icons'


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
          <Link href={`/${routePrefix}`}>
          <Box css={{ width: 136, cursor: 'pointer' }}>
              {theme == 'dark' ? (
                <Image
                  src="/seaportMarketLogo.svg"
                  width={136}
                  height={39}
                  alt="SeaPort"
                />
              ) : (
                <Image
                  src="/seaportMarketLogoLight.svg"
                  width={136}
                  height={40}
                  alt="SeaPort"
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
            <Box css={{ width: 136, cursor: 'pointer' }}>
              {theme == 'dark' ? (
                <Image
                  src="/seaportMarketLogo.svg"
                  width={136}
                  height={40}
                  alt="SeaPort"
                />
              ) : (
                <Image
                  src="/seaportMarketLogoLight.svg"
                  width={136}
                  height={40}
                  alt="SeaPort"
                />
              )}
            </Box>
          </Link>
          <Box css={{ flex: 1, px: '$5', width: '100%' }}>
            <GlobalSearch
              ref={searchRef}
              placeholder="Search collections and addresses"
              containerCss={{ width: '100%' }}
              key={router.asPath}
            />
          </Box>
          <Flex align="center" css={{ gap: '$3', mr: '$3' }}>
            <Link href={`/${routePrefix}/collection-rankings`}>
              <NavItem active={router.pathname.includes('collection-rankings')}>
                <FontAwesomeIcon icon={faRankingStar} />
                    Ranks
              </NavItem>
            </Link>
            <Link href="/portfolio">
              <Button
                css={{
                  '&:hover': {
                    background: '$gray8',
                  },
                }}
                color="gray3"
              >
                <FontAwesomeIcon icon={faBolt} />
                    Sell
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Box>

      <Flex css={{ gap: '$3' }} justify="end" align="center">
        <ThemeSwitcher />
        <CartButton />
        {isConnected ? (
          <AccountSidebar />
        ) : (
          <Box css={{ maxWidth: '285px' }}>
            <ConnectWalletButton />
          </Box>
        )}
      </Flex>
    </Flex>
  )
}

export default Navbar
