import { Flex, Grid, Text } from '../primitives'
import { FC } from 'react'

const QuestsSection: FC = () => {

  return (
    <Flex
      as="section"
      css={{
        width: '100%',
        backgroundPosition: 'center center',
        backgroundImage: `linear-gradient(109.6deg, rgb(0, 0, 0) 11.2%, $primary13 91.1%), url('/images/heroSectionBanner.png')`,
        '@xs': {
          gridTemplateColumns: 'unset',
          padding: '64px 24px',
        },
        '@lg': {
          gridTemplateColumns: 'repeat(2, 1fr)',
          padding: '100px 64px',
        },
      }}
    >
      <Grid
        css={{
          gap: 32,
          '@xs': {
            flex: 1,
          },
          '@lg': {
            flex: 0.5,
          },
        }}
      >
        <Text
          style={{
            '@initial': 'h2',
            '@lg': 'h1',
          }}
          as="h1"
          css={{ color: '$whiteA12', lineHeight: 1.2 }}
        >
          Let the Quest begin!
        </Text>
      </Grid>
    </Flex>
  )
}

export default QuestsSection