import { styled } from '@stitches/react'
import { Box } from 'components/primitives'

export const Grid = styled(Box, {
  display: 'grid',
  gap: '10px',
  gridTemplateColumns: 'repeat(3, 1fr)',
  overflow: 'hidden',
})

export const LearnTileHeader = styled(Box, {
  padding: '25px 20px 12px',
  fontSize: '16px',
  height: '80px',
  marginBottom: '12px',
  borderBottom: '1px solid #555',
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
})

export const LearnTileSubTitle = styled(Box, {
  width: '100%',
  height: '48px',
  background: '#333',
  padding: '10px 20px 12px',
  borderBottomLeftRadius: '16px',
  borderBottomRightRadius: '16px',
})

export const LearnTileContent = styled(Box, {
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
