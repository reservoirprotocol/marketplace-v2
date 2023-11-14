import { usePrivy, useWallets } from '@privy-io/react-auth'
import { usePrivyWagmi } from '@privy-io/wagmi-connector'
import { Button } from './primitives'

export const PrivyConnectButton = () => {
  const { login, logout, ready, authenticated } = usePrivy()

  if (!ready) return null

  if (!authenticated) {
    return (
      <Button
        css={{ flex: 1, justifyContent: 'center' }}
        corners="rounded"
        onClick={() => login()}
        type="button"
      >
        Connect Wallet
      </Button>
    )
  }

  return (
    <div>
      <Button
        css={{ flex: 1, justifyContent: 'center' }}
        corners="rounded"
        onClick={logout}
        type="button"
      >
        Disconnect
      </Button>
    </div>
  )
}
