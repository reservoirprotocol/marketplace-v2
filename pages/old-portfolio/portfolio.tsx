import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Text, Box, Flex } from '../components/primitives'
import Davatar from '@davatar/react'
import { head } from 'lodash'
import { useAccount, useEnsAddress, useEnsName } from 'wagmi'
import ActivityFeed from '../components/portfolio/ActivityFeed'
import CollectionTable from '../components/portfolio/CollectionTable'
import TokenTable from '../components/portfolio/TokenTable'
import Layout from 'components/Layout'

const IndexPage: NextPage = () => {
  const [selectedTab, setSelectedTab] = useState('Tokens')
  const { address: me } = useAccount()
  const router = useRouter()
  const { address: addressQuery } = router.query

  const routeAddress = head(addressQuery)

  const { data: ensAddress } = useEnsAddress({
    name: routeAddress,
  })

  const address =
    (routeAddress && /.*\.eth$/.test(routeAddress)
      ? ensAddress
      : routeAddress) || me

  const { data: ensName } = useEnsName({
    address: me,
    onError: console.log,
    onSettled: console.log,
  })

  if (!address) {
    return null
  }

  return (
    <Layout>
      <Flex css={{ height: '100%' }} direction="column">
        <Box
          css={{
            padding: 16,
            paddingTop: 16,

            '@lg': {
              padding: 24,
            },
          }}
        >
          <Flex css={{ mb: '$5' }} align="center">
            <Davatar
              key={address}
              address={address}
              size={72}
              style={{ borderRadius: '50%' }}
              generatedAvatarType="jazzicon"
            />
            <Box css={{ ml: '$4' }}>
              <Text style="h5" as="h5">
                {ensName || address.slice(0, 4) + '...' + address.slice(-5, -1)}
              </Text>
              <Text style="subtitle1" css={{ color: '$gray11' }}>
                {address.slice(0, 4) + '...' + address.slice(-5, -1)}
              </Text>
            </Box>
          </Flex>
          <Flex css={{ borderBottom: '1px solid $gray4', mb: '$4' }}>
            {['Tokens', 'Collections', 'Activity'].map((tab) => (
              <Box
                key={tab}
                onClick={() => setSelectedTab(tab)}
                css={{
                  position: 'relative',
                  pb: '$2',
                  mr: '$5',
                  cursor: 'pointer',
                }}
              >
                <Text style="h6">{tab}</Text>
                <Box
                  css={{
                    position: 'absolute',
                    transition: 'background 200ms ease-in-out',

                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor:
                      tab == selectedTab ? '$accent' : 'transparent',
                    height: 1,
                  }}
                />
              </Box>
            ))}
          </Flex>
          {selectedTab == 'Tokens' && <TokenTable address={address} />}
          {selectedTab == 'Collections' && (
            <CollectionTable address={address} />
          )}
          {selectedTab == 'Activity' && <ActivityFeed address={address} />}
        </Box>
      </Flex>
    </Layout>
  )
}
export default IndexPage
