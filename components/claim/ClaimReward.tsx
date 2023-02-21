import { Box, Grid, Text, Flex } from 'components/primitives'
import { RewardContent, RewardButton } from './styled'
import useEligibleAirdropSignature from 'hooks/useEligibleAirdropSignature'

type Props = {
  title: string
  description: string
  image: string
}

export const ClaimReward = ({ title, description, image }: Props) => {
  const signature = useEligibleAirdropSignature()

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
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              '@initial': 'h4',
              '@lg': 'h4',
            }}
          >
            {description}
          </Text>
          <RewardButton
            disabled={!signature}
            css={{
              background: '#6BE481',
              borderRadius: '10px',
              padding: '$1',
              width: '30%',
            }}
          >
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
