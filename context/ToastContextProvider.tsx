import {
  useState,
  createContext,
  SetStateAction,
  Dispatch,
  FC,
  ReactNode,
} from 'react'
import { Provider as ToastProvider } from '@radix-ui/react-toast'

type ToastType = {
  title?: string
  description?: string
  action?: ReactNode
}

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
    setToasts([...toasts, toast])
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, setToasts }}>
      <ToastProvider duration={5000}>{children}</ToastProvider>
    </ToastContext.Provider>
  )
}

export default ToastContextProvider
