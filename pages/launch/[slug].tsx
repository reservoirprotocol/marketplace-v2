import { Box, Flex, Text, Button } from 'components/primitives'
import Layout from 'components/Layout'
import MintInfo from 'components/launch/MintInfo'
// import * as Progress from '@radix-ui/react-progress'

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
          <Box css={{
            "@initial": {
              width: '500px'
            },
            "@lg": {
              width: '100%'
            },
          }}>
            <Flex direction="column" css={{ gap: 15, }}>
              <img src="/images/heroSectionBanner.png" style={{ borderRadius: '10px', }} />
              <Flex
                justify="between"
                css={{
                  width: '100%',
                }}
              >
                <Text>Toal minted</Text>
                <Text>150/491,215 (0%)</Text>
              </Flex>
              <Button css={{
                background: '$gray2',
                '&:hover': {
                  background: '$gray9',
                }
              }}>
                <Flex justify="between" css={{ width: '100%' }}>
                  <Text>Whitelist Mint</Text>
                  <Text>Active &gt;</Text>
                </Flex>
              </Button>
              <Button css={{
                background: '$gray2',
                '&:hover': {
                  background: '$gray9',
                }
              }}>
                <Flex justify="between" css={{ width: '100%' }}>
                  <Text>Public Mint</Text>
                  <Text>Inactive &gt;</Text>
                </Flex>
              </Button>
            </Flex>
          </Box>
          <Flex
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
                Layer2DAO Early Adopter - Level 1
              </Text>
            </Box>
            <Box css={{
              marginBottom: '$5',
              "@xs": {
                margin: '0 auto',
                textAlign: 'center'
              },
              "@bp800": {
                textAlign: 'left',
                marginBottom: '$5',
              }
            }}>
              <Text style={{
                  "@initial": 'subtitle2',
                  "@lg": 'subtitle1',
                }}>
                The Layer2DAO NFTs are awarded to early adopters of the top 10 L2 networks. The NFT level corresponds to the number of L2s that the owner bridged assets into. We plan on building utility of the NFT with other L2 projects, so hold on to yours rightly. It pays to be an early adopter!
              </Text>
            </Box>
            <MintInfo
              price={mintInfo.price}
              supply={mintInfo.supply}
              socialLinks={ mintInfo.socialLinks }
            />
            <Flex css={{
              gap: 24,
              "@xs": {
                margin: '0 auto',
              },
              "@bp800": {
                margin: '0',
                marginTop: '$6',
              }
            }}>
              <Button css={{
                minWidth: '140px',
                "@bp800": {
                  minWidth: '180px',
                },
                display: 'flex',
                justifyContent: 'center'
              }}> Mint NFT </Button>
              <Button css={{
                minWidth: '140px',
                "@bp800": {
                  minWidth: '180px',
                },
                display: 'flex',
                justifyContent: 'center'
              }}> View Collection </Button>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Layout>
  )
}

export default LaunchPadMint
