import { Box } from 'components/primitives'
import Layout from 'components/Layout'

const LaunchPadMint = () => {
  return (
    <Layout>
      <Box
        css={{
          p: 24,
          height: '100%',
          '@bp800': {
            p: '$6',
          },
        }}
      >
        <div>Launchpad Mint</div>
      </Box>
    </Layout>
  )
}

export default LaunchPadMint
