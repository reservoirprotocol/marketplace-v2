import { Box, Text } from 'components/primitives'
import Link from 'next/link'
import { LearnTileHeader, LearnTileSubTitle, LearnTileContent } from './styled'

type Props = {
  title: string
  articles: Article[]
  numArticles: number
  color: string
}

type Article = {
  title: string
  link: string
}

export const LearnTile = ({ title, numArticles, articles, color }: Props) => {
  return (
      <Box
        css={{
          background: '$gray2',
          borderRadius: '16px',
          gap: '$1',
          height: '100%',
        }}
      >
        <LearnTileHeader css={{ background: color }}>
          <Text
            css={{
              color: 'white',
              fontWeight: '900',
            }}
            style="h4"
            ellipsify
          >
            {title}
          </Text>
        </LearnTileHeader>
        <LearnTileSubTitle>
          <Text style="h6" css={{ color: '#ff0', fontWeight: 900 }}>
            {numArticles} articles
          </Text>
        </LearnTileSubTitle>
        <LearnTileContent>
          <ul>
            {articles.map((article: Article) => (
              <li>
                <Link href={'learn-nfts' + article.link}>
                  <Text
                    style={{
                      '@xs': 'h6',
                    }}
                    css={{
                      cursor: 'pointer',
                      width: '100%',
                      transition: '0.3s',
                      '&:hover': {
                        color: '$crimson10'
                      }
                    }}
                  >
                    • {article.title}
                  </Text>
                </Link>
              </li>
            ))}
          </ul>
        </LearnTileContent>
      </Box>
  )
}
