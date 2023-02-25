import { Box, Text } from 'components/primitives'
import Link from 'next/link'
import { QuestHeader, QuestContent, QuestFooter } from './styled'

type Props = {
  title: string
  description: string
  points: number
  link: string
}

export const Quest = ({ title, description, points, link }: Props) => {
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
        <QuestHeader>
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
        </QuestHeader>
        <QuestContent>
          <Text style="subtitle2">{description}</Text>
        </QuestContent>
        <QuestFooter>
          <Text style="body2" css={{ color: '#ff0', fontWeight: 900 }}>
            25 Pts
          </Text>
        </QuestFooter>
      </Box>
    </Link>
  )
}
