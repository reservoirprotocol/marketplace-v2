import { Box, Text } from 'components/primitives'
import Link from 'next/link'
import { LaunchTileHeader, LaunchTileContent } from './styled'

type Props = {
  icon: string
  title: string
  description: string
}

export const LaunchTile = ({ title, description, icon }: Props) => {
  return (
    <Link href={''}>
      <Box
        css={{
          background: '$gray4',
          borderRadius: '16px',
          gap: '$3',
          height: '100%',
        }}
      >
        <img
          src={icon}
          alt="Verified by NFTEarth"
          style={{ width: 20, height: 20 }}
        />
        <LaunchTileHeader>
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
        </LaunchTileHeader>
        <LaunchTileContent>
          <Text style="subtitle2">{description}</Text>
        </LaunchTileContent>
      </Box>
    </Link>
  )
}
