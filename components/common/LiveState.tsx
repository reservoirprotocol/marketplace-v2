import { keyframes } from '@stitches/react'
import { Flex, Text } from 'components/primitives'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'

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
} as const

const LiveState: FC = () => {
  const router = useRouter()
  const [connectionStatus, setConnectionStatus] =
    useState<keyof typeof States>(0)

  useEffect(() => {
    setConnectionStatus(
      Object.keys(router.query).some((key) => key.includes('attribute')) ? 0 : 1
    )
  }, [router.query])

  const connectionState = States[connectionStatus]

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
          background: connectionStatus ? '#4CC38A' : '#F1A10D',
          ...(connectionStatus && {
            animation: `3s ease 0s infinite normal none running ${pulse}`,
          }),
        }}
      />
      <Text style="subtitle2">{connectionState}</Text>
    </Flex>
  )
}

export default LiveState