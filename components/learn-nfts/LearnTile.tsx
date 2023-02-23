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
    <Link href={''}>
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
            style="subtitle1"
            ellipsify
          >
            {title}
          </Text>
        </LearnTileHeader>
        <LearnTileSubTitle>
          <Text style="body2" css={{ color: '#ff0', fontWeight: 900 }}>
            {numArticles} articles
          </Text>
        </LearnTileSubTitle>
        <LearnTileContent>
          <ul>
            {articles.map((article: Article) => (
              <li>
                <Text
                  as="a"
                  href={article.link}
                  style="subtitle3"
                  css={{
                    borderBottom: '1px solid $gray4',
                    cursor: 'pointer',
                    pb: '$6',
                    pt: '$6',
                    width: '100%',
                  }}
                >
                  • {article.title}
                </Text>
              </li>
            ))}
          </ul>
        </LearnTileContent>
      </Box>
    </Link>
  )
}
