import Link from 'next/link'

import { Button, Flex, Grid, Text } from './primitives'
import { FC } from 'react'
import { useTheme } from 'next-themes'

interface IProp {
  hideLink?: boolean
}

const HeroSection: FC<IProp> = ({ hideLink }) => {
  const { theme } = useTheme()

  return (
    <Flex
      as="section"
      css={{
        width: '100%',
        backgroundPosition: 'center center',
        backgroundImage: `linear-gradient(109.6deg, rgb(0, 0, 0) 11.2%, rgb(11, 132, 145) 91.1%), url('/images/heroSectionBanner.png')`,
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
          Buy And Sell NFTs on L2
        </Text>
        <Text
          style="subtitle1"
          css={{ lineHeight: 1.5, color: '$whiteA12', width: '50%' }}
        >
          {`Discover and Create NFTs and earn rewards on Optimism's largest NFT marketplace.`}
        </Text>
        {hideLink ?? (
          <Flex css={{ gap: 10 }}>
            <Link href="/portfolio" passHref legacyBehavior>
              <Button
                as="a"
                color="white"
                corners="pill"
                size="large"
                css={{
                  width: 50,
                  borderRadius: '$lg',
                  justifyContent: 'center',
                }}
              >
                Sell
              </Button>
            </Link>
            <Link href="/explore" passHref legacyBehavior>
              <Button
                as="a"
                color={theme ? (theme === 'dark' ? 'ghost' : 'white') : 'ghost'}
                corners="pill"
                size="large"
                css={{
                  width: 100,
                  borderRadius: '$lg',
                  border: '1px solid $neutralBgSubtle',
                  justifyContent: 'center',
                  '&:hover': {
                    background: '$neutralBgSubtle',
                  },
                }}
              >
                Explore
              </Button>
            </Link>
          </Flex>
        )}
      </Grid>
    </Flex>
  )
}

export default HeroSection
