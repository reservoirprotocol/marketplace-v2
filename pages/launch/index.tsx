import {useState, ChangeEvent, KeyboardEvent, useMemo} from 'react'
import { useTheme } from 'next-themes'
import { useMediaQuery } from 'react-responsive'
import { Text, Flex, Box, Input, Switch, Button } from 'components/primitives'
import Layout from 'components/Layout'
import { StyledInput } from 'components/primitives/Input'
import LaunchHeroSection from 'components/launch/LaunchHeroSection'
import artifact from 'artifact/NFTELaunchpad.json';
import { ethers } from 'ethers';
import { getContractAddress } from '@ethersproject/address';
import { useNetwork } from 'wagmi';
import detectEthereumProvider from '@metamask/detect-provider'
import {ExternalProvider} from "@ethersproject/providers";
import supportedChains, {DefaultChain} from 'utils/chains'

const LaunchPadDeployPage = () => {
  const { theme } = useTheme()
  const isMobile = useMediaQuery({ query: '(max-width: 960px)' })
  const { chain: activeChain } = useNetwork();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [supply, setSupply] = useState('')
  const [maxPerWallet, setMaxPerWallet] = useState('')
  const [allowlistSupply, setAllowlistSupply] = useState('')
  const [reservedSupply, setReservedSupply] = useState('')
  const [isFreeMint, setIsFreeMint] = useState(true)
  const [isReserveTokens, setIsReserveTokens] = useState(false)
  const [allowlistMintPrice, setAllowlistMintPrice] = useState('')
  const [publicMintPrice, setPublicMintPrice] = useState('')
  const [error, setError] = useState(undefined);
  const { proxyApi } = supportedChains.find(c => c.id === activeChain?.id) || DefaultChain;

  const publicSupply = useMemo(() => {
    return +supply - +allowlistSupply - +reservedSupply;
  }, [supply, allowlistSupply, reservedSupply])

  const constructorArgs = useMemo(() => {
    return [
      name,
      symbol,
      "",
      "0x7D3E5dD617EAF4A3d42EA550C41097086605c4aF",
      +supply || 1,
      +maxPerWallet || +supply || 1,
      +reservedSupply || 0,
      +allowlistSupply || 0,
      ethers.utils.parseEther(allowlistMintPrice === '' ? '0' : allowlistMintPrice).toString(),
      (+supply || 1) - (+allowlistSupply || 0) - (+reservedSupply || 0),
      ethers.utils.parseEther(publicMintPrice === '' ? '0' : publicMintPrice).toString(),
    ]
  }, [
    name,
    symbol,
    supply,
    maxPerWallet,
    reservedSupply,
    allowlistSupply,
    allowlistMintPrice,
    publicSupply,
    publicMintPrice
  ])

  const handleDeployContract = async (e: any) => {
    console.log('Deploying contract');
    e.preventDefault();
    setError(undefined);
    try {
      // Approve Wallet
      setStep(1);
      const browserProvider = await detectEthereumProvider() as ExternalProvider;
      const provider = new ethers.providers.Web3Provider(browserProvider);
      const signer = provider.getSigner()
      // // Using the signing account to deploy the contract
      const factory = new ethers.ContractFactory(artifact.abi, artifact.data.bytecode.object, signer);
      const contract = await factory.deploy(constructorArgs);
      // Deploying Contract...
      // Check your transaction at [activeChain?.blockExplorers?.default?.name] = `${activeChain?.blockExplorers?.default?.url}/tx/${contract.deployTransaction.hash}`
      setStep(2);
      console.log(`${activeChain?.blockExplorers?.default?.url}/tx/${contract.deployTransaction.hash}`);

      const transactionCount = await signer.getTransactionCount()
      const deployer = await signer.getAddress();
      const futureAddress = getContractAddress({
        from: deployer,
        nonce: transactionCount
      })

      await fetch(`${proxyApi}/launchpad/create/v1`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: futureAddress,
          name,
          constructor_args: JSON.stringify(constructorArgs),
          bytecode: artifact.data.bytecode.object,
          deployer: deployer
        })
      }).catch(console.error)

      // Waiting for the transaction to be mined
      await contract.deployTransaction.wait(6);
      await fetch(`/api/launchpad/verify`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chainId: activeChain?.id,
          id: futureAddress,
          constructor_args: constructorArgs,
          deployer: deployer
        })
      }).catch(console.error)

      // Contract Deployed
      // Your contract deployed at [0xsadsadasdasdsad] = `${activeChain?.blockExplorers?.default?.url}/address/${futureAddress}`
      console.log(`Contract deployed at : ${futureAddress}`);
      setStep(3);
    } catch (e: any) {
      setError(e.message);
      setStep(0);
    }
  }

  return (
    <Layout>
      <form onSubmit={handleDeployContract} autoComplete="off">
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
              width: isMobile ? '100%' : '70%',
              borderRadius: 10,
              padding: isMobile ? 8 : 24,
              margin: '0 auto',
            }}
          >
            <LaunchHeroSection />
            {step}
            <Box css={{ marginTop: 32 }}>
              <Box css={{ marginBottom: 32 }}>
                <Text style="h6" css={{ color: '$white' }}>
                  Name
                </Text>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter the name of your NFT Collection"
                  css={{
                    backgroundColor: theme === 'light' ? '$gray1' : 'initial',
                  }}
                  containerCss={{
                    marginTop: 6,
                    width: '100%',
                    border: '1px solid $gray8',
                    borderRadius: 6,
                  }}
                />
              </Box>
              <Box css={{ marginBottom: 32 }}>
                <Text style="h6" css={{ color: '$white' }}>
                  Symbol
                </Text>
                <Input
                  required

                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="The token symbol that will show up on block explorers, e.g. TOKEN"
                  css={{
                    backgroundColor: theme === 'light' ? '$gray1' : 'initial',
                  }}
                  containerCss={{
                    marginTop: 6,
                    width: '100%',
                    border: '1px solid $gray8',
                    borderRadius: 6,
                  }}
                />
              </Box>
              <Box css={{ marginBottom: 32 }}>
                <Text style="h6" css={{ color: '$white' }}>
                  Supply
                </Text>
                <Input
                  required
                  type="number"
                  value={supply}
                  onChange={(e) => setSupply(e.target.value)}
                  placeholder="Max collection supply"
                  css={{
                    backgroundColor: theme === 'light' ? '$gray1' : 'initial',
                  }}
                  containerCss={{
                    marginTop: 6,
                    width: '100%',
                    border: '1px solid $gray8',
                    borderRadius: 6,
                  }}
                />
              </Box>
              <Box css={{ marginBottom: 32 }}>
                <Text style="h6" css={{ color: '$white' }}>
                  Max Per Wallet
                </Text>
                <Input
                  type="number"
                  value={maxPerWallet}
                  onChange={(e) => setMaxPerWallet(e.target.value)}
                  placeholder="Set the max tokens allowed per wallet, default: max supply"
                  css={{
                    backgroundColor: theme === 'light' ? '$gray1' : 'initial',
                  }}
                  containerCss={{
                    marginTop: 6,
                    width: '100%',
                    border: '1px solid $gray8',
                    borderRadius: 6,
                  }}
                />
              </Box>
              <Box css={{ marginBottom: 32 }}>
                <Text style="h6" css={{ color: '$white' }}>
                  Allowlist supply
                </Text>
                <Input
                  type="number"
                  value={allowlistSupply}
                  onChange={(e) => setAllowlistSupply(e.target.value)}
                  placeholder="Set max allowlisted token"
                  css={{
                    backgroundColor: theme === 'light' ? '$gray1' : 'initial',
                  }}
                  containerCss={{
                    marginTop: 6,
                    width: '100%',
                    border: '1px solid $gray8',
                    borderRadius: 6,
                  }}
                />
              </Box>
              <Box css={{ marginBottom: 32 }}>
                <Flex justify="between">
                  <Flex direction="column">
                    <Text style="h6" css={{ color: '$white' }}>
                      Free mint
                    </Text>
                    <Text
                      style="subtitle3"
                      css={{ color: '$white', marginTop: 6 }}
                    >
                      NFTEarth Launchpad currently only supports free-to-mint
                      projects
                    </Text>
                  </Flex>
                  <Box>
                    <Switch
                      checked={isFreeMint}
                      onCheckedChange={(checked) => setIsFreeMint(checked)}
                    />
                  </Box>
                </Flex>
                {!isFreeMint && (
                  <Flex direction="column">
                    <Box css={{ width: '100%', marginTop: 12 }}>
                      <Text
                        style="subtitle2"
                        css={{ color: '$white', fontWeight: 'bold' }}
                      >
                        Allowlist Mint price
                      </Text>
                      <Box
                        css={{
                          position: 'relative',
                          width: '100%',
                          '@md': {
                            width: '50%',
                          },
                        }}
                      >
                        <StyledInput
                          required
                          type="number"
                          value={allowlistMintPrice}
                          placeholder="0"
                          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                            ['e', '+', '-'].includes(e.key) && e.preventDefault()
                          }
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setAllowlistMintPrice(e.target.value)
                          }
                          css={{
                            backgroundColor:
                              theme === 'light' ? '$gray1' : 'initial',
                            marginTop: 6,
                            width: '100%',
                            border: '1px solid $gray8',
                            borderRadius: 6,
                            pr: 32,
                            boxSizing: 'border-box',
                          }}
                        />
                        <Flex
                          align="center"
                          css={{
                            position: 'absolute',
                            bottom: 2,
                            right: 2,
                            padding: '12px 12px',
                            boxSizing: 'border-box',
                            borderTopRightRadius: 6,
                            borderBottomRightRadius: 6,
                            borderLeft: '1px solid $gray10',
                          }}
                        >
                          <Text
                            style="subtitle2"
                            css={{
                              fontWeight: 'bold',
                            }}
                          >
                            ETH
                          </Text>
                        </Flex>
                      </Box>
                    </Box>
                    <Box css={{ width: '100%', marginTop: 12 }}>
                      <Text
                        style="subtitle2"
                        css={{ color: '$white', fontWeight: 'bold' }}
                      >
                        Public Mint price
                      </Text>
                      <Box
                        css={{
                          position: 'relative',
                          width: '100%',
                          '@md': {
                            width: '50%',
                          },
                        }}
                      >
                        <StyledInput
                          required
                          type="number"
                          value={publicMintPrice}
                          placeholder="0"
                          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                            ['e', '+', '-'].includes(e.key) && e.preventDefault()
                          }
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setPublicMintPrice(e.target.value)
                          }
                          css={{
                            backgroundColor:
                              theme === 'light' ? '$gray1' : 'initial',
                            marginTop: 6,
                            width: '100%',
                            border: '1px solid $gray8',
                            borderRadius: 6,
                            pr: 32,
                            boxSizing: 'border-box',
                          }}
                        />
                        <Flex
                          align="center"
                          css={{
                            position: 'absolute',
                            bottom: 2,
                            right: 2,
                            padding: '12px 12px',
                            boxSizing: 'border-box',
                            borderTopRightRadius: 6,
                            borderBottomRightRadius: 6,
                            borderLeft: '1px solid $gray10',
                          }}
                        >
                          <Text
                            style="subtitle2"
                            css={{
                              fontWeight: 'bold',
                            }}
                          >
                            ETH
                          </Text>
                        </Flex>
                      </Box>
                    </Box>
                  </Flex>
                )}
              </Box>
              <Flex css={{ marginBottom: 32 }} justify="between">
                <Flex direction="column">
                  <Text style="h6" css={{ color: '$white' }}>
                    Reserve tokens
                  </Text>
                  <Text style="subtitle3" css={{ color: '$white', marginTop: 6 }}>
                    Allow the contract owner to mint a token reserve seperate from
                    the allowlist mint
                  </Text>
                </Flex>
                <Box>
                  <Switch
                    checked={isReserveTokens}
                    onCheckedChange={(checked) => setIsReserveTokens(checked)}
                  />
                </Box>
              </Flex>
              {isReserveTokens && (
                <Box css={{ marginBottom: 32 }}>
                  <Text style="h6" css={{ color: '$white' }}>
                    Reserved supply
                  </Text>
                  <Input
                    type="number"
                    value={reservedSupply}
                    onChange={(e) => setReservedSupply(e.target.value)}
                    placeholder="Set max reserved token"
                    css={{
                      backgroundColor: theme === 'light' ? '$gray1' : 'initial',
                    }}
                    containerCss={{
                      marginTop: 6,
                      width: '100%',
                      border: '1px solid $gray8',
                      borderRadius: 6,
                    }}
                  />
                </Box>
              )}
            </Box>
            {step}
            <Button
              css={{
                marginTop: 8,
                justifyContent: 'center',
                alignItems: 'center',
                justifyItems: 'center',
                px: '$6',
                py: '$3',
              }}
              type="submit"
              size="small"
              color="primary"
            >
              Deploy Contract
            </Button>
          </Flex>
        </Box>
      </form>
    </Layout>
  )
}

export default LaunchPadDeployPage
