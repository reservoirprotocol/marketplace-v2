import { Box, Flex, Text, Button } from 'components/primitives'
import Layout from 'components/Layout'
import MintInfo from 'components/launch/MintInfo'
import {useLaunchpads, useMarketplaceChain, useSignature} from 'hooks';
import {useRouter} from "next/router";
import {useAccount, useContractReads, useContractWrite} from "wagmi";
import {BigNumber} from "@ethersproject/bignumber";
import {formatNumber} from "utils/numbers";
import launchpadArtifact from "artifact/NFTELaunchpad.json";
import Link from "next/link";
import LaunchpadArtifact from "../../../artifact/NFTELaunchpad.json";
import {SyntheticEvent, useContext, useState} from "react";
import {ToastContext} from "../../../context/ToastContextProvider";

interface mintType {
  price: string;
  supply: string;
  socialLinks: string[];
}

const mintInfo: mintType = {
  price: "Free",
  supply: "491,215",
  socialLinks: [
    "https://discord.com/nftEarth",
    "https://twitter.com/nftEarth"
  ],
}

const LaunchPadMint = () => {
  const router = useRouter()
  const { address } = useAccount()
  const { addToast } = useContext(ToastContext)
  const [ loading, setLoading ] = useState(false)
  const marketplaceChain = useMarketplaceChain()
  const launchpadsQuery: Parameters<typeof useLaunchpads>['1'] = {
    slug: router.query.slug as string,
    limit: 1,
  }

  const {
    data: launchpads,
    isFetchingPage,
    isValidating,
    fetchNextPage
  } = useLaunchpads(
    marketplaceChain,
    launchpadsQuery,
    {
      revalidateOnMount: true,
      fallbackData: [],
      revalidateFirstPage: true,
    }
  )

  const launchpad = launchpads[0] || [];

  const launchpadContract = {
    address: launchpad?.id as `0x${string}`,
    abi: launchpadArtifact.abi,
  }

  const { data: contractData, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...launchpadContract,
        functionName: 'activeSale',
        args: [1]
      },
      {
        ...launchpadContract,
        functionName: 'activeSale',
        args: [2]
      },
      {
        ...launchpadContract,
        functionName: 'presalePrice'
      },
      {
        ...launchpadContract,
        functionName: 'publicPrice'
      },
      {
        ...launchpadContract,
        functionName: 'maxSupply'
      },
      {
        ...launchpadContract,
        functionName: 'totalSupply'
      },
      {
        ...launchpadContract,
        functionName: 'supply',
        args: [0]
      },
      {
        ...launchpadContract,
        functionName: 'minted',
        args: [0]
      },
      {
        ...launchpadContract,
        functionName: 'supply',
        args: [1]
      },
      {
        ...launchpadContract,
        functionName: 'minted',
        args: [1]
      },
      {
        ...launchpadContract,
        functionName: 'supply',
        args: [2]
      },
      {
        ...launchpadContract,
        functionName: 'minted',
        args: [0]
      },
    ],
    cacheTime: 5_000
  })

  const [
    activePresale,
    activePublic,
    presalePrice,
    publicPrice,
    maxSupply,
    totalSupply,
    reservedSupply,
    reservedMinted,
    presaleSupply,
    presaleMinted,
    publicSupply,
    publicMinted
  ] = contractData || [];
  const numMaxSupply = (maxSupply as BigNumber)?.toNumber() || 1
  const numTotalSupply = (totalSupply as BigNumber)?.toNumber() || 0
  const numReservedSupply = (reservedSupply as BigNumber)?.toNumber() || 0
  const numReservedMinted = (reservedMinted as BigNumber)?.toNumber() || 0
  const numPresaleSupply = (presaleSupply as BigNumber)?.toNumber() || 0
  const numPresaleMinted = (presaleMinted as BigNumber)?.toNumber() || 0
  const numPublicSupply = (publicSupply as BigNumber)?.toNumber() || 0
  const numPublicMinted = (publicMinted as BigNumber)?.toNumber() || 0

  const { data: signature } = useSignature({
    id: launchpad.id as string,
    chain: marketplaceChain.id,
    address: address as string
  })

  const { writeAsync: publicMint } = useContractWrite({
    mode: 'recklesslyUnprepared',
    abi: LaunchpadArtifact.abi,
    address: launchpad.id as `0x${string}`,
    functionName: 'publicMint',
    args: [1],
    overrides: {
      from: address,
      value: (publicPrice as BigNumber) || 0
    },
    chainId: marketplaceChain.id
  })

  const { writeAsync: presaleMint } = useContractWrite({
    mode: 'recklesslyUnprepared',
    abi: LaunchpadArtifact.abi,
    address: launchpad.id as `0x${string}`,
    functionName: 'preSaleMint',
    args: [signature, 1],
    overrides: {
      from: address,
      value: (publicPrice as BigNumber) || 0
    },
    chainId: marketplaceChain.id
  })

  const handlePublicMint = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      await publicMint?.()
      addToast?.({
        title: 'success',
        description: 'Successfully minted your NFT'
      })
    } catch (e: any) {
      addToast?.({
        title: 'error',
        description: e.reason || e.message
      })
    }
    setLoading(false)
  }

  const handleWhitelistMint = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      await presaleMint?.()
      addToast?.({
        title: 'success',
        description: 'Successfully minted your NFT'
      })
    } catch (e: any) {
      addToast?.({
        title: 'error',
        description: e.reason || e.message
      })
    }
    setLoading(false)
  }

  return (
    <Layout>
      <Box
        css={{
          p: 24,
          height: '100%',
          width: '100%',
          margin: '0 auto',
          marginTop: '$6',
          '@xs': {
            p: '$1',
            width: '80%',
            marginTop: 0,
          },
          '@bp800': {
            p: '$6',
            width: '100%',
            marginTop: 0,
          },
          '@bp1200': {
            width: '85%',
            marginTop: 0,
          },
        }}
      >
        <Flex
          justify="between"
          css={{
            gap: '80px',
            '@xs': {
              display: 'block'
            },
            '@bp800': {
              display: 'flex'
            },
          }}
        >
          <Flex css={{
            "@initial": {
              flex: '1'
            },
            "@lg": {
              flex: '0.5'
            },
          }}>
            <Flex direction="column" css={{ gap: 15, }}>
              <img src={launchpad?.image} style={{ borderRadius: '10px', }} />
              <Flex
                justify="between"
                css={{
                  width: '100%',
                }}
              >
                <Text>Total minted</Text>
                <Text>{`${formatNumber(numTotalSupply)}/${formatNumber(numMaxSupply)} (${formatNumber((numTotalSupply / numMaxSupply * 100), 2)}%)`}</Text>
              </Flex>
              {numReservedSupply > 0 && (
                <Flex direction="column" css={{
                  background: '$gray2',
                  p: '$4'
                }}>
                  <Flex justify="between" css={{ width: '100%' }}>
                    <Text>Reserved</Text>
                  </Flex>
                  <Text>{`${formatNumber(numReservedMinted)}/${formatNumber(numReservedSupply)} (${formatNumber((numReservedMinted / numReservedSupply * 100), 2)}%)`}</Text>
                </Flex>
              )}
              {numPresaleSupply > 0 && (
                <Flex direction="column" css={{
                  background: '$gray2',
                  p: '$4'
                }}>
                  <Flex justify="between" css={{ width: '100%' }}>
                    <Text>Whitelist Mint</Text>
                    <Text css={{
                      color: activePresale ? 'green' : 'red'
                    }}>{activePresale ? 'Active': 'Inactive'}</Text>
                  </Flex>
                  <Text>{`${formatNumber(numPresaleMinted)}/${formatNumber(numPresaleSupply)} (${formatNumber((numPresaleMinted / numPresaleSupply * 100), 2)}%)`}</Text>
                </Flex>
              )}
              <Flex direction="column" css={{
                background: '$gray2',
                p: '$4'
              }}>
                <Flex justify="between" css={{ width: '100%' }}>
                  <Text>Public Mint</Text>
                  <Text css={{
                    color: activePublic ? 'green' : 'red'
                  }}>{activePublic ? 'Active': 'Inactive'}</Text>
                </Flex>
                <Text>{`${formatNumber(numPublicMinted)}/${formatNumber(numPublicSupply)} (${formatNumber((numPublicMinted / numPublicSupply * 100), 2)}%)`}</Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex
            css={{
              "@initial": {
                flex: '1'
              },
              "@lg": {
                flex: '0.5'
              },
            }}
            direction="column"
            justify="center"
          >
            <Box css={{
              "@xs": {
                margin: '0 auto',
                marginTop: '$5',
                textAlign: 'center'
              },
              "@bp800": {
                margin: '0',
                textAlign: 'left',
                marginBottom: '$4',
              }
            }}>
              <Text
                style={{
                  "@initial": 'h4',
                  "@bp1300": 'h2',
                }}
                >
                {launchpad.name}
              </Text>
            </Box>
            <Box css={{
              marginBottom: '$5',
              "@xs": {
                margin: '0 auto'
              },
              "@bp800": {
                marginBottom: '$5',
              }
            }}>
              <Text style={{
                  "@initial": 'subtitle2',
                  "@lg": 'subtitle1',
                }}>
                {launchpad.description}
              </Text>
            </Box>
            <MintInfo
              launchpad={launchpad}
              contractData={contractData}
            />
            <Flex justify="center" css={{
              flexWrap: 'wrap',
              gap: 24,
              mt: '$6'
            }}>
              <>
                {activePresale && (
                  <Box>
                    <Button
                      disabled={!(launchpad.allowlists || []).map(a => a.toLowerCase()).includes(address?.toLowerCase() || '') || loading}
                      onClick={handleWhitelistMint}
                      css={{
                        minWidth: '140px',
                        "@bp800": {
                          minWidth: '180px',
                        },
                        justifyContent: 'center'
                      }}
                    > Presale Mint </Button>
                  </Box>
                )}
                {activePublic && (
                  <Box>
                    <Button
                      disabled={loading}
                      onClick={handlePublicMint}
                      css={{
                      minWidth: '140px',
                      "@bp800": {
                        minWidth: '180px',
                      },
                      justifyContent: 'center'
                    }}> Mint NFT </Button>
                  </Box>
                )}
                <Link href={`/collection/${router.query.chain}/${launchpad.id}`}>
                  <Button css={{
                    minWidth: '140px',
                    "@bp800": {
                      minWidth: '180px',
                    },
                    justifyContent: 'center'
                  }}> View Collection </Button>
                </Link>
              </>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Layout>
  )
}

export default LaunchPadMint
