import { Anchor, Box, Button, Flex, Text } from 'components/primitives'
import { Avatar } from 'components/primitives/Avatar'
import * as RadixDialog from '@radix-ui/react-dialog'
import {
  faBars,
  faXmark,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'
import Image from 'next/image'
import { useAccount, useDisconnect } from 'wagmi'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { FullscreenModal } from 'components/common/FullscreenModal'
import { useENSResolver, useMarketplaceChain } from 'hooks'
import ThemeSwitcher from 'components/navbar/ThemeSwitcher'
import Wallet from 'components/navbar/Wallet'

const HamburgerMenu = () => {
  const { address, isConnected } = useAccount()
  const {
    avatar: ensAvatar,
    shortAddress,
    shortName: shortEnsName,
  } = useENSResolver(address)
  const { disconnect } = useDisconnect()
  const { routePrefix } = useMarketplaceChain()

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

  return (
    <FullscreenModal trigger={trigger}>
      {' '}
      <Flex
        css={{
          flexDirection: 'column',
          justifyContent: 'space-between',
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
            <Box css={{ width: 46, cursor: 'pointer' }}>
              <Image
                src="/reservoirLogo.svg"
                width={36}
                height={36}
                alt="Reservoir"
              />
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
            <Link href={`/portfolio/${address}`} legacyBehavior>
              <Flex
                css={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  pb: '$4',
                }}
              >
                <Flex css={{ alignItems: 'center' }}>
                  {ensAvatar ? (
                    <Avatar size="medium" src={ensAvatar} />
                  ) : (
                    <Jazzicon
                      diameter={36}
                      seed={jsNumberForAddress(address as string)}
                    />
                  )}
                  <Text style="subtitle1" css={{ ml: '$2' }}>
                    {shortEnsName ? shortEnsName : shortAddress}
                  </Text>
                </Flex>
              </Flex>
            </Link>
            <Link href={`/${routePrefix}/collection-rankings`} legacyBehavior>
              <Text
                style="subtitle1"
                css={{
                  borderBottom: '1px solid $gray4',
                  cursor: 'pointer',
                  pb: '$4',
                  pt: '24px',
                }}
              >
                Explore
              </Text>
            </Link>
            <Link href="/ethereum/collections/trending" legacyBehavior>
              <Text
                style="subtitle1"
                css={{
                  borderBottom: '1px solid $gray4',
                  cursor: 'pointer',
                  pb: '$4',
                  pt: '24px',
                }}
              >
                Trending Collections
              </Text>
            </Link>

            <Link href="/ethereum/mints/trending" legacyBehavior>
              <Text
                style="subtitle1"
                css={{
                  borderBottom: '1px solid $gray4',
                  cursor: 'pointer',
                  pb: '$4',
                  pt: '24px',
                }}
              >
                Trending Mints
              </Text>
            </Link>


            <Anchor
              href="https://docs.reservoir.tools/docs"
              target="_blank"
              css={{
                borderBottom: '1px solid $gray4',
                cursor: 'pointer',
                pb: '$4',
                pt: '24px',
                width: '100%',
              }}
            >
              <Text style="subtitle1">Developers</Text>
            </Anchor>
            <Link href="/portfolio" legacyBehavior>
              <Flex
                direction="column"
                css={{
                  borderBottom: '1px solid $gray4',
                  cursor: 'pointer',
                  pb: '$4',
                  pt: '24px',
                  gap: '$1',
                }}
              >
                <Text style="subtitle1">Portfolio</Text>
                <Text style="body3" color="subtle">
                  Manage your items, collections, listings and offers
                </Text>
              </Flex>
            </Link>
            <Wallet />
            <Flex
              css={{
                justifyContent: 'space-between',
                cursor: 'pointer',
                alignItems: 'center',
                borderBottom: '1px solid $gray4',
              }}
              onClick={() => disconnect()}
            >
              <Text
                style="subtitle1"
                css={{
                  pb: '$4',
                  pt: '24px',
                }}
              >
                Logout
              </Text>
              <Box css={{ color: '$gray10' }}>
                <FontAwesomeIcon
                  icon={faRightFromBracket}
                  width={16}
                  height={16}
                />
              </Box>
            </Flex>
          </Flex>
        ) : (
          <Flex
            direction="column"
            justify="between"
            css={{
              height: '100%',
              pb: '$5',
              px: '$4',
            }}
          >
            <Flex direction="column">
              <Link href="/" legacyBehavior>
                <Text
                  style="subtitle1"
                  css={{
                    borderBottom: '1px solid $gray4',
                    cursor: 'pointer',
                    pb: '$4',
                    pt: '24px',
                    width: '100%',
                  }}
                >
                  Explore
                </Text>
              </Link>
              <Link href="/portfolio" legacyBehavior>
                <Text
                  style="subtitle1"
                  css={{
                    borderBottom: '1px solid $gray4',
                    cursor: 'pointer',
                    pb: '$4',
                    pt: '24px',
                    width: '100%',
                  }}
                >
                  Portfolio
                </Text>
              </Link>
              <Anchor
                href="https://docs.reservoir.tools/docs"
                target="_blank"
                css={{
                  borderBottom: '1px solid $gray4',
                  cursor: 'pointer',
                  pb: '$4',
                  pt: '24px',
                  width: '100%',
                }}
              >
                <Text style="subtitle1">Docs</Text>
              </Anchor>
            </Flex>
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
          <a href="https://twitter.com/reservoir0x" target="_blank">
            <Button
              css={{ justifyContent: 'center', width: '44px', height: '44px' }}
              type="button"
              size="small"
              color="gray3"
            >
              <FontAwesomeIcon icon={faTwitter} width={20} height={20} />
            </Button>
          </a>
          <ThemeSwitcher />
        </Flex>
      </Flex>
    </FullscreenModal>
  )
}

export default HamburgerMenu
