import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Avatar } from 'components/primitives/Avatar'
import Box from 'components/primitives/Box'
import Button from 'components/primitives/Button'
import { FC } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
                    css={{
                      height: 44,
                      width: 44,
                      p: 0,
                      justifyContent: 'center',
                      '&:hover': {
                        background: '$gray8',
                      },
                    }}
                    color='gray3'
                    corners="rounded"
                    onClick={openConnectModal}
                    type="button"
                  >
                    <FontAwesomeIcon icon={faWallet} width={18} height={18} />
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
