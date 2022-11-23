import { NextPage } from 'next'
import Box from '../components/primitives/Box'
import Flex from '../components/primitives/Flex'
import Text from '../components/primitives/Text'
import Button from 'components/primitives/Button'

import TrendingCollectionsList from 'components/TrendingCollectionsList'
import AppsList from 'components/AppsList'

import Layout from 'components/Layout'
import { useAccount } from 'wagmi'
// function that takes an array of dates and returns the closest date to another given date
const getClosestDate = (dates: Date[], date: Date) => {
  return dates.reduce((prev, curr) => {
    return Math.abs(curr.getTime() - date.getTime()) <
      Math.abs(prev.getTime() - date.getTime())
      ? curr
      : prev
  })
}

const IndexPage: NextPage = () => {
  const account = useAccount()

  return (
    <Layout>
      {false && (
        <Flex
          align="center"
          css={{
            width: '100%',
            position: 'fixed',
            bottom: 0,
            gap: '$5',
            px: '$5',
            background: '$gray2',
            py: '$4',
            overflow: 'hidden',

            borderTop: '1px solid $gray5',
            '& img': {
              height: 18,
            },
          }}
        >
          <Box
            css={{
              minWidth: 20,
              minHeight: 20,
              ml: 6,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 2,
              '& div': {
                background: '$gray9',
                borderRadius: 1,
              },
            }}
          >
            <Box />
            <Box />
            <Box />
            <Box />
            <Box />
            <Box />
            <Box />
            <Box />
            <Box />
          </Box>
          <img src="/coinbase.png" />
          <img src="/Ens.png" />
          <img src="/soundxyz 1.png" />
          <img src="/artblocks.png" />
          <img src="/dune.png" />
          <img src="/upshot.png" />
          <img src="/nftgo.png" />
          <img src="/nftnerds.png" />
          <img src="/forgotten runes.png" />
          <img src="/gmoney.png" />
          <img src="/parcel.png" />
        </Flex>
      )}
      <Box css={{ padding: '$6', height: '100%' }}>
        {account && account.address ? (
          <Flex css={{ textAlign: 'center' }} align="center" direction="column">
            <Text style="h2" css={{ mb: '$4', mt: '$4', fontSize: 42 }} as="h2">
              Discover, Buy, and Sell NFTs
            </Text>
          </Flex>
        ) : (
          <Flex css={{ textAlign: 'center' }} align="center" direction="column">
            <Text style="h2" css={{ mb: '$4', mt: '$6', fontSize: 58 }} as="h2">
              Discover, Buy, and Sell NFTs The first royalty compliant
              aggregator for NFTs on Ethereum and Polygon.
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
              <Button corners="pill" size="large">
                Connect Your Wallet
              </Button>
              <Button
                css={{ background: '$gray4' }}
                corners="pill"
                color="secondary"
                size="large"
              >
                Open API Docs
              </Button>
            </Flex>
          </Flex>
        )}
        <Box css={{ my: '$6' }}>
          <Text style="h4" as="h4" css={{ mb: '$5' }}>
            Trending Collections
          </Text>
          <TrendingCollectionsList />
        </Box>

        <Box css={{ pb: '$6' }}>
          <Text style="h4" as="h4" css={{ mb: '$5' }}>
            Featured Apps
          </Text>
          <AppsList />
        </Box>
      </Box>
    </Layout>
  )
}

export default IndexPage
