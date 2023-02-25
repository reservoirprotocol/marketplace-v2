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
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundColor: '#7B54E9',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
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
            '@initial': 'h4',
            '@lg': 'h2',
          }}
          as="h1"
          css={{
            color: '$whiteA12',
            lineHeight: 1.2,
            fontWeight: 700,
          }}
        >
          {title}
        </Text>
        <Text
          style="subtitle1"
          css={{
            lineHeight: '28px',
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
