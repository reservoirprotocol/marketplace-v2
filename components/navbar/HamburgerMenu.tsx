import {
  Box,
  Button,
  Flex,
  FormatCryptoCurrency,
  Text,
} from 'components/primitives'
import { Avatar } from 'components/primitives/Avatar'
import * as RadixDialog from '@radix-ui/react-dialog'
import {
  faBars,
  faXmark,
  faRightFromBracket,
  faCopy,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'
import {
  useAccount,
  useBalance,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from 'wagmi'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import { useCopyToClipboard } from 'usehooks-ts'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { truncateAddress, truncateEns } from 'utils/truncate'
import { FullscreenModal } from 'components/common/FullscreenModal'
import { useContext } from 'react'
import { ToastContext } from 'context/ToastContextProvider'

const HamburgerMenu = () => {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ address })
  const { disconnect } = useDisconnect()
  const [value, copy] = useCopyToClipboard()
  const { addToast } = useContext(ToastContext)

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
          height: '100%',
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
            <Box css={{ width: 34, cursor: 'pointer' }}>
              <img src="/reservoirLogo.svg" style={{ width: '100%' }} />
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
            <Flex
              css={{
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                borderBottom: '1px solid $gray4',
                pb: '$4',
              }}
              onClick={() => {
                ensName ? copy(ensName) : copy(address as string)
                addToast?.({ title: 'Copied' })
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
                <Text
                  style="subtitle1"
                  color="$gray11"
                  css={{ ml: '$2', color: '$gray11' }}
                >
                  {ensName
                    ? truncateEns(ensName)
                    : truncateAddress(address as string)}
                </Text>
              </Flex>
              <Box css={{ color: '$gray10' }}>
                <FontAwesomeIcon icon={faCopy} width={16} height={16} />
              </Box>
            </Flex>
            <Link href="/profile" legacyBehavior>
              <Text
                style="subtitle1"
                css={{
                  borderBottom: '1px solid $gray4',
                  cursor: 'pointer',
                  pb: '$4',
                  pt: '24px',
                }}
              >
                Profile
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
                }}
              >
                Sell
              </Text>
            </Link>
            <Flex
              css={{
                justifyContent: 'space-between',
                borderBottom: '1px solid $gray4',
              }}
            >
              <Text
                style="subtitle1"
                css={{
                  pb: '$4',
                  pt: '24px',
                }}
              >
                Balance
              </Text>
              <FormatCryptoCurrency
                amount={balance?.value}
                decimals={balance?.decimals}
                textStyle="subtitle1"
                logoHeight={14}
              />
            </Flex>
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
            css={{
              flexDirection: 'column',
              justifyContent: 'flex-end',
              height: '100%',
              py: '$5',
              px: '$4',
            }}
          >
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
          <a href="https://discord.gg/j5K9fESNwh" target="_blank">
            <Button
              css={{ justifyContent: 'center', width: '44px', height: '44px' }}
              type="button"
              size="small"
              color="gray3"
            >
              <FontAwesomeIcon icon={faDiscord} width={20} height={20} />
            </Button>
          </a>
        </Flex>
      </Flex>
    </FullscreenModal>
  )
}

export default HamburgerMenu
