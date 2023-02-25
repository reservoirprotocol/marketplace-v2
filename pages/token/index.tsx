import { NextPage } from 'next'
import { Text, Box } from 'components/primitives'
import Layout from 'components/Layout'

const TokenPage: NextPage = () => {
  return (
    <Layout>
      <Box
        css={{
          p: 24,
          height: 'calc(100vh - 80px)',
          '@bp800': {
            p: '$6',
          },
        }}
      >
        <Box
          css={{
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '$3',
            marginLeft: '25vw',
            marginBottom: '$5',
          }}
        >
          <Text
            as="h1"
            css={{
              textAlign: 'center',
              fontWeight: 700,
              color: '$white',
              fontSize: '45px',
            }}
          >
            NFTEarth Token Price
          </Text>{' '}
          <img
            src="/nftearth-icon-new.png"
            style={{
              width: 40,
              height: 40,
              alignItems: 'center',
              alignSelf: 'center',
            }}
          />
        </Box>

        <Box id="dexscreener-embed" css={{ height: '70vh' }}>
          <iframe
            height="100%"
            width="100%"
            src="https://dexscreener.com/optimism/0x3C8fa6585080BD35Cf0AF2152225D45e027E6699?embed=1&theme=dark"
          ></iframe>
        </Box>
      </Box>
    </Layout>
  )
}

export default TokenPage
