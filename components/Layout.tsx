import { Box } from 'components/primitives'
import { FC, ReactNode } from 'react'
import Navbar from './navbar'
import { useIsTestnetChain } from 'hooks'
import TestnetChainBanner from './TestnetChainBanner'

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
        }}
      >
        <Box css={{ maxWidth: 4500, mx: 'auto' }}>
          <Navbar />
          <TestnetChainBanner />
          <main>{children}</main>
        </Box>
      </Box>
    </>
  )
}

export default Layout
