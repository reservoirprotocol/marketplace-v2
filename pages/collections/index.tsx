import { Text, Flex, Box } from 'components/primitives'
import { useMediaQuery } from 'react-responsive'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderBlank } from '@fortawesome/free-solid-svg-icons'
import Layout from 'components/Layout'

const MyCollectionsPage = () => {
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
        <Flex direction='column'>
          <Text style="h4">My Collections</Text>
          <Text style="subtitle2" css={{ marginTop: 4, color: '$gray11' }}>
            Create, curate, and manage collections of unique NFTs to share and sell.
          </Text>
        </Flex>
        <Flex 
          direction='column' 
          justify='center' 
          css={{ 
            width: '100%',
            marginTop: 80
          }}>
          <Flex 
            justify='center' 
            css={{ 
              color: '$gray8', 
              fontSize: 80 
            }}>
            <FontAwesomeIcon icon={faFolderBlank} />
          </Flex>
          <Text 
            style="subtitle2" 
            css={{ 
              marginTop: 12, 
              color: '$gray8', 
              textAlign: 'center' 
            }}>
            You dont have any collections.</Text>
        </Flex>
      </Box>
    </Layout>
  )
}

export default MyCollectionsPage
