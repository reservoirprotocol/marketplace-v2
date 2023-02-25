import { styled } from '@stitches/react'
import { Box, Button } from 'components/primitives'

export const Grid = styled(Box, {
  display: 'grid',
  gap: '10px',
  gridTemplateColumns: 'repeat(3, 1fr)',
  overflow: 'hidden',
})

export const LaunchTileHeader = styled(Box, {
  padding: '25px 20px 12px',
  fontSize: '16px',
  height: '80px',
  marginBottom: '12px',
})

export const LaunchTileContent = styled(Box, {
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

export const MintInfoBtn = styled(Box, {
  padding: '5px 10px',
  borderRadius: '5px',
  border: '2px solid $gray9',
  cursor: 'pointer',
  transition: '0.2s',
  transitionTimingFunction: 'ease-in-out',
  '&:hover': {
    background: '$gray9'
  }
})