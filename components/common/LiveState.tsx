import { keyframes } from '@stitches/react'
import { Flex, Text } from 'components/primitives'
import { FC } from 'react'

export const pulse = keyframes({
  '0%': {
    transform: 'scale(1)',
    boxShadow: 'rgb(52, 199, 123) 0px 0px 0px 0px',
  },
  '100%': {
    boxShadow: 'rgba(52, 199, 123, 0) 0px 0px 0px 6.5px',
  },
})

const States = {
  0: 'Paused...',
  1: 'Live',
} as const;

type Props = {
  state: keyof typeof States
}

const LiveState: FC<Props> = ({ state }) => {
  const connectionState = States[state]

  return (
    <Flex
      justify="between"
      align="center"
      css={{
        gap: '$2',
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: '100%',
          background: state ? '#4CC38A' : '#F1A10D',
          ...(state && {
            animation: `3s ease 0s infinite normal none running ${pulse}`,
          }),
        }}
      />
      <Text style="subtitle2">{connectionState}</Text>
    </Flex>
  )
}

export default LiveState
