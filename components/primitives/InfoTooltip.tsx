import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { Box, Popover, Text } from '.'
type Props = {
  side: string
  content: string
  width: number
  kind?: 'info' | 'error'
}

const InfoTooltip = ({ side, content, width, kind = 'info' }: Props) => {
  return (
    <Popover
      side={side}
      width={width}
      content={
        <Text style={'body2'} as="p">
          {content}
        </Text>
      }
    >
      <Box css={{ color: kind === 'error' ? '$errorAccent' : '$neutralText' }}>
        <FontAwesomeIcon icon={faInfoCircle} />
      </Box>
    </Popover>
  )
}

export default InfoTooltip
