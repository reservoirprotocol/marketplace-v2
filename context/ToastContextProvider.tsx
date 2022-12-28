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

export const ToastContext = createContext<{
  toasts: Array<ReactNode>
  setToasts: Dispatch<SetStateAction<Array<ReactNode>>> | null
  addToast: ((toast: ReactNode) => void) | null
}>({
  toasts: [],
  setToasts: null,
  addToast: null,
})

const ToastContextProvider: FC<any> = ({ children }) => {
  const [toasts, setToasts] = useState<Array<ReactNode>>([])

  const addToast = (toast: ReactNode) => {
    setToasts([...toasts, toast])
  }

  useEffect(() => {
    toasts.map((toast) => toast)
  }, [toasts])

  return (
    <ToastContext.Provider value={{ toasts, addToast, setToasts }}>
      <ToastProvider duration={5000}>{children}</ToastProvider>
    </ToastContext.Provider>
  )
}

export default ToastContextProvider
