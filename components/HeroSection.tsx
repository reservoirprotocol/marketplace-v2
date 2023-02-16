import Link from 'next/link'

import { Button, Flex, Grid, Text } from './primitives'
import {FC} from "react";

interface IProp {
  hideLink?: boolean
}

const HeroSection: FC<IProp> = ({ hideLink }) => {
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
      <Grid css={{
        gap: 32,
        '@xs': {
          flex: 1
        },
        '@lg': {
          flex: 0.5
        }
      }}>
        <Text
          style={{
            '@initial': 'h3',
            '@lg': 'h1',
          }}
          as="h1"
          css={{ color: '$whiteA12', lineHeight: 1.2 }}
        >
          Buy And Sell NFTs on L2
        </Text>
        <Text style="subtitle1" css={{ lineHeight: 1.5, color: '$whiteA12' }}>
          {`Discover and Create NFTs and earn rewards on Optimism's largest NFT marketplace.`}
        </Text>
        {hideLink ?? (
          <Link href="/explore" passHref legacyBehavior>
            <Button
              as="a"
              color="white"
              corners="pill"
              size="large"
              css={{
                width: 280,
                justifyContent: 'center',
              }}
            >
              Explore NFTs
            </Button>
          </Link>
        )}
      </Grid>
    </Flex>
  )
}

export default HeroSection
