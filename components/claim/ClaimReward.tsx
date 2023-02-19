import { Box, Button, Text } from 'components/primitives'
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
        background: '$gray2',
        borderRadius: '16px',
        gap: '$1',
        height: '100%',
        width: '100%',
      }}
    >
      <Box
        css={{
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          height: '300px',
          overflow: 'hidden',
        }}
      >
        <img height="100" width="100%" src={image} />
      </Box>
      <RewardContent>
        <Text style="subtitle2">{description}</Text>
      </RewardContent>

      <RewardButton>
        <Text
          css={{
            color: 'black',
            textAlign: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Claim Reward
        </Text>
      </RewardButton>
    </Box>
  )
}
