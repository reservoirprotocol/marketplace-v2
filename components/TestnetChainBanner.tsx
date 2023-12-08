import Link from 'next/link'
import { Flex, Text } from './primitives'
import { useIsTestnetChain } from 'hooks'

const TestnetChainBanner = (): JSX.Element => {
  const { name, isTestnetChain } = useIsTestnetChain()
  return (
    <>
      {isTestnetChain && (
        <Flex
          css={{
            px: '40px',
            py: '12px',
            alignItems: 'center',
            background: '$violet9',
          }}
        >
          <Text
            style="body2"
            css={{
              color: 'White',
            }}
          >
            Your wallet is currently connected to a testnet. To trade on
            testnets, switch to
          </Text>
          <Link
            style={{
              marginLeft: '2px',
            }}
            href="https://testnets.reservoir.tools/sepolia"
          >
            <Text>testnets.reservoir.tools</Text>
          </Link>
        </Flex>
      )}
    </>
  )
}

export default TestnetChainBanner
