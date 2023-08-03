import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useEffect } from 'react'
import {
  useAccount,
  useNetwork,
  useSwitchNetwork,
  useWalletClient,
} from 'wagmi'

export default (chainId: number, enabled: boolean = false) => {
  const { status } = useAccount()
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId,
  })
  const { chain: activeChain } = useNetwork()
  const { openConnectModal } = useConnectModal()
  const { data: signer } = useWalletClient()

  const isInTheWrongNetwork = Boolean(signer && activeChain?.id !== chainId)

  useEffect(() => {
    if (!enabled) {
      return
    }

    if (status === 'connecting' || status === 'reconnecting') {
      return
    }

    if (status === 'connected' && signer) {
      if (isInTheWrongNetwork) {
        switchNetworkAsync?.(chainId)
      }
    } else {
      openConnectModal?.()
    }
  }, [status, enabled, signer, isInTheWrongNetwork])
}
