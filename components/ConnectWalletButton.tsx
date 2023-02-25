import { ConnectKitButton } from 'connectkit'
import Box from 'components/primitives/Box'
import Button from 'components/primitives/Button'
import { FC } from 'react'

type Props = {}

export const ConnectWalletButton: FC<Props> = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, chain, show }) => {
        return (
          <Box
            style={{
              flex: '1',
              display: 'flex',
              justifyContent: 'flex',
            }}
          >
            {(() => {
              if (!isConnected || !chain) {
                return (
                  <Button
                    css={{
                      flex: 1,
                      justifyContent: 'center',
                      '&:hover': {
                        background: '$gray8',
                      },
                    }}
                    color='gray3'
                    corners="rounded"
                    onClick={show}
                    type="button"
                  >
                    Connect Wallet
                  </Button>
                )
              }
            })()}
          </Box>
        )
      }}
    </ConnectKitButton.Custom>
  )
}
