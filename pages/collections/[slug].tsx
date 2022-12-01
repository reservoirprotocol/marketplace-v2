import { NextPage } from 'next'
import { Text, Switch, Flex, Box } from '../../components/primitives'
import {
  useCollections,
  useTokens,
  useAttributes,
} from '@reservoir0x/reservoir-kit-ui'
import Layout from 'components/Layout'
import { useRouter } from 'next/router'
import { truncateAddress } from 'utils/truncate'
import StatHeader from 'components/collections/StatHeader'
import CollectionActions from 'components/collections/CollectionActions'
import TokenCard from 'components/collections/TokenCard'
import { Filters } from 'components/collections/filters/Filters'
import { FilterButton } from 'components/collections/filters/FilterButton'
import { useState } from 'react'

const IndexPage: NextPage = () => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { slug } = router.query

  const { data: collections } = useCollections({
    id: slug as string,
    includeTopBid: true,
  })

  let collection = collections && collections[0]

  const { data: tokens } = useTokens({
    collection: collection?.id,
  })

  let { data: attributes } = useAttributes(collection?.id)

  return (
    <Layout>
      {collection ? (
        <Box css={{ p: '$5', pb: 0 }}>
          <Flex justify="between">
            <Flex direction="column" css={{ gap: '$4' }}>
              <Flex css={{ gap: '$4', flex: 1 }} align="center">
                <img
                  src={collection.image}
                  style={{ width: 64, height: 64, borderRadius: 8 }}
                />
                <Box>
                  <Flex align="center">
                    <Text style="h5" as="h6">
                      {collection.name}
                    </Text>
                  </Flex>
                  <Text style="body2" css={{ color: '$gray11' }} as="p">
                    {truncateAddress(collection.id)}
                  </Text>
                </Box>
              </Flex>
              <StatHeader collection={collection} />
            </Flex>
            <CollectionActions collection={collection} />
          </Flex>

          <Flex
            css={{
              borderBottom: '1px solid $gray5',
              mt: '$5',
              mb: '$4',
              gap: '$5',
            }}
          >
            <Box css={{ pb: '$3', borderBottom: '1px solid $accent' }}>
              <Text style="h6">Items</Text>
            </Box>

            <Box>
              <Text style="h6">Activity</Text>
            </Box>
          </Flex>

          <Flex css={{ gap: '$5' }}>
            <Filters attributes={attributes} open={open} />
            <Box
              css={{
                flex: 1,
                pb: '$5',
              }}
            >
              <FilterButton open={open} setOpen={setOpen} />
              <Box
                css={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                  gap: '$4',
                }}
              >
                {tokens.map((token) => (
                  <TokenCard token={token} />
                ))}
              </Box>
            </Box>
          </Flex>
        </Box>
      ) : (
        <Box />
      )}
    </Layout>
  )
}

export default IndexPage
