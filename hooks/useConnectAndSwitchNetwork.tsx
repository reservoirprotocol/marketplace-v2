import { useState, useEffect } from 'react'
import { useSigner, useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { useModal } from 'connectkit'
import { useMarketplaceChain } from 'hooks'

export const useConnectAndSwitchNetwork = () => {
  const { data: signer } = useSigner()
  const { isConnected } = useAccount()
  const { open: connectModalOpen, setOpen: setConnectModalOpen } = useModal()
  const [clickPendingResponse, setClickPendingResponse] = useState(false)
  const { chain: activeChain } = useNetwork()
  const marketplaceChain = useMarketplaceChain()
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: marketplaceChain.id,
  })

  const isInTheWrongNetwork = Boolean(
    isConnected && activeChain?.id !== marketplaceChain.id
  )

  const handleSwitchNetwork = async () => {
    console.log('handleSwitchNetwork')
    console.log(isInTheWrongNetwork && switchNetworkAsync)
    if (isInTheWrongNetwork && switchNetworkAsync) {
      const chain = await switchNetworkAsync(marketplaceChain.id)
      if (chain.id !== marketplaceChain.id) {
        return false
      } else {
        return true
      }
    }
    return true
  }

  useEffect(() => {
    const handleOpenModal = async () => {
      if (!connectModalOpen && isConnected && clickPendingResponse) {
        await handleSwitchNetwork()
      }
      if (!connectModalOpen) {
        setClickPendingResponse(false)
      }
    }

    handleOpenModal().catch((e) => console.log(e))
  }, [connectModalOpen])

  const openConnectModal = () => {
    if (!signer) {
      setClickPendingResponse(true)
      setConnectModalOpen(true)
    }
  }

  return {
    signer,
    isConnected,
    isInTheWrongNetwork,
    handleSwitchNetwork,
    openConnectModal,
  }
}
