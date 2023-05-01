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

type ToastType = {
  id?: string
  title?: string
  description?: string
  action?: ReactNode
  status?: 'success' | 'error'
}

type Path = NonNullable<Execute['path']>[0]
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

  const { chains } = useNetwork()

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

          case 'purchase_complete':
            const chain = chains.find((chain) => chain.id === chainId)

            const blockExplorerBaseUrl =
              chain?.blockExplorers?.default?.url || 'https://etherscan.io'

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

            const pathMap = event?.data.path
              ? (event?.data.path as Path[]).reduce(
                  (paths: Record<string, Path>, path: Path) => {
                    if (path.orderId) {
                      paths[path.orderId] = path
                    }

                    return paths
                  },
                  {} as Record<string, Path>
                )
              : {}

            const totalPurchases =
              currentStep?.items?.reduce(
                (total, item) => total + (item?.salesData?.length || 0),
                0
              ) || 0

            const failedPurchases =
              (Object.keys(pathMap).length || 0) - totalPurchases

            addToast?.({
              title: failedPurchases
                ? `${totalPurchases} ${
                    totalPurchases > 1 ? 'items' : 'item'
                  } purchased, ${failedPurchases} ${
                    failedPurchases > 1 ? 'items' : 'item'
                  } failed`
                : `${totalPurchases} ${
                    totalPurchases > 1 ? 'items' : 'item'
                  } purchased.`,
              status: failedPurchases ? 'error' : 'success',
              action: (
                <Flex direction="column" css={{ gap: '$1' }}>
                  {currentStep.items?.map((item) => {
                    const txHash = item.txHash
                      ? `${item.txHash.slice(0, 4)}...${item.txHash.slice(-4)}`
                      : ''
                    return (
                      <Anchor
                        href={`${blockExplorerBaseUrl}/tx/${item?.txHash}`}
                        color="primary"
                        weight="medium"
                        target="_blank"
                        css={{ fontSize: 12 }}
                      >
                        View transaction: {txHash}
                      </Anchor>
                    )
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
