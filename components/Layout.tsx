import { Box, Toast } from 'components/primitives'
import Head from 'next/head'
import { FC, ReactNode, useContext } from 'react'
import Navbar from './navbar'
import { ToastContext } from '../context/ToastContextProvider'

type Props = {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  const { toasts } = useContext(ToastContext)

  return (
    <>
      <Box
        css={{
          background: '$neutralBg',
          height: '100%',
          minHeight: '100vh',
          pt: 80,
        }}
      >
        <Box css={{ maxWidth: 1920, mx: 'auto' }}>
          <Navbar />

          <main>{children}</main>
          {toasts.map((toast, idx) => {
            return (
              <Toast
                key={idx}
                title={toast.title}
                description={toast.description}
                action={toast.action}
              />
            )
          })}
        </Box>
      </Box>
    </>
  )
}

export default Layout
