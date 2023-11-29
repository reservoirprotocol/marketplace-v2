import { useTrendingCollections } from '@reservoir0x/reservoir-kit-ui'
import { Box, Flex, FormatCryptoCurrency, Text } from 'components/primitives'
import Img from 'components/primitives/Img'
import { useMarketplaceChain } from 'hooks'
import Link from 'next/link'

type TrendingCollections = ReturnType<typeof useTrendingCollections>['data']

type FeaturedCardsProps = {
  collections: TrendingCollections
}

export const FeaturedCards = ({
  collections,
}: FeaturedCardsProps): JSX.Element => {
  const marketplaceChain = useMarketplaceChain()

  const isMinting = false

  if (!collections) return <></>

  return (
    <Flex
      direction="row"
      align="center"
      style={{
        width: '100%',
        overflowY: 'scroll',
        gap: '12px',
      }}
    >
      {collections.map((collection) => {
        const bannerImage =
          collection?.banner ||
          collection?.image ||
          // @ts-ignore
          collection.sampleImages?.[0]

        const collectionImage =
          collection?.image ||
          collection?.banner ||
          // @ts-ignore
          collection.sampleImages?.[0]

        return (
          <Link
            key={collection.id}
            href={`/${marketplaceChain.routePrefix}/collection/${collection.id}`}
          >
            <Flex
              direction="column"
              css={{
                flex: 1,
                width: '330px',
                height: '290px',
                borderRadius: 12,
                cursor: 'pointer',
                background: '$neutralBgSubtle',
                $$shadowColor: '$colors$panelShadow',
                boxShadow: '0 0px 12px 0px $$shadowColor',
                p: '16px',
              }}
            >
              <Flex
                css={{
                  mb: 24,
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                }}
              >
                <Img
                  src={bannerImage}
                  alt={collection?.name as string}
                  height={150}
                  width={300}
                  style={{
                    objectFit: 'cover',
                    height: '150px',
                    width: '300px',
                    borderRadius: 8,
                  }}
                />
                <Img
                  src={collectionImage}
                  alt={collection.name as string}
                  height={50}
                  width={50}
                  css={{
                    position: 'absolute',
                    top: '95px',
                    left: '5px',
                    right: '5px',
                    objectFit: 'cover',
                    height: '50px',
                    width: '50px',
                    border: '2px solid white',
                    borderRadius: 8,
                  }}
                />
              </Flex>
              <Flex
                direction="column"
                css={{
                  width: '100%',
                }}
              >
                <Box
                  css={{
                    maxWidth: 720,
                    lineHeight: 1.5,
                    fontSize: 16,
                    flex: 1,
                    fontWeight: 400,
                    display: '-webkit-box',
                    color: '$gray12',
                    fontFamily: '$body',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    gap: 16,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    '& a': {
                      fontWeight: 500,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  <Text style="h6" as="h6" ellipsify css={{ flex: 1 }}>
                    {collection?.name}
                  </Text>
                  <Flex>
                    <Box css={{ mr: '$5' }}>
                      <Text
                        style="subtitle2"
                        color="subtle"
                        as="p"
                        css={{ mb: 2 }}
                      >
                        Mint Price
                      </Text>
                      <FormatCryptoCurrency
                        amount={
                          collection?.floorAsk?.price?.amount?.native ?? 0
                        }
                        textStyle={'h6'}
                        logoHeight={12}
                        address={
                          collection?.floorAsk?.price?.currency?.contract
                        }
                      />
                    </Box>

                    <Box css={{ mr: '$4' }}>
                      <Text style="subtitle2" color="subtle" as="p">
                        6H SALES
                      </Text>
                      <Text style="h6" as="h4" css={{ mt: 2 }}>
                        {collection.count?.toLocaleString()}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            </Flex>
          </Link>
        )
      })}
    </Flex>
  )
}
