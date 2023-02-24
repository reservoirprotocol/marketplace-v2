import Link from 'next/link'

import { Button, Flex, Text } from '../primitives'
import { FC } from 'react'
import { useTheme } from 'next-themes'

interface IProp {
  hideLink?: boolean
}

const LearnHeroSection: FC<IProp> = ({ hideLink }) => {
  const { theme } = useTheme()

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
      <Flex
        css={{
          textAlign: 'center',
          flexDirection: 'column',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Text
          as="h1"
          css={{
            marginLeft: 'auto',
            marginRight: 'auto',
            color: '$whiteA12',
            lineHeight: 1.2,
          }}
          style="h1"
        >
          NFTEarth Education is Live!
        </Text>
        <Text
          style="subtitle1"
          css={{
            lineHeight: 1.5,
            color: '$whiteA12',
            width: '100%',
            marginTop: '$3',
            marginLeft: 'auto',
            marginRight: 'auto',
            '@lg': { width: '50%' },
          }}
        >
          Learn about NFTs, hone your skills and knowledge about NFTs before the
          next bull run to not miss the opportunity!
        </Text>
        {hideLink ?? (
          <Flex css={{ gap: 10 }}>
            <Link href="/portfolio" passHref legacyBehavior>
              <Button
                as="a"
                color={
                  theme ? (theme === 'dark' ? 'ghost' : 'primary') : 'ghost'
                }
                corners="pill"
                size="large"
                css={{
                  width: 100,
                  borderRadius: '$lg',
                  justifyContent: 'center',
                  border: '2px solid #6BE481',
                  '&:hover': {
                    background: '#6BE481',
                    color: 'black',
                  },
                }}
              >
                Sell
              </Button>
            </Link>
            <Link href="/explore" passHref legacyBehavior>
              <Button
                as="a"
                color={
                  theme ? (theme === 'dark' ? 'ghost' : 'primary') : 'ghost'
                }
                corners="pill"
                size="large"
                css={{
                  width: 100,
                  borderRadius: '$lg',
                  border: '2px solid #6BE481',
                  justifyContent: 'center',
                  '&:hover': {
                    background: '#6BE481',
                    color: 'black',
                  },
                }}
              >
                Explore
              </Button>
            </Link>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}

export default LearnHeroSection
