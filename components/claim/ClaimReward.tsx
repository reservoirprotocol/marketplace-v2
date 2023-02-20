import { Box, Grid, Text, Flex } from 'components/primitives'
import { RewardContent, RewardButton } from './styled'

type Props = {
  title: string
  description: string
  image: string
}

export const ClaimReward = ({ title, description, image }: Props) => {
  return (
    <Box
      css={{
        borderRadius: '16px',
        gap: '$1',
        width: '100%',
        position: 'relative',
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        '@xs': {
          padding: '64px 24px',
        },
        '@lg': {
          padding: '100px 64px',
        },
      }}
    >
      <Flex>
        <Grid
          css={{
            gap: 32,
            '@xs': {
              flex: 1,
            },
            '@lg': {
              flex: 0.5,
            },
          }}
        >
          <Text
            style={{
              '@initial': 'h3',
              '@lg': 'h2',
            }}
            css={{
              fontWeight: 700,
            }}>
            {title}
          </Text>
        
          <Text
            style="subtitle1"
            css={{
              lineHeight: '28px',
              color: '$whiteA12',
              width: '100%',
              '@lg': { width: '50%' },
            }}
          >
            {description}
          </Text>
          <RewardButton
            css={{
              background: '#6BE481',
              borderRadius: '10px',
              padding: '15px 0px',
            }}>
            <Text
              css={{
                color: 'black',
                textAlign: 'center',
                marginLeft: 'auto',
                marginRight: 'auto',
                fontWeight: 700,
              }}
            >
              Claim $NFTE
            </Text>
          </RewardButton>
        </Grid>
      </Flex>
    </Box>
  )
}
