import { NextPage } from 'next'
import { Text, Flex, Box } from 'components/primitives'
import Layout from 'components/Layout'
import { useMounted } from 'hooks'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import { QuestsGrid } from 'components/quests/QuestsGrid'
import QuestSecion from 'components/quests/QuestsSection'

const QuestsPage: NextPage = () => {
  const isMounted = useMounted()

  return (
    <Layout>
      <Box
        css={{
          p: 24,
          height: '100%',
          '@bp800': {
            p: '$6',
          },
        }}
      >
        <QuestSecion />
        <Flex css={{ my: '$6', gap: 65 }} direction="column">
          {/* <Flex
            justify="between"
            align="start"
            css={{
              flexDirection: 'column',
              gap: 24,
              '@bp800': {
                alignItems: 'center',
                flexDirection: 'row',
              },
            }}
          >
            <Box css={{ width: '100%' }}>
              <Text
                style="h4"
                as="h4"
                css={{ marginBottom: '15px', marginLeft: '5px' }}
              >
                My Points
              </Text>
              <Flex
                css={{
                  flexDirection: 'row',
                  background: '$gray4',
                  width: '100%',
                  borderRadius: '20px',
                  padding: '10px',
                }}
              >
                <Box css={{ marginLeft: 'auto', marginRight: 'auto' }}>
                  <Text
                    css={{ marginBottom: '15px', marginLeft: '5px' }}
                    style="h4"
                    as="h4"
                  >
                    Connect your Wallet
                  </Text>
                  <Box css={{ marginLeft: '100px', marginRight: 'auto' }}>
                    <ConnectWalletButton />
                  </Box>
                </Box>
              </Flex>
            </Box>
          </Flex> */}
          <Box>
            <Text
              css={{ marginBottom: '15px', marginLeft: '5px' }}
              style="h4"
              as="h4"
            >
              Now ! Earn points for every quest
            </Text>
            {isMounted && <QuestsGrid />}
          </Box>
        </Flex>
      </Box>
    </Layout>
  )
}

export default QuestsPage
