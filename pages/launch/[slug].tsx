import { Box, Flex } from 'components/primitives'
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
        <Flex justify="between">
          <Box>
            <img src="/images/heroSectionBanner.png" />
          </Box>
        </Flex>
      </Box>
    </Layout>
  )
}

export default LaunchPadMint
