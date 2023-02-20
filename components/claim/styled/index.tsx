import { styled } from '@stitches/react'
import { Box, Button } from 'components/primitives'

export const RewardButton = styled(Button, {
  textAlign: 'center',
  width: '20%',
  '@media (max-width: 768px)': {
    width: '55%',
  },
  '&:hover': {
    background: 'White',
  }
})

export const RewardContent = styled(Box, {
  padding: '0 20px',
  marginTop: '18px',
  marginBottom: '24px',
  fontSize: '15px',
  color: '#ccc',
  lineHeight: '21px',
  height: '105px',
  textOverflow: 'ellipsis',
  wordWrap: 'break-word',
  overflow: 'hidden',
})
