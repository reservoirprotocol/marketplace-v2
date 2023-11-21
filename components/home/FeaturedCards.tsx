import { useTrendingCollections } from '@reservoir0x/reservoir-kit-ui'
import {
  Box,
  Flex,
  FormatCryptoCurrency,
  MarkdownLink,
  Text,
} from 'components/primitives'
import Img from 'components/primitives/Img'
import { useMarketplaceChain } from 'hooks'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import optimizeImage from 'utils/optimizeImage'

type TrendingCollections = ReturnType<typeof useTrendingCollections>['data']

type FeaturedCardsProps = {
  collections: TrendingCollections
}

export const FeaturedCards = ({
  collections,
}: FeaturedCardsProps): JSX.Element => {
  const marketplaceChain = useMarketplaceChain()

  const isMinting = false

  if (!collections) {
    return <Flex>Empty State</Flex>
  }

  return (
    <Flex
      direction="row"
      style={{
        gap: '10px',
      }}
    >
      {collections.map((collection) => {
        return (
          <Link
            key={collection.id}
            href={`/${marketplaceChain.routePrefix}/collection/${collection.id}`}
            style={{ display: 'grid' }}
          >
            <Flex
              direction="column"
              css={{
                flex: 1,
                width: '100%',
                borderRadius: 12,
                cursor: 'pointer',
                height: '100%',
                background: '$neutralBgSubtle',
                $$shadowColor: '$colors$panelShadow',
                boxShadow: '0 0px 12px 0px $$shadowColor',

                overflow: 'hidden',
                position: 'relative',
                p: '$3',
                '&:hover > div > div> img:nth-child(1)': {
                  transform: 'scale(1.075)',
                },
              }}
            >
              <Flex
                style={{
                  height: '10px',
                  width: '300px',
                }}
              >
                <Img
                  src={optimizeImage(collection?.image, 72 * 2) as string}
                  alt={collection?.name as string}
                  fill
                  css={{
                    border: '2px solid rgba(255,255,255,0.6)',
                    borderRadius: 8,
                  }}
                />
              </Flex>
              <Flex
                direction="column"
                css={{
                  zIndex: 2,
                  flex: 1,
                  width: '100%',
                }}
              >
                <Box
                  css={{
                    overflow: 'hidden',
                    borderRadius: 8,
                  }}
                >
                  {/**
                     *                   {collection?.banner?.length ||
                  collection.recentSales?.[0]?.token?.image?.length ? (
                    <img
                      loading="lazy"
                      src={optimizeImage(
                        collection?.banner ||
                          collection.recentSales?.[0]?.token?.image ||
                          collection.recentSales?.[0]?.collection?.image,
                        800
                      )}
                      style={{
                        transition: 'transform 300ms ease-in-out',
                        width: '100%',
                        borderRadius: 8,
                        height: 250,
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Box
                      css={{
                        width: '100%',
                        borderRadius: 8,
                        height: 250,
                        background: '$gray3',
                      }}
                    />
                  )}
                     */}
                  <Img
                    src={optimizeImage(collection?.image, 72 * 2) as string}
                    alt={collection?.name as string}
                    width={72}
                    height={72}
                    css={{
                      width: 72,
                      height: 72,
                      border: '2px solid rgba(255,255,255,0.6)',
                      position: 'absolute',
                      bottom: '$3',
                      left: '$3',
                      borderRadius: 8,
                    }}
                  />
                </Box>
                <Flex
                  css={{ my: '$4', mb: '$2' }}
                  justify="between"
                  align="center"
                >
                  <Text style="h5" as="h5" ellipsify css={{ flex: 1 }}>
                    {collection?.name}
                  </Text>
                </Flex>

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
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    '& a': {
                      fontWeight: 500,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    },
                  }}
                ></Box>

                <Flex css={{ mt: '$4' }}>
                  <Box css={{ mr: '$5' }}>
                    <Text
                      style="subtitle2"
                      color="subtle"
                      as="p"
                      css={{ mb: 2 }}
                    >
                      FLOOR
                    </Text>
                    <FormatCryptoCurrency
                      amount={collection?.floorAsk?.price?.amount?.native ?? 0}
                      textStyle={'h6'}
                      logoHeight={12}
                      address={collection?.floorAsk?.price?.currency?.contract}
                    />
                  </Box>

                  <Box css={{ mr: '$4' }}>
                    <Text style="subtitle2" color="subtle" as="p">
                      24H SALES
                    </Text>
                    <Text style="h6" as="h4" css={{ mt: 2 }}>
                      {collection.count?.toLocaleString()}
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            </Flex>
          </Link>
        )
      })}
    </Flex>
  )
}
