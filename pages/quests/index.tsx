import { NextPage } from 'next'
import { Text, Flex, Box } from 'components/primitives'
import Layout from 'components/Layout'
import { useMounted } from 'hooks'
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