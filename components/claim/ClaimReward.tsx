import { Box, Text } from 'components/primitives'
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
        <Text style="subtitle1">{description}</Text>
      </RewardContent>

      <RewardButton css={{background: '#6EE799'}}>
        <Text
          css={{
            color: 'black',
            textAlign: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Claim $NFTE Airdrop
        </Text>
      </RewardButton>
    </Box>
  )
}
