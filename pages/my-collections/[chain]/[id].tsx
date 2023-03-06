import {useLayoutEffect, useState} from 'react'
import { useTheme } from 'next-themes'
import {useContractReads, useSignMessage} from "wagmi"
import {useRouter} from "next/router"
import { ethers } from "ethers";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faMapPin, faEdit, faList, faFileImage } from '@fortawesome/free-solid-svg-icons'
import { Text, Flex, Box, Grid } from 'components/primitives'
import Layout from 'components/Layout'
import SettingsContentContainer from "components/my-collections/settings/SettingsContentContainer"
import DetailsSettings from 'components/my-collections/settings/DetailsSettings'
import RoyaltiesSettings from 'components/my-collections/settings/RoyaltiesSettings'
import MintStateSettings from 'components/my-collections/settings/MintStateSettings'
import WhitelistSettings from 'components/my-collections/settings/WhitelistSettings'
import MetadataSettings from 'components/my-collections/settings/MetadataSettings'
import LoadingSpinner from "components/common/LoadingSpinner";
import {useLaunchpads, useMarketplaceChain} from "hooks";
import launchpadArtifact from 'artifact/NFTELaunchpad.json'

const MyCollectionDetailPage = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<string | null>('details')
  const router = useRouter()
  const marketplaceChain = useMarketplaceChain()
  const { signMessageAsync } = useSignMessage();

  useLayoutEffect(() => {
    signMessageAsync({
      message: "Confirm account ownership"
    }).catch(() => {
      location.href = '/my-collections'
    })
  }, [])

  const launchpadsQuery: Parameters<typeof useLaunchpads>['1'] = {
    id: router.query.id as string,
    limit: 1,
  }

  const {
    data: launchpads,
    mutate,
    isFetchingPage,
    isValidating,
  } = useLaunchpads(
    marketplaceChain,
    launchpadsQuery,
    {
      revalidateOnMount: false,
      fallbackData: [],
      revalidateFirstPage: false,
      revalidateIfStale: false,
    }
  )

  const launchpad: ReturnType<typeof useLaunchpads>['data'][0] = launchpads[0]

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
        functionName: '_URI'
      }
    ],
    cacheTime: 5_000
  })

  const [activePresale, activePublic, presalePrice, publicPrice, URI ] = contractData || [];

  const getCssTab = (tab: string) => ({
    tab: {
      cursor: 'pointer',
      width: '100%',
      padding: '4px 12px',
      color: activeTab === tab ? (theme === 'light' ? '$primary8' : '$primary10') : 'initial',
      borderLeft: `solid 2px ${activeTab === tab ? (theme === 'light' ? '$primary8' : '$primary10') : '$blackA1'}`,
      marginBottom: 20
    },
    text: {
      ml: 12,
      fontSize: 14,
      fontWeight: 'bold',
      color: activeTab === tab ? (theme === 'light' ? '$primary8' : '$primary10') : 'initial',
    }
  })

  if (!launchpad) {
    return (
      <Layout>
        <Flex align="center" justify="center" css={{ py: '40vh' }}>
          <LoadingSpinner />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout>
      <Box
        css={{
          p: 24,
          height: '100%',
          '@bp800': {
            p: '$5',
          },
        }}>
        <Text style='h6' css={{ fontWeight: 'bold' }}>
          Collection Settings
        </Text>
        <Grid css={{
          marginTop: 18,
          widht: '100%',
          '@md': {
            gridTemplateColumns: '3fr 9fr',
          },
          '@lg': {
            gridTemplateColumns: '2fr 10fr',
          },
        }}>
          <Flex
            direction='column'
            css={{
            widht: '100%',
            display: 'none',
            '@md': {
                display: 'flex'
              },
            }}>
            <Box>
              <Flex
                align='center'
                onClick={() => setActiveTab('details')}
                css={getCssTab('details').tab}>
                <Box css={{ width: 16 }}>
                  <FontAwesomeIcon icon={faGear} />
                </Box>
                <Text css={getCssTab('details').text}>Details</Text>
              </Flex>
              <Flex
                align='center'
                onClick={() => setActiveTab('royalities')}
                css={getCssTab('royalities').tab}>
                <Box css={{ width: 16 }}>
                  <FontAwesomeIcon icon={faMapPin} />
                </Box>
                <Text css={getCssTab('royalities').text}>Royalities</Text>
              </Flex>
              <Flex
                align='center'
                onClick={() => setActiveTab('mintState')}
                css={getCssTab('mintState').tab}>
                <Box css={{ width: 16 }}>
                  <FontAwesomeIcon icon={faEdit} />
                </Box>
                <Text css={getCssTab('mintState').text}>Mint Settings</Text>
              </Flex>
              <Flex
                align='center'
                onClick={() => setActiveTab('whitelist')}
                css={getCssTab('whitelist').tab}>
                <Box css={{ width: 16 }}>
                  <FontAwesomeIcon icon={faList} />
                </Box>
                <Text css={getCssTab('whitelist').text}>Allowlist</Text>
              </Flex>
              <Flex
                align='center'
                onClick={() => setActiveTab('metadata')}
                css={getCssTab('metadata').tab}>
                <Box css={{ width: 16 }}>
                  <FontAwesomeIcon icon={faFileImage} />
                </Box>
                <Text css={getCssTab('metadata').text}>Metadata</Text>
              </Flex>
            </Box>
          </Flex>
          <Box
            css={{
              width: '100%'
            }}>
            <SettingsContentContainer
              tab='details'
              tabLabel='details'
              activeTab={activeTab}
              icon={faGear}
              setActiveTab={() => setActiveTab('details')}>
              <DetailsSettings
                launchpad={launchpad}
              />
            </SettingsContentContainer>
            <SettingsContentContainer
              tab='royalities'
              tabLabel='royalities'
              activeTab={activeTab}
              icon={faMapPin}
              setActiveTab={() => setActiveTab('royalities')}>
              <RoyaltiesSettings
                launchpad={launchpad}
              />
            </SettingsContentContainer>
            <SettingsContentContainer
              tab='mintState'
              tabLabel='mint settings'
              activeTab={activeTab}
              icon={faEdit}
              setActiveTab={() => setActiveTab('mintState')}>
              <MintStateSettings
                address={launchpad?.id as `0x${string}`}
                activePresale={activePresale as boolean}
                presalePrice={presalePrice as string}
                activePublic={activePublic as boolean}
                publicPrice={publicPrice as string}
              />
            </SettingsContentContainer>
            <SettingsContentContainer
              tab='whitelist'
              tabLabel='whitelist'
              activeTab={activeTab}
              icon={faList}
              setActiveTab={() => setActiveTab('whitelist')}>
              <WhitelistSettings
                launchpad={launchpad}
              />
            </SettingsContentContainer>
            <SettingsContentContainer
              tab='metadata'
              tabLabel='metadata'
              activeTab={activeTab}
              icon={faFileImage}
              setActiveTab={() => setActiveTab('metadata')}>
              <MetadataSettings
                address={launchpad?.id as `0x${string}`}
                uri={`${URI}`}
              />
            </SettingsContentContainer>
          </Box>
        </Grid>
      </Box>
    </Layout>
  )
}

export default MyCollectionDetailPage
