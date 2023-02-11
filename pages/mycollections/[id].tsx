import { Text, Flex, Box } from 'components/primitives'
import { useMediaQuery } from 'react-responsive'
import Layout from 'components/Layout'

const MyCollectionDetailPage = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 960px)' })

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
        <div>My Collection Detail</div>
      </Box>
    </Layout>
  )
}

export default MyCollectionDetailPage
