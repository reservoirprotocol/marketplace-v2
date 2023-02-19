import {  Flex, Grid, Text } from 'components/primitives'

type Props = {
  title: string
  description: string
  image?: string
}

export const ClaimRewardHeroBanner = ({ title, description, image }: Props) => {
  return (
    <Flex
      as="section"
      css={{
        width: '100%',
        borderRadius: '20px',
        backgroundPosition: 'center center',
        backgroundImage: `linear-gradient(112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%);`,
        backgroundColor: '#7B54E9',
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
          {title}
        </Text>
        <Text
          style="subtitle1"
          css={{
            lineHeight: 1.5,
            color: '$whiteA12',
            width: '100%',
            '@lg': { width: '50%' },
          }}
        >
          {description}
        </Text>
      </Grid>
    </Flex>
  )
}
