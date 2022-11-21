import { useEffect, useRef } from 'react'
import Box from './primitives/Box'
import Text from './primitives/Text'
import Flex from './primitives/Flex'
import GlobalSearch from './GlobalSearch'

import { useRouter } from 'next/router'

import { useShortcutCallback } from 'react-key-shortcuts'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faEllipsisH,
  faInbox,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons'

const NavItem = ({ active, ...props }) => (
  <Text
    {...props}
    css={{
      color: active ? '$gray12' : '$gray10',
      cursor: 'pointer',
      '&:hover': {
        color: '$gray11',
      },
    }}
    as="p"
    style="subtitle1"
  />
)

import { ConnectKitButton } from 'connectkit'
import Link from 'next/link'

const Layout = ({ children }) => {
  let searchRef = useRef()

  const router = useRouter()
  useShortcutCallback('search', () => {
    if (searchRef?.current) {
      searchRef?.current?.focus()
    }
  })

  return (
    <Box css={{ background: '$slate1', height: '100%', pt: 80 }}>
      <Flex
        css={{
          py: '$4',
          px: '$5',
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
            <Box css={{ width: 32, mr: '$5' }}>
              <img src="/reservoirLogo.svg" style={{ width: '100%' }} />
            </Box>
            <Flex align="center" css={{ gap: '$5', mr: '$5' }}>
              <Link href="/">
                <NavItem active={router.pathname == '/'}>Explore</NavItem>
              </Link>
              <Link href="/portfolio">
                <NavItem active={router.pathname == '/portfolio'}>Sell</NavItem>
              </Link>
              <NavItem>Developers</NavItem>
            </Flex>
          </Flex>
        </Box>

        <Box css={{ flex: 1, px: '$5' }}>
          <GlobalSearch
            inputRef={searchRef}
            placeholder="search collections"
            containerCss={{ width: '100%' }}
          />
        </Box>
        <Flex css={{ flex: 1, gap: '$5' }} justify="end" align="center">
          <Box
            css={{
              color: '$gray11',
            }}
          >
            <FontAwesomeIcon icon={faEllipsisH} size="lg" />
          </Box>

          <Box
            css={{
              color: '$gray11',
            }}
          >
            <FontAwesomeIcon icon={faInbox} size="lg" />
          </Box>
          <ConnectKitButton
            customTheme={{
              '--ck-border-radius': 8,
            }}
          />

          <Box
            css={{
              color: '$gray11',
              mr: '$2',
            }}
          >
            <FontAwesomeIcon icon={faShoppingCart} size="lg" />
          </Box>
        </Flex>
      </Flex>
      <main>{children}</main>
    </Box>
  )
}

export default Layout
