import { Text, Flex, Box } from 'components/primitives'
import { useMediaQuery } from 'react-responsive'
import Layout from 'components/Layout'

const LaunchPadPage = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 960px)' })

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
        <Flex 
          align='center'
          justify='center'
          direction='column'
          css={{
            height: '100%',
            width: '100%',
          }}>
          <Text
            style={{
              '@initial': 'h3',
              '@lg': 'h2',
            }}
            css={{ lineHeight: 1.2, letterSpacing: 2, color: '$gray10' }}
          >
            COMING SOON
          </Text>
          <Text css={{ color: '$gray10' }}>
            This page is under construction
          </Text>
        </Flex>
      </Box>
    </Layout>
  )
}

export default LaunchPadPage