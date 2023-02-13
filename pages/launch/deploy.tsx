import { useState } from 'react'
import { useTheme } from 'next-themes'
import { useMediaQuery } from 'react-responsive'
import { Text, Flex, Box, Input, Switch, Button } from 'components/primitives'
import Layout from 'components/Layout'

const LaunchPadDeployPage = () => {
  const { theme } = useTheme();
  const isMobile = useMediaQuery({ query: '(max-width: 960px)' });

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [supply, setSupply] = useState('');
  const [allowListMint, setAllowListMint] = useState('');
  const [publicMint, setPublicMint] = useState('');
  const [isFreeMint, setIsFreeMint] = useState(true);
  const [isReserveTokens, setIsReserveTokens] = useState(false);

  return (
    <Layout>
      <Box
        css={{
          p: 14,
          height: '100%',
          '@bp800': {
            p: '$5',
          },
        }}
      >
        <Flex 
          justify="center" 
          direction="column" 
          css={{
            width: isMobile ? '100%' : '50%',
            backgroundColor: isMobile ? 'transparent' : '$gray3',
            borderRadius: 10,
            padding: isMobile ? 8 : 24,
            margin: '0 auto'
          }}>
          <Text style="h4" css={{ lineHeight: 1.2 }}>Launchpad Contract Deployer</Text>
          <Text style="subtitle3" css={{ marginTop: isMobile ? 12 : 6, color: '$gray11' }}>
            Deploy your own ERC-721 smart contract and manage collection settings, minting, metadata, and allowlist on NFTEarth.
          </Text>
          <Box css={{ marginTop: 32 }}>
            <Box css={{ marginBottom: 32 }}>
              <Text style="h6" css={{ color: '$gray11' }}>Name</Text>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Enter a name for the collection'
                css={{ backgroundColor: theme === 'light' ? '$gray1' : 'initial' }}
                containerCss={{
                  marginTop: 6,
                  width: '100%',
                  border: '1px solid $gray8',
                  borderRadius: 6,
                }}
              />
            </Box>
            <Box css={{ marginBottom: 32 }}>
              <Text style="h6" css={{ color: '$gray11' }}>Symbol</Text>
              <Input
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder='Enter a short symbol for the collection, e.g. SYMBL'
                css={{ backgroundColor: theme === 'light' ? '$gray1' : 'initial' }}
                containerCss={{
                  marginTop: 6,
                  width: '100%',
                  border: '1px solid $gray8',
                  borderRadius: 6
                }}
              />
            </Box>
            <Box css={{ marginBottom: 32 }}>
              <Text style="h6" css={{ color: '$gray11' }}>Supply</Text>
              <Input
                value={supply}
                onChange={(e) => setSupply(e.target.value)}
                placeholder='Set the maximum number of tokens'
                css={{ backgroundColor: theme === 'light' ? '$gray1' : 'initial' }}
                containerCss={{
                  marginTop: 6,
                  width: '100%',
                  border: '1px solid $gray8',
                  borderRadius: 6
                }}
              />
            </Box>
            <Box css={{ marginBottom: 32 }}>
              <Text style="h6" css={{ color: '$gray11' }}>Allowlist mint</Text>
              <Input
                value={allowListMint}
                onChange={(e) => setAllowListMint(e.target.value)}
                placeholder='Set the max tokens allowed per wallet'
                css={{ backgroundColor: theme === 'light' ? '$gray1' : 'initial' }}
                containerCss={{
                  marginTop: 6,
                  width: '100%',
                  border: '1px solid $gray8',
                  borderRadius: 6
                }}
              />
            </Box>
            <Box css={{ marginBottom: 32 }}>
              <Text style="h6" css={{ color: '$gray11' }}>Public mint</Text>
              <Input
                value={publicMint}
                onChange={(e) => setPublicMint(e.target.value)}
                placeholder='Set the max tokens allowed per wallet'
                css={{ backgroundColor: theme === 'light' ? '$gray1' : 'initial' }}
                containerCss={{
                  marginTop: 6,
                  width: '100%',
                  border: '1px solid $gray8',
                  borderRadius: 6
                }}
              />
            </Box>
            <Flex css={{ marginBottom: 32 }} justify="between">
              <Flex direction="column">
                <Text style="h6" css={{ color: '$gray11' }}>Free mint</Text>
                <Text style="subtitle3" css={{ color: '$gray11', marginTop: 6 }}>NFTEarth Launchpad currently only supports free-to-mint projects</Text>
              </Flex>
              <Box>
                <Switch
                  checked={isFreeMint}
                  onCheckedChange={checked => setIsFreeMint(checked)}
                />
              </Box>
            </Flex>
            <Flex css={{ marginBottom: 32 }} justify="between">
              <Flex direction="column">
                <Text style="h6" css={{ color: '$gray11' }}>Reserve tokens</Text>
                <Text style="subtitle3" css={{ color: '$gray11', marginTop: 6 }}>Allow the contract owner to mint a token reserve seperate from the allowlist mint</Text>
              </Flex>
              <Box>
                <Switch
                  checked={isReserveTokens}
                  onCheckedChange={checked => setIsReserveTokens(checked)}
                />
              </Box>
            </Flex>
          </Box>
          <Button 
            css={{
              marginTop: 8,
              justifyContent: 'center',
              alignItems: 'center',
              justifyItems: 'center',
              px: '$6',
              py: '$3',
            }}
            type="button"
            size="small"
            color="primary">
            Deploy Contract
          </Button>
        </Flex>
      </Box>
    </Layout>
  )
}

export default LaunchPadDeployPage
