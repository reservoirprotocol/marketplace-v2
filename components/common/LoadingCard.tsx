import { keyframes } from '@stitches/react'
import { Box, Flex } from 'components/primitives'

const pulse = keyframes({
  '0%': { backgroundColor: '$gray6' },
  '50%': { backgroundColor: '$gray8' },
  '100%': { backgroundColor: '$gray6' },
})

const LoadingCard = () => {
  return (
    <Flex
      direction="column"
      justify="end"
      css={{
        borderRadius: 8,
        overflow: 'hidden',
        background: '$gray6',
        height: '100%',
        minHeight: 332,
        '@md': {
          minHeight: 372,
        },
      }}
    >
      <Flex
        css={{ background: '$gray4', p: '$4', height: 132 }}
        direction="column"
      >
        <Flex
          css={{ mb: '$4', height: '100%' }}
          align="center"
          justify="between"
        >
          <Box
            css={{
              height: 20,
              width: 120,
              background: '$gray6',
              animation: `${pulse} 2s ease-in infinite`,
            }}
          ></Box>
          <Box
            css={{
              height: 20,
              width: 40,
              background: '$gray6',
              animation: `${pulse} 2s ease-in infinite`,
            }}
          ></Box>
        </Flex>
        <Flex
          css={{ mb: '$4', height: '100%' }}
          align="center"
          justify="between"
        >
          <Box
            css={{
              height: 20,
              width: 60,
              background: '$gray6',
              animation: `${pulse} 2s ease-in infinite`,
            }}
          ></Box>
          <Box
            css={{
              height: 20,
              width: 20,
              background: '$gray6',
              animation: `${pulse} 2s ease-in infinite`,
            }}
          ></Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default LoadingCard
