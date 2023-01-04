import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import { Text, Flex, Box, Grid } from '../../components/primitives'
import { paths } from '@reservoir0x/reservoir-kit-client'
import Layout from 'components/Layout'
import fetcher from 'utils/fetcher'
import { useEnsAvatar, useEnsName, Address } from 'wagmi'
import { useCopyToClipboard, useIntersectionObserver } from 'usehooks-ts'
import { useContext, useEffect, useRef, useState } from 'react'
import { ToastContext } from 'context/ToastContextProvider'
import { Avatar } from 'components/primitives/Avatar'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { truncateAddress, truncateEns } from 'utils/truncate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { TabsList, TabsTrigger, TabsContent } from 'components/primitives/Tab'
import * as Tabs from '@radix-ui/react-tabs'
import { useTokens, useUserTokens } from '@reservoir0x/reservoir-kit-ui'
import TokenCard from 'components/collections/TokenCard'
import { useMounted } from '../../hooks'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const IndexPage: NextPage<Props> = ({ address, ssr }) => {
  const { data: ensAvatar } = useEnsAvatar(address as Address)
  const { data: ensName } = useEnsName(address as Address)
  const [value, copy] = useCopyToClipboard()
  const { addToast } = useContext(ToastContext)
  const [playingElement, setPlayingElement] = useState<
    HTMLAudioElement | HTMLVideoElement | null
  >()
  const isMounted = useMounted()

  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {
    rootMargin: '0px 0px 300px 0px',
  })

  let tokenQuery: Parameters<typeof useUserTokens>['1'] = {
    limit: 20,
    normalizeRoyalties: true,
  }

  const {
    data: tokens,
    mutate,
    fetchNextPage,
  } = useUserTokens(address || '', tokenQuery, {
    fallback: ssr.tokens,
  })

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
        <Flex align="center">
          {ensAvatar ? (
            <Avatar size="xxl" src={ensAvatar} />
          ) : (
            <Jazzicon
              diameter={64}
              seed={jsNumberForAddress(address as string)}
            />
          )}
          <Flex direction="column" css={{ ml: '$4' }}>
            <Text style="h4">
              {ensName
                ? truncateEns(ensName)
                : truncateAddress(address as string)}
            </Text>
            <Flex
              align="center"
              css={{ cursor: 'pointer' }}
              onClick={() => {
                copy(address as string)
                addToast?.({ title: 'Copied' })
              }}
            >
              <Text
                style="subtitle1"
                color="$gray11"
                css={{ color: '$gray11', mr: '$3' }}
              >
                {truncateAddress(address as string)}
              </Text>
              <Box css={{ color: '$gray10' }}>
                <FontAwesomeIcon icon={faCopy} width={16} height={16} />
              </Box>
            </Flex>
          </Flex>
        </Flex>
        <Tabs.Root defaultValue="items">
          <TabsList>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="items">
            <Flex
              css={{
                position: 'relative',
                width: '100%',
              }}
            >
              <Grid
                css={{
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '$4',
                  width: '100%',
                }}
              >
                {tokens.map((token, i) => (
                  <TokenCard
                    key={i}
                    token={token as ReturnType<typeof useTokens>['data'][0]}
                    mutate={mutate}
                    rarityEnabled={false}
                    onMediaPlayed={(e) => {
                      if (
                        playingElement &&
                        playingElement !== e.nativeEvent.target
                      ) {
                        playingElement.pause()
                      }
                      const element =
                        (e.nativeEvent.target as HTMLAudioElement) ||
                        (e.nativeEvent.target as HTMLVideoElement)
                      if (element) {
                        setPlayingElement(element)
                      }
                    }}
                  />
                ))}
                <div ref={loadMoreRef}></div>
              </Grid>
            </Flex>
          </TabsContent>
          <TabsContent value="activity">
            <Flex
              css={{
                position: 'relative',
              }}
            >
              Activity
            </Flex>
          </TabsContent>
        </Tabs.Root>
      </Flex>
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
  ssr: {
    tokens: paths['/users/{user}/tokens/v6']['get']['responses']['200']['schema']
  }
  address: string | undefined
}> = async ({ params }) => {
  const address = params?.address?.toString()

  let tokensQuery: paths['/users/{user}/tokens/v6']['get']['parameters']['query'] =
    {
      limit: 20,
      normalizeRoyalties: true,
    }

  const tokensResponse = await fetcher(
    `/users/${address}/tokens/v6`,
    tokensQuery
  )

  const tokens: Props['ssr']['tokens'] = tokensResponse['data']

  return {
    props: { ssr: { tokens }, address },
    revalidate: 20,
  }
}

export default IndexPage
