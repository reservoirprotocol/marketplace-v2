import { Box, Flex, Text } from '../primitives'
import { FC } from 'react'
import { useTheme } from 'next-themes'
import { useMediaQuery } from 'react-responsive'

const LearnHeroSection: FC = () => {
  const { theme } = useTheme()
  const isMobile = useMediaQuery({ query: '(max-width: 968px)' })

  return (
    <Flex
      as="section"
      css={{
        marginBottom: '$4',
        width: '100%',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        backgroundPosition: 'center center',
        backgroundImage: `linear-gradient(109.6deg, rgb(0, 0, 0) 11.2%, $primary13 91.1%), url('/images/heroSectionBanner.png')`,
        '@xs': {
          display: 'block',
        },
        '@bp1000': {
          display: 'flex',
        },
      }}
    >
      <Flex
        direction="column"
        css={{
          flex: 1,
          '@xs': {
            padding: '64px 24px',
          },
          '@lg': {
            padding: '80px 64px',
          },
        }}
      >
        <Text
          css={{ color: '$whiteA12', lineHeight: 1.2 }}
          style={{
            '@initial': 'h3',
            '@lg': 'h1',
          }}
        >
          NFTEarth <br/> Education is Live!
        </Text>
        <Text
          style={{
            '@initial': 'subtitle2',
            '@lg': 'subtitle1',
          }}
          css={{
            lineHeight: 1.5,
            width: '100%',
            marginTop: '$3',
            '@lg': {
              width: '50%',
            },
            color: '$whiteA12',
          }}
        >
          Learn about NFTs, hone your skills and knowledge about NFTs before the
          next bull run to not miss the opportunity!
        </Text>
      </Flex>
      <Box
        css={{
          // backgroundImage: `url(/images/LearnNFT.png)`,
          // backgroundPosition: 'center',
          // backgroundRepeat: 'no-repeat',
          flex: 0.6,
          '@xs': {
          },
          '@md': {
          },
        }}
      >
        {
          isMobile ? <img src="/images/LearnNFT.png" style={{
          marginTop: '-50px',
          height: '200px',
          }} /> : <img src="/images/LearnNFT.png" style={{
            marginTop: '-50px',
          }} />
      }
      </Box>
    </Flex>
  )
}

export default LearnHeroSection
