import {
  ReservoirWallet,
  LogLevel,
  customChains,
  getClient,
} from '@reservoir0x/reservoir-sdk'
import { Account, Hex, WalletClient, custom, hexToBigInt } from 'viem'
import * as allChains from 'viem/chains'

export const adaptPrivyWallet = (wallet: WalletClient): ReservoirWallet => {
  return {
    transport: custom(wallet.transport),
    address: async () => {
      let address = wallet.account?.address
      if (!address) {
        ;[address] = await wallet.getAddresses()
      }
      return address
    },
    handleSignMessageStep: async (stepItem) => {
      const privyLayer = document.getElementById('privy-dialog')
      if (privyLayer && document.body.style) {
        document.body.style.pointerEvents = 'auto'
      }

      const client = getClient()
      const signData = stepItem.data?.sign
      let signature: string | undefined
      if (signData) {
        if (signData.signatureKind === 'eip191') {
          client.log(['Execute Steps: Signing with eip191'], LogLevel.Verbose)
          if (signData.message.match(/0x[0-9a-fA-F]{64}/)) {
            // If the message represents a hash, we need to convert it to raw bytes first
            signature = await wallet.signMessage({
              account: wallet.account as Account,
              message: {
                raw: signData.message as Hex,
              },
            })
          } else {
            signature = await wallet.signMessage({
              account: wallet.account as Account,
              message: signData.message,
            })
          }
        } else if (signData.signatureKind === 'eip712') {
          client.log(['Execute Steps: Signing with eip712'], LogLevel.Verbose)
          signature = await wallet.signTypedData({
            account: wallet.account as Account,
            domain: signData.domain as any,
            types: signData.types as any,
            primaryType: signData.primaryType,
            message: signData.value,
          })
        }
      }
      return signature
    },
    handleSendTransactionStep: async (chainId, stepItem) => {
      try {
        const privyLayer = document.getElementById('privy-dialog')
        if (privyLayer && document.body.style) {
          console.log('setting to auto')
          document.body.style.pointerEvents = 'auto'
        }
      } catch (e) {
        console.log(e)
      }

      let viemChain: allChains.Chain
      const customChain = Object.values(customChains).find(
        (chain) => chain.id === (chainId || 1)
      )
      if (customChain) {
        viemChain = customChain
      } else {
        viemChain =
          Object.values(allChains).find(
            (chain) => chain.id === (chainId || 1)
          ) || allChains.mainnet
      }
      const stepData = stepItem.data

      return await wallet.sendTransaction({
        chain: viemChain,
        data: stepData.data,
        account: wallet.account ?? stepData.from, // use signer.account if it's defined
        to: stepData.to,
        value: hexToBigInt((stepData.value as any) || 0),
        ...(stepData.maxFeePerGas && {
          maxFeePerGas: hexToBigInt(stepData.maxFeePerGas as any),
        }),
        ...(stepData.maxPriorityFeePerGas && {
          maxPriorityFeePerGas: hexToBigInt(
            stepData.maxPriorityFeePerGas as any
          ),
        }),
        ...(stepData.gas && {
          gas: hexToBigInt(stepData.gas as any),
        }),
      })
    },
  }
}
