import { Box } from 'components/primitives'
import { FC, ReactNode } from 'react'
import Navbar from './navbar'
import UnsupportedChainBanner from './UnsupportedChainBanner'

type Props = {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <Box
        css={{
          background: '$neutralBg',
          height: '100%',
          minHeight: '100vh',
          pt: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box css={{ width: '100%', maxWidth: 1200, px: '$4' }}>
          <Navbar />
          <UnsupportedChainBanner />
          <main>{children}</main>
        </Box>
      </Box>
    </>
  )
}

export default Layout
