import { usePrivy, useWallets } from '@privy-io/react-auth'
import { usePrivyWagmi } from '@privy-io/wagmi-connector'
import { useNetwork, useSwitchNetwork } from 'wagmi'
import { Button } from './primitives'
import { useEffect } from 'react'

export const PrivyConnectButton = () => {
  const { login, logout, ready, authenticated } = usePrivy()
  const { wallets } = useWallets()
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi()
  const { chain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork()

  console.log(activeWallet, wallets)
  useEffect(() => {
    if (activeWallet) {
      setActiveWallet(activeWallet)
    }
  }, [activeWallet])

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
      {/* <h4>Active Wallet: {activeWallet?.address}</h4>
      <ul>
        {wallets.map((wallet) => (
          <li key={wallet.address}>
            <button onClick={() => setActiveWallet(wallet)}>
              Activate {wallet.address}
            </button>
          </li>
        ))}
      </ul> */}
      <Button
        css={{ flex: 1, justifyContent: 'center' }}
        corners="rounded"
        onClick={logout}
        type="button"
      >
        Disconnect
      </Button>

      {/* <p>Chain: </p>
      <select
        value={chain?.id}
        onChange={(e) => activeWallet?.switchChain(Number(e.target.value))}
        disabled={!activeWallet?.switchChain}
      >
        {chains.map((x) => (
          <option key={x.id} value={x.id} disabled={x.id === chain?.id}>
            {x.name}
            {isLoading && pendingChainId === x.id && ' (switching)'}
          </option>
        ))}
      </select> */}
    </div>
  )
}
