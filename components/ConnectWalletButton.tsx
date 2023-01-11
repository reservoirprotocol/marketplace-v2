import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Avatar } from 'components/primitives/Avatar'
import Box from 'components/primitives/Box'
import Button from 'components/primitives/Button'
import { FC } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

type Props = {}

export const ConnectWalletButton: FC<Props> = () => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
        return (
          <Box
            style={{
              flex: '1',
              display: 'flex',
              justifyContent: 'flex',
            }}
            {...(!mounted && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <Button
                    css={{ flex: 1, justifyContent: 'center' }}
                    corners="rounded"
                    onClick={openConnectModal}
                    type="button"
                  >
                    Connect Wallet
                  </Button>
                )
              }
              return (
                <Button
                  css={{
                    justifyContent: 'center',
                  }}
                  corners="circle"
                  onClick={openAccountModal}
                  type="button"
                >
                  {account.ensAvatar ? (
                    <Avatar size="small" src={account.ensAvatar} />
                  ) : (
                    <Jazzicon
                      diameter={44}
                      seed={jsNumberForAddress(account.address)}
                    />
                  )}
                </Button>
              )
            })()}
          </Box>
        )
      }}
    </ConnectButton.Custom>
  )
}
