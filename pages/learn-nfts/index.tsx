import { NextPage } from 'next'
import { Text, Flex, Box } from 'components/primitives'
import Layout from 'components/Layout'
import { useEffect, useRef } from 'react'
import { useMarketplaceChain, useMounted } from 'hooks'
import { useCollections } from '@nftearth/reservoir-kit-ui'
import { NORMALIZE_ROYALTIES } from '../_app'
import { useIntersectionObserver } from 'usehooks-ts'
import { LearnGrid } from 'components/learn-nfts/LearnGrid'
import LearnHeroSection from 'components/learn-nfts/LearnHeroSection'

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
        <LearnHeroSection hideLink />
        <Flex css={{ my: '$6', gap: 65 }} direction="column">
          <Flex
            justify="between"
            align="start"
            css={{
              flexDirection: 'column',
              gap: 24,
              '@bp800': {
                alignItems: 'center',
                flexDirection: 'row',
              },
            }}
          ></Flex>
          <Box>
            <Text
              css={{ marginBottom: '15px', marginLeft: '5px' }}
              style="h3"
              as="h3"
            >
              Choose what you would like to learn about NFTs
            </Text>
            {isMounted && <LearnGrid />}
          </Box>
        </Flex>
      </Box>
      <Flex
        justify="between"
        css={{
          borderTop: '1px solid $gray7',
          borderStyle: 'solid',
          pt: '$5',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 36,
          '@bp600': {
            flexDirection: 'row',
            gap: 0,
          },
        }}
      >
        <Flex css={{ gap: 80, '@bp600': { gap: 136 } }}>
          <Flex direction="column" css={{ padding: '$5' }}>
            <Box css={{ width: '40%' }}>
              <Text
                css={{ marginBottom: '15px', marginLeft: '5px' }}
                style="h4"
                as="h4"
              >
                About NFTEarth Education
              </Text>
              <Text css={{ marginBottom: '15px', marginLeft: '5px' }}>
                NFTEarth Education is a free knowledge base covering everything
                you need to know about NFTs, from basic to more advanced topics.
                Utilize our expertise to get up to speed and feel confident
                about diving headfirst into the world of NFTs.
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  )
}

export default EducationPage
