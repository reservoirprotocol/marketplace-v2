import { useState, ChangeEvent, KeyboardEvent } from 'react'
import { useTheme } from 'next-themes'
import { useMediaQuery } from 'react-responsive'
import { Text, Flex, Box, Input, Switch, Button } from 'components/primitives'
import Layout from 'components/Layout'
import { StyledInput } from "components/primitives/Input";

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
  const [mintPrice, setMintPrice] = useState('');

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
          <Text style="h4" css={{ lineHeight: 1.2 }}>NFT Launchpad</Text>
          <Text style="subtitle3" css={{ marginTop: isMobile ? 12 : 6, color: '$gray11' }}>
            Deploy your own NFT collection with NFTEarth’s launchpad and managed the collection settings, minting details, metadata, artwork generation, and allowlist, all from the NFTEarth Hub.
          </Text>
          <Box css={{ marginTop: 32 }}>
            <Box css={{ marginBottom: 32 }}>
              <Text style="h6" css={{ color: '$gray11' }}>Name</Text>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Enter the name of your NFT Collection'
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
                placeholder='The token symbol that will show up on block explorers, e.g. TOKEN'
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
                type="number"
                value={supply}
                onChange={(e) => setSupply(e.target.value)}
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
              <Text style="h6" css={{ color: '$gray11' }}>Allowlist Settings</Text>
              <Input
                type="number"
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
                type="number"
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
            <Box css={{ marginBottom: 32 }}>
              <Flex justify="between">
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
              {!isFreeMint && (
                <Box css={{ width: '100%', marginTop: 12 }}>
                  <Text style='subtitle2' css={{ color: '$gray11', fontWeight: 'bold' }}>Mint price</Text>
                  <Box 
                    css={{ 
                      position: 'relative', 
                      width: '100%',
                      '@md': {
                        width: '50%',
                      }
                    }}>
                    <StyledInput
                      type="number"
                      value={mintPrice}
                      placeholder="0"
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => ['e', '+', '-'].includes(e.key) && e.preventDefault()}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setMintPrice(e.target.value)}
                      css={{
                        backgroundColor: theme === 'light' ? '$gray1' : 'initial',
                        marginTop: 6,
                        width: '100%',
                        border: '1px solid $gray8',
                        borderRadius: 6,
                        pr: 32,
                        boxSizing: 'border-box',
                      }}
                    />
                    <Flex
                      align='center' 
                      css={{ 
                        position: 'absolute',
                        bottom: 2,
                        right: 2,
                        padding: '12px 12px',
                        boxSizing: 'border-box',
                        borderTopRightRadius: 6,
                        borderBottomRightRadius: 6,
                        borderLeft: '1px solid $gray10'
                      }}>
                      <Text
                        style='subtitle2' 
                        css={{ 
                          fontWeight: 'bold'
                        }}>
                        ETH
                      </Text>
                    </Flex>
                  </Box>
                </Box>
              )
            }
            </Box>
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
