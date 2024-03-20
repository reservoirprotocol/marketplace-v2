import { useLogin, usePrivy, useWallets } from '@privy-io/react-auth'
import { useSetActiveWallet } from '@privy-io/wagmi'
import { Button } from './primitives'

export const PrivyConnectButton = () => {
  const { logout, ready, authenticated } = usePrivy()
  const { wallets } = useWallets()
  const { setActiveWallet } = useSetActiveWallet()

  const { login } = useLogin({
    onComplete: (user, isNewUser, wasAlreadyAuthenticated) => {
      console.log('Login complete')
      if (wallets[0]) {
        setActiveWallet(wallets[0])
      }
    },
  })

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
