import Link from 'next/link'

import {Button, Flex, Grid, Text} from "./primitives";

const HeroSection = () => {
  return (
    <Flex as="section" className="board">
      <Grid css={{ gap: 32, flex: 0.5 }}>
        <Text style={{
          '@initial': 'h3',
          '@lg': 'h1',
        }} as="h1" css={{ color: '$whiteA12', lineHeight: 1.2 }}>Buy And Sell NFTs on L2</Text>
        <Text style="subtitle1" css={{ lineHeight: 1.5, color: '$whiteA12' }}>
          {`Discover and Create NFTs and earn rewards on Optimism's largest NFT marketplace.`}
        </Text>
        <Link href="/explore">
          <Button
            color="white"
            corners="pill"
            size="large"
            css={{
              width: 280,
              justifyContent: 'center'
            }}
          >Explore NFTs</Button>
        </Link>
      </Grid>
    </Flex>
  )
}

export default HeroSection
