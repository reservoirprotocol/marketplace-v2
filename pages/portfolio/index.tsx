import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import { Text, Flex, Box, Grid } from '../../components/primitives'
import { paths } from '@reservoir0x/reservoir-sdk'
import Layout from 'components/Layout'
import fetcher from 'utils/fetcher'
import { useIntersectionObserver } from 'usehooks-ts'
import { useMediaQuery } from 'react-responsive'
import { useEffect, useRef, useState } from 'react'
import { useAccount } from 'wagmi'
import { TabsList, TabsTrigger, TabsContent } from 'components/primitives/Tab'
import * as Tabs from '@radix-ui/react-tabs'
import {
  useCollectionActivity,
  useTokens,
  useUserTokens,
} from '@reservoir0x/reservoir-kit-ui'
import { useMounted } from '../../hooks'

const IndexPage: NextPage = () => {
  const { address } = useAccount()
  const [filterCollection, setFilterCollection] = useState<string | undefined>(
    undefined
  )
  const isSmallDevice = useMediaQuery({ maxWidth: 905 })
  const isMounted = useMounted()

  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {
    rootMargin: '0px 0px 300px 0px',
  })

  let tokenQuery: Parameters<typeof useUserTokens>['1'] = {
    limit: 20,
    collection: filterCollection,
  }
  const {
    data: tokens,
    mutate,
    fetchNextPage,
    isFetchingInitialData,
    hasNextPage,
    isFetchingPage,
  } = useUserTokens(address || '', tokenQuery, {})

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      fetchNextPage()
    }
  }, [loadMoreObserver?.isIntersecting])

  if (!isMounted) {
    return null
  }

  return (
    <Layout>
      <Flex
        direction="column"
        css={{
          px: '$4',
          pt: '$5',
          pb: 0,
          '@sm': {
            px: '$5',
          },
        }}
      >
        <Text style="h4" css={{ mb: '$5' }}>
          Portfolio
        </Text>
        <Tabs.Root defaultValue="items">
          <TabsList style={{ overflow: 'scroll', whiteSpace: 'nowrap' }}>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="offers">Offers Made</TabsTrigger>
          </TabsList>

          <TabsContent value="items">Items</TabsContent>
          <TabsContent value="collections">Collections</TabsContent>
          <TabsContent value="listings">Listings</TabsContent>
          <TabsContent value="offers">Offers Made</TabsContent>
        </Tabs.Root>
      </Flex>
    </Layout>
  )
}

export default IndexPage
