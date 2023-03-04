import { Flex, Box, Text } from '../primitives'
import { FC } from 'react'

const QuestsSection: FC = () => {
  return (
    <Flex
      as="section"
      css={{
        width: '100%',
        backgroundPosition: 'center center',
        flexWrap: 'wrap',
        backgroundImage: `linear-gradient(109.6deg, rgb(0, 0, 0) 11.2%, $primary13 91.1%), url('/images/heroSectionBanner.png')`,
        borderRadius: '16px',
        '@xs': {
          padding: '0 50px',
        },
        '@lg': {
          padding: '0 70px',
        },
      }}
    >
      <Box
        css={{
          marginTop: '-50px',
          '@xs': {
            margin: '0 auto',
          },
          '@bp1000': {
            margin: 0,
          },
        }}
      >
        <img src="/images/Quests_1.png" />
      </Box>

      <Flex
        direction="column"
        css={{ marginLeft: 'auto', marginRight: 'auto', alignItems: 'center' }}
      >
        <Text
          css={{
            color: '$whiteA12',
            lineHeight: 1.2,
            '@xs': {
              textAlign: 'center',
              marginTop: '100px',

              fontSize: '40px',
              fontWeight: '700',
            },
            '@sm': {
              fontSize: '50px',
            },
            '@bp900': {
              fontSize: '60px',
              fontWeight: '700',
            },
          }}
        >
          NFTEarth Quests
        </Text>
        <Text
          style="subtitle1"
          css={{
            lineHeight: 1.5,
            color: '$whiteA12',
            width: '100%',
            textAlign: 'center',
            marginTop: '$4',
            '@lg': { width: '100%' },
          }}
        >
          Complete quests and tasks, earn XP and rewards!
        </Text>
      </Flex>

      <Box
        css={{
          marginTop: '-50px',
          '@xs': {
            display: 'none',
          },
          '@bp1400': {
            display: 'block',
          },
        }}
      >
        <img src="/images/Quests_2.png" />
      </Box>
    </Flex>
  )
}

export default QuestsSection
