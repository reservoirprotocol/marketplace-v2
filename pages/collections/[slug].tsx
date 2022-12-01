import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import { Text, Flex, Box } from '../../components/primitives'
import {
  useCollections,
  useTokens,
  useAttributes,
} from '@reservoir0x/reservoir-kit-ui'
import { paths } from '@reservoir0x/reservoir-kit-client'
import Layout from 'components/Layout'
import { useEffect, useRef } from 'react'
import { truncateAddress } from 'utils/truncate'
import StatHeader from 'components/collections/StatHeader'
import CollectionActions from 'components/collections/CollectionActions'
import TokenCard from 'components/collections/TokenCard'
import { Grid } from 'components/primitives/Grid'
import { useIntersectionObserver } from 'usehooks-ts'
import fetcher from 'utils/fetcher'

// const AttributeSelector = ({ attribute }) => {
//   const [open, setOpen] = useState(false)

//   return (
//     <Box css={{ pt: '$2', borderBottom: '1px solid $gray7' }}>
//       <Flex
//         align="center"
//         justify="between"
//         css={{ mb: '$3', cursor: 'pointer' }}
//         onClick={() => setOpen(!open)}
//       >
//         <Text as="h5" style="h6">
//           {attribute.key}
//         </Text>
//         <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
//       </Flex>
//       {open && (
//         <Box css={{ maxHeight: 300, overflow: 'auto', pb: '$2' }}>
//           {attribute.values
//             .sort((a, b) => b.count - a.count)
//             .map((value) => (
//               <Flex css={{ mb: '$3', gap: '$3' }} align="center">
//                 <Flex align="center">
//                   <Switch />
//                 </Flex>
//                 <Text
//                   style="body1"
//                   css={{
//                     color: '$gray11',
//                     flex: 1,
//                     whiteSpace: 'pre',
//                     textOverflow: 'ellipsis',
//                     overflow: 'hidden',
//                   }}
//                 >
//                   {value.value}
//                 </Text>

//                 <Text style="body2" css={{ color: '$gray11' }}>
//                   {value.count}
//                 </Text>
//               </Flex>
//             ))}
//         </Box>
//       )}
//     </Box>
//   )
// }

type Props = InferGetStaticPropsType<typeof getStaticProps>

const IndexPage: NextPage<Props> = ({ id, ssr }) => {
  const loadMoreRef = useRef<HTMLDivElement>()
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {
    rootMargin: '0px 0px 300px 0px',
  })

  const { data: collections } = useCollections(
    {
      id,
      includeTopBid: true,
    },
    {
      fallback: ssr.collection,
    }
  )

  let collection = collections && collections[0]
  const {
    data: tokens,
    mutate,
    fetchNextPage,
  } = useTokens(
    {
      collection: id,
    },
    {
      fallback: ssr.tokens,
    }
  )

  let { data: attributes } = useAttributes()

  const rarityEnabledCollection =
    collection?.tokenCount &&
    +collection.tokenCount >= 2 &&
    attributes?.length >= 2

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      fetchNextPage()
    }
  }, [loadMoreObserver?.isIntersecting])

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
            {/* <Box
              css={{
                width: 320,
                background: '$gray3',
                border: '1px solid $gray5',
                position: 'sticky',
                top: 16 + 80,
                borderRadius: 8,
                overflow: 'auto',
                height: 'calc(100vh - 81px - 32px)',
              }}
            >
              <Box
                css={{
                  p: '$4',
                  '& > div:first-of-type': {
                    pt: 0,
                  },
                }}
              >
                {attributes &&
                  attributes.map((attribute) => (
                    <AttributeSelector attribute={attribute} />
                  ))}
              </Box>
            </Box> */}

            <Box
              css={{
                flex: 1,
                pb: '$5',
              }}
            >
              <Grid
                css={{
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '$4',
                }}
              >
                {tokens.map((token, i) => (
                  <TokenCard
                    key={i}
                    token={token}
                    mutate={mutate}
                    rarityEnabled={rarityEnabledCollection}
                  />
                ))}
                <div ref={loadMoreRef}></div>
              </Grid>
            </Box>
          </Flex>
        </Box>
      ) : (
        <Box />
      )}
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<{
  collectionId?: string
  ssr: {
    collection: paths['/collections/v5']['get']['responses']['200']['schema']
    tokens: paths['/tokens/v5']['get']['responses']['200']['schema']
  }
  id: string | undefined
}> = async ({ params }) => {
  const id = params?.slug?.toString()

  let collectionQuery: paths['/collections/v5']['get']['parameters']['query'] =
    {
      id,
      includeTopBid: true,
    }

  const collection: Props['ssr']['collection'] = await fetcher(
    '/collectins/v5',
    collectionQuery
  )

  let tokensQuery: paths['/tokens/v5']['get']['parameters']['query'] = {
    collection: id,
    sortBy: 'floorAskPrice',
    includeTopBid: false,
    limit: 20,
  }

  const tokens: Props['ssr']['tokens'] = await fetcher(
    '/tokens/v5',
    tokensQuery
  )

  return {
    props: { ssr: { collection, tokens }, id },
    revalidate: 20,
  }
}

export default IndexPage
