import Link from 'next/link'
import { Flex, Text } from './primitives'
import { useIsUnsupportedChain } from 'hooks'
import { useTheme } from 'next-themes'

const UnsupportedChainBanner = (): JSX.Element => {
  const { unsupportedChain, isTestnetDeployment } = useIsUnsupportedChain()

  const { theme } = useTheme()

  return (
    <>
      {unsupportedChain && (
        <Flex
          css={{
            px: '40px',
            py: '12px',
            background: theme === 'dark' ? '$violet6' : '$violet9',
          }}
        >
          <Text
            style="body2"
            css={{
              color: 'White',
            }}
          >
            <>
              Your wallet is currently connected to the{' '}
              {isTestnetDeployment ? 'testnet' : 'mainnet'}{' '}
              {unsupportedChain.name}. To trade on a{' '}
              {isTestnetDeployment ? 'testnet' : 'mainnet'}, switch to{' '}
              <Link
                href={
                  isTestnetDeployment
                    ? 'https://testnets.reservoir.tools/'
                    : 'https://explorer.reservoir.tools/'
                }
              >
                <Text
                  css={{
                    color: 'White',
                    textDecoration: 'underline',
                  }}
                  style="body2"
                >
                  {isTestnetDeployment
                    ? 'testnets.reservoir.tools'
                    : 'explorer.reservoir.tools'}
                </Text>
              </Link>
            </>
          </Text>
        </Flex>
      )}
    </>
  )
}

export default UnsupportedChainBanner
