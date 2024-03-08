import { useTrendingMints } from '@reservoir0x/reservoir-kit-ui'
import { paths } from '@reservoir0x/reservoir-sdk'
import { Head } from 'components/Head'
import Layout from 'components/Layout'
import ChainToggle from 'components/common/ChainToggle'
import LoadingSpinner from 'components/common/LoadingSpinner'

import QRCode from 'react-qr-code'
import MintTypeSelector, {
  MintTypeOption,
} from 'components/common/MintTypeSelector'
import MintsPeriodDropdown, {
  MintsSortingOption,
} from 'components/common/MintsPeriodDropdown'
import { Box, Flex, Text } from 'components/primitives'
import { MintRankingsTable } from 'components/rankings/MintRankingsTable'
import { ChainContext } from 'context/ChainContextProvider'
import { useMounted } from 'hooks'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { useRouter } from 'next/router'
import { NORMALIZE_ROYALTIES } from 'pages/_app'
import { useContext, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import supportedChains, { DefaultChain } from 'utils/chains'
import fetcher from 'utils/fetcher'

let mint = '0xec673b20ffd1d0cd78f49732fc917efa599b89f0'

const IndexPage: NextPage<any> = ({ ssr }) => {
  const router = useRouter()
  const isSSR = typeof window === 'undefined'
  const isMounted = useMounted()

  const { chain, switchCurrentChain } = useContext(ChainContext)

  useEffect(() => {
    if (router.query.chain) {
      let chainIndex: number | undefined
      for (let i = 0; i < supportedChains.length; i++) {
        if (supportedChains[i].routePrefix == router.query.chain) {
          chainIndex = supportedChains[i].id
        }
      }
      if (chainIndex !== -1 && chainIndex) {
        switchCurrentChain(chainIndex)
      }
    }
  }, [router.query])

  return (
    <Layout>
      <Head />
      <Box
        css={{
          p: 24,
          height: '100%',
          '@bp800': {},

          '@xl': {
            px: '$6',
          },
        }}
      >
        <Flex direction="column" justify="center" align="center">
          <Box>
            <QRCode
              level="L"
              style={{ width: 200, height: 'auto' }}
              value={`evm:mint:11155111:${mint}`}
            />
          </Box>
        </Flex>
      </Box>
    </Layout>
  )
}

export default IndexPage
