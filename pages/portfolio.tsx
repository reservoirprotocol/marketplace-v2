import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Box from '../components/primitives/Box'
import Flex from '../components/primitives/Flex'
import Text from '../components/primitives/Text'
import Button from '../components/primitives/Button'

import Davatar from '@davatar/react'

import { head } from 'lodash'
import {
  useAccount,
  useEnsAddress,
  useEnsAvatar,
  useEnsName,
  useProvider,
} from 'wagmi'
import ActivityFeed from '../components/ActivityFeed'
import CollectionTable from '../components/CollectionTable'

import TokenTable from '../components/TokenTable'
import Layout from 'components/Layout'

function useIsMounted() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return mounted
}

const IndexPage2 = () => {
  let isMounted = useIsMounted()

  if (isMounted) {
  }

  return null
}

const IndexPage: NextPage = () => {
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('Tokens')
  const { address: me } = useAccount()
  const provider = useProvider()
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
  const isMe = address == me

  const { data: ensName } = useEnsName({
    address: me,
    onError: console.log,
    onSettled: console.log,
  })

  console.log(ensName)

  const { data: avatar } = useEnsAvatar({
    addressOrName: address,
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

            '@bp3': {
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
