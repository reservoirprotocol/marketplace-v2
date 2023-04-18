import { ConnectButton } from '@rainbow-me/rainbowkit'
import Box from 'components/primitives/Box'
import Button from 'components/primitives/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faWallet,
} from '@fortawesome/free-solid-svg-icons'
import { FC } from 'react'

type Props = {}

export const ConnectWalletButton: FC<Props> = () => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        return (
          <Box
            style={{
              flex: '1',
              display: 'flex',
              justifyContent: 'flex',
              zindex: '100',
            }}
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
                    <FontAwesomeIcon icon={faWallet} />Connect Wallet
                  </Button>
                )
              }
            })()}
          </Box>
        )
      }}
    </ConnectButton.Custom>
  )
}
