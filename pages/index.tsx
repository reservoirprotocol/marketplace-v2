import { NextPage } from 'next'
import Box from '../components/primitives/Box'
import Flex from '../components/primitives/Flex'
import Text from '../components/primitives/Text'
import Button from 'components/primitives/Button'
import TrendingCollectionsList from 'components/home/TrendingCollectionsList'
import Layout from 'components/Layout'
import { useAccount } from 'wagmi'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import { useMounted } from 'hooks'

const IndexPage: NextPage = () => {
  const { isConnected } = useAccount()
  const mounted = useMounted()

  return (
    <Layout>
      <Box css={{ padding: '$6', height: '100%' }}>
        {mounted && isConnected && (
          <Flex css={{ textAlign: 'center' }} align="center" direction="column">
            <Text style="h2" css={{ mb: '$4', mt: '$4', fontSize: 42 }} as="h2">
              Discover, Buy, and Sell NFTs
            </Text>
          </Flex>
        )}
        {mounted && !isConnected && (
          <Flex css={{ textAlign: 'center' }} align="center" direction="column">
            <Text style="h2" css={{ mb: '$4', mt: '$6', fontSize: 58 }} as="h2">
              Discover, Buy, and Sell NFTs
            </Text>

            <Text
              style="body1"
              css={{ mb: '$5', color: '$gray11', fontSize: 22, maxWidth: 520 }}
              as="h2"
            >
              The first royalty compliant aggregator supporting the new nft
              ecosystem
            </Text>
            <Flex css={{ gap: '$4', pt: '$4', pb: '$5' }} justify="center">
              <ConnectWalletButton />
              <a href="https://docs.reservoir.tools/docs" target="_blank">
                <Button
                  css={{ background: '$gray4' }}
                  corners="pill"
                  color="secondary"
                  size="large"
                >
                  Open API Docs
                </Button>
              </a>
            </Flex>
          </Flex>
        )}
        <Box css={{ my: '$6' }}>
          <Text style="h4" as="h4" css={{ mb: '$5' }}>
            Trending Collections
          </Text>
          <TrendingCollectionsList />
        </Box>
      </Box>
    </Layout>
  )
}

export default IndexPage
