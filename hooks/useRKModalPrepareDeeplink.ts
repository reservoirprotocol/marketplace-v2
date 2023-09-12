import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useEffect } from 'react'
import { useAccount, useWalletClient } from 'wagmi'

export default (enabled: boolean = false) => {
  const { status } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { data: signer } = useWalletClient()

  useEffect(() => {
    if (!enabled) {
      return
    }

    if (status === 'connecting' || status === 'reconnecting') {
      return
    }

    if (status !== 'connected' || !signer) {
      openConnectModal?.()
    }
  }, [status, enabled, signer])
}
