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
      <Box css={{
        marginTop: '-50px',
        '@xs': {
          margin: '0 auto',
        },
        '@bp1000': {
          margin: 0,
        },
      }}>
        <img src="/images/Quests_1.png" />
      </Box>
        <Text
          style={{
            '@initial': 'h3',
            '@md': 'h2',
            '@lg': 'h1',
          }}
          as="h1"
          css={{
            color: '$whiteA12',
            lineHeight: 1.2,
            '@xs': {
              textAlign: 'center',
              marginBottom: '$5',
            },
            '@bp1000': {
              margin: 'auto',
              textAlign: 'left',
            },
          }}
        >
          Let the Quest begin!
      </Text>
      <Box css={{
        marginTop: '-50px',
        '@xs': {
          display: 'none',
        },
        '@bp1400': {
          display: 'block'
        },
      }}>
        <img src="/images/Quests_2.png" />
      </Box>
    </Flex>
  )
}

export default QuestsSection