import { NextPage } from 'next'
import { Text, Flex, Box } from 'components/primitives'
import Layout from 'components/Layout'
import { useMounted } from 'hooks'
import { LearnGrid } from 'components/learn-nfts/LearnGrid'
import LearnHeroSection from 'components/learn-nfts/LearnHeroSection'
import LearnCarousel from 'components/learn-nfts/LearnCarousel'
import { BoxIcon } from '@radix-ui/react-icons'

const EducationPage: NextPage = () => {
  const isMounted = useMounted()

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
        <LearnHeroSection />
        <Box
          css={{
            marginBottom: '$4',
            '@xs': {
              textAlign: 'center'
            },
            '@lg': {
              textAlign: 'left'
            }
          }}>
          <Text
            style={{
              '@initial': 'h5',
              '@md': 'h3',
            }}
          >
            Choose what you would like to learn about NFTs
          </Text>
        </Box>
        {isMounted && <LearnGrid />}
      </Box>
      <Flex
        justify="between"
        css={{
          borderTop: '1px solid $gray7',
          borderStyle: 'solid',
          p: '$2',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 36,
          '@bp600': {
            flexDirection: 'row',
            gap: 0,
          },
        }}
      >
        <Flex justify="between" css={{
          p: '10px 60px',
          alignItems: 'center',
          '@xs': {
            display: 'block',
            textAlign: 'center',
          },
          '@bp1000': {
            display: 'flex',
            textAlign: 'left',
          }
        }}>
          <Box css={{
            width: '40%',
            '@xs': {
              margin: 'auto',
              width: '100%',
            },
            '@bp1000': {
              margin: '0 0',
              width: '40%',
            }
          }}>
            <Box css={{ marginBottom: '$3' }}>
              <Text
                style={{
                  '@initial': 'h4',
                  '@lg': 'h3'
                }}
              >
                About NFTEarth Education
              </Text>
            </Box>
            <Text style={{
                '@initial': 'subtitle2',
                '@lg': 'subtitle1'
              }}
              css={{ marginBottom: '$2' }}
            >
              NFTEarth Education is a free knowledge base covering everything
              you need to know about NFTs, from basic to more advanced topics.
              Utilize our expertise to get up to speed and feel confident
              about diving headfirst into the world of NFTs.
            </Text>
          </Box>
          <Box>
            <img src="/images/LearnNFT_book.png" style={{ margin: 'auto'}} />
          </Box>
        </Flex>
      </Flex>
    </Layout>
  )
}

export default EducationPage
