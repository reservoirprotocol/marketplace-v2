import {
  useState,
  createContext,
  SetStateAction,
  Dispatch,
  FC,
  ReactNode,
  useEffect,
} from 'react'
import { Provider as ToastProvider } from '@radix-ui/react-toast'
import Toast, { ToastViewport } from 'components/primitives/Toast'
import { useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import { Anchor, Flex } from 'components/primitives'
import { v4 as uuidv4 } from 'uuid'
import { Execute } from '@reservoir0x/reservoir-sdk'
import { useNetwork } from 'wagmi'
import * as allChains from 'wagmi/chains'
import { customChains } from '@reservoir0x/reservoir-sdk'

type ToastType = {
  id?: string
  title?: string
  description?: string
  action?: ReactNode
  status?: 'success' | 'error'
}

type Step = Execute['steps'][0]

export const ToastContext = createContext<{
  toasts: Array<ToastType>
  setToasts: Dispatch<SetStateAction<Array<ToastType>>> | null
  addToast: ((toast: ToastType) => void) | null
}>({
  toasts: [],
  setToasts: null,
  addToast: null,
})

const ToastContextProvider: FC<any> = ({ children }) => {
  const [toasts, setToasts] = useState<Array<ToastType>>([])

  const addToast = (toast: ToastType) => {
    toast.id = uuidv4()
    setToasts([...toasts, toast])
  }

  const client = useReservoirClient()

  useEffect(() => {
    let eventListener: any
    if (client) {
      eventListener = client.addEventListener((event, chainId) => {
        switch (event.name) {
          case 'purchase_error':
            addToast?.({
              title: 'Purchase Failure',
              status: 'error',
              description:
                event.data.error.length < 100
                  ? event.data.error
                  : 'Failed to complete purchase',
            })
            break

          case 'accept_offer_error':
            addToast?.({
              title: 'Failed to sell',
              status: 'error',
              description:
                event.data.error.length < 100
                  ? event.data.error
                  : 'Failed to accept offer(s)',
            })
            break

          case 'purchase_complete':
          case 'accept_offer_complete':
            const executableSteps: Execute['steps'] = event?.data?.steps.filter(
              (step: Step) => step.items && step.items.length > 0
            )

            let stepCount = executableSteps.length

            let currentStepItem: NonNullable<Step['items']>[0] | undefined

            const currentStepIndex = executableSteps.findIndex((step: Step) => {
              currentStepItem = step.items?.find(
                (item) => item.status === 'incomplete'
              )
              return currentStepItem
            })

            const currentStep =
              currentStepIndex > -1
                ? executableSteps[currentStepIndex]
                : executableSteps[stepCount - 1]

            const purchaseTxHashes =
              currentStep?.items?.reduce((txHashes, item) => {
                item.transfersData?.forEach((transferData) => {
                  if (transferData.txHash) {
                    txHashes.add(transferData.txHash)
                  }
                })
                return txHashes
              }, new Set<string>()) || []

            const totalPurchases = Array.from(purchaseTxHashes).length

            const failedPurchases =
              totalPurchases - (currentStep?.items?.length || 0)

            const action =
              event.name === 'accept_offer_complete' ? 'sold' : 'purchased'
            addToast?.({
              title: failedPurchases
                ? `${totalPurchases} ${
                    totalPurchases > 1 ? 'items' : 'item'
                  } ${action}, ${failedPurchases} ${
                    failedPurchases > 1 ? 'items' : 'item'
                  } ${action}`
                : `${totalPurchases} ${
                    totalPurchases > 1 ? 'items' : 'item'
                  } ${action}.`,
              status: failedPurchases ? 'error' : 'success',
              action: (
                <Flex direction="column" css={{ gap: '$1' }}>
                  {currentStep.items?.map((item) => {
                    const chains: allChains.Chain[] | undefined = Object.values(
                      {
                        ...allChains,
                        ...customChains,
                      }
                    )
                    return item.txHashes?.map(({ txHash, chainId }) => {
                      const chain = chains?.find(({ id }) => id === chainId)
                      const blockExplorerBaseUrl =
                        chain?.blockExplorers?.default?.url ||
                        'https://etherscan.io'
                      const formattedTxHash = txHash
                        ? `${txHash.slice(0, 4)}...${txHash.slice(-4)}`
                        : ''
                      return (
                        <Anchor
                          href={`${blockExplorerBaseUrl}/tx/${txHash}`}
                          color="primary"
                          weight="medium"
                          target="_blank"
                          css={{ fontSize: 12 }}
                        >
                          View transaction: {formattedTxHash}
                        </Anchor>
                      )
                    })
                  })}
                </Flex>
              ),
            })
            break
        }
      })
    }
    return () => {
      client?.removeEventListener(eventListener)
    }
  }, [client])

  return (
    <ToastContext.Provider value={{ toasts, addToast, setToasts }}>
      <ToastProvider duration={5000}>
        {children}
        {toasts.map((toast, idx) => {
          return (
            <Toast
              key={idx}
              id={toast.id}
              title={toast.title}
              description={toast.description}
              action={toast.action}
              status={toast.status}
            />
          )
        })}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  )
}

export default ToastContextProvider
