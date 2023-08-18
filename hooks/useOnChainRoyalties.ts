import { parseUnits } from 'viem'
import { useContractReads } from 'wagmi'
import { mainnet, goerli } from 'wagmi/chains'

type Props = {
  tokens?: {
    contract: string
    tokenId: string
  }[]
  enabled: boolean
  chainId: number
}

export type OnChainRoyaltyReturnType = [`0x${string}`[], bigint[]]

const MANIFOLD_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'getRoyaltyView',
    outputs: [
      {
        internalType: 'address payable[]',
        name: 'recipients',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export default function ({ tokens, enabled, chainId = mainnet.id }: Props) {
  let manifoldContract = ''
  switch (chainId) {
    case mainnet.id: {
      manifoldContract = '0x0385603ab55642cb4dd5de3ae9e306809991804f'
      break
    }
    case 137: {
      manifoldContract = '0x28EdFcF0Be7E86b07493466e7631a213bDe8eEF2'
      break
    }
    case 80001:
      manifoldContract = '0x0a01E11887f727D1b1Cd81251eeEE9BEE4262D07'
      break
    case goerli.id:
    case 10:
    case 8435:
    case 42161:
    case 43114:
    case 56: {
      manifoldContract = '0xEF770dFb6D5620977213f55f99bfd781D04BBE15'
      break
    }
  }

  const amount = parseUnits('1', 18)

  return useContractReads({
    contracts: tokens?.map(({ tokenId, contract }) => ({
      chainId: chainId,
      address: manifoldContract as any,
      abi: MANIFOLD_ABI,
      args: [contract as any, tokenId as any, amount as any],
      functionName: 'getRoyaltyView',
    })),
    enabled:
      manifoldContract.length > 0 && enabled && tokens && tokens?.length > 0
        ? true
        : false,
    cacheTime: 60 * 1000,
  })
}
