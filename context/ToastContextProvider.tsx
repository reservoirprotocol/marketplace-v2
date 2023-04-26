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

type ToastType = {
  id?: string
  title?: string
  description?: string
  action?: ReactNode
  status?: 'success' | 'error'
}

export type Path = NonNullable<Execute['path']>[0]

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
    console.log(toast)
    toast.id = uuidv4()

    setToasts([...toasts, toast])
  }

  const client = useReservoirClient()

  useEffect(() => {
    let eventListener: any
    if (client) {
      eventListener = client.addEventListener((event, chainId) => {
        console.log(event, chainId)

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

        switch (event.name) {
          case 'purchase_error':
            addToast?.({
              title: 'Purchase Failure',
              description: event.data.error
                ? event.data.error
                : 'Failed to complete purchase',
            })
            break

          case 'purchase_complete':
            console.log('adding complete toast')
            addToast?.({
              title: 'Purchase Complete',
              description: event.data.error
                ? event.data.error
                : 'Successfully completed purchase',
              // action: (
              //   <Flex direction="column">
              //     {event.data?.steps?.items?.map((item) => {
              //       const txHash = item.txHash
              //         ? `${item.txHash.slice(0, 4)}...${item.txHash.slice(-4)}`
              //         : ''
              //       return (
              //         <Anchor
              //           href={`${blockExplorerBaseUrl}/tx/${item?.txHash}`}
              //           color="primary"
              //           weight="medium"
              //           target="_blank"
              //           css={{ fontSize: 12 }}
              //         >
              //           View transaction: {txHash}
              //         </Anchor>
              //       )
              //     })}
              //   </Flex>
              // ),
            })
            break
        }
        // addToast?.({
        //   title: 'Event',
        //   description: '',
        // })
      })
    }
    return () => {
      client?.removeEventListener(eventListener)
    }
  }, [client])

  return (
    <ToastContext.Provider value={{ toasts, addToast, setToasts }}>
      {/* <ToastProvider duration={5000}> */}
      <ToastProvider duration={5000}>
        {children}
        {/* <Toast
          key={'test'}
          title={'Purchase successful'}
          // description={'Sorry, the purchased failed'}
          status="success"
          action={
            <Anchor
              color="primary"
              weight="medium"
              css={{ fontSize: 14 }}
              href="reservoir.tools"
              target="_blank"
            >
              View transaction
            </Anchor>
          }
        /> */}
        {toasts.map((toast, idx) => {
          return (
            <Toast
              key={idx}
              id={toast.id}
              title={toast.title}
              description={toast.description}
              action={toast.action}
            />
          )
        })}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  )
}

export default ToastContextProvider
