import { Box } from 'components/primitives'
import { FC, ReactNode } from 'react'
import Navbar from './navbar'
import { useTheme } from 'next-themes'

type Props = {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  const { theme } = useTheme()

  return (
    <>
      <Box
        css={{
          background:
            theme == 'dark'
              ? 'radial-gradient(circle at 24.1% 68.8%, rgb(50, 50, 50) 0%, $neutralBg 99.4%);'
              : '$neutralBg',
          height: '100%',
          minHeight: '100vh',
          pt: 80,
        }}
      >
        <Box css={{ maxWidth: 1920, mx: 'auto' }}>
          <Navbar />
          <main>{children}</main>
        </Box>
      </Box>
    </>
  )
}

export default Layout
