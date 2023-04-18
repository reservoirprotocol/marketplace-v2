import { Box, Flex } from '../primitives'
import React, { FC, ComponentPropsWithoutRef } from 'react'
import { styled, keyframes } from '../../stitches.config'

type Props = {
  fromImgs: string[]
  toImgs: string[]
} & ComponentPropsWithoutRef<typeof Flex>

const Img = styled('img', {
  width: 56,
  height: 56,
  borderRadius: 4,
  objectFit: 'cover',
  '& + img': {
    ml: -20,
  },
})

const ProgressDot = styled(Box, {
  borderRadius: '50%',
  width: 5,
  height: 5,
})

const loadingStart = keyframes({
  '0%': { transform: 'scale(0.8)', backgroundColor: '$gray9' },
  '20%': { transform: 'scale(1)', backgroundColor: '$primary11' },
  '100%': { transform: 'scale(0.8)', backgroundColor: '$gray9' },
})

const loadingMiddle = keyframes({
  '0%': { transform: 'scale(0.8)', backgroundColor: '$gray9' },
  '20%': { transform: 'scale(0.8)', backgroundColor: '$gray9' },
  '40%': { transform: 'scale(1)', backgroundColor: '$primary11' },
  '100%': { transform: 'scale(0.8)', backgroundColor: '$gray9' },
})

const loadingEnd = keyframes({
  '0%': { transform: 'scale(0.8)', backgroundColor: '$grayy9' },
  '40%': { transform: 'scale(0.8)', backgroundColor: '$gray9' },
  '60%': { transform: 'scale(1)', backgroundColor: '$primary11' },
  '100%': { transform: 'scale(0.8)', backgroundColor: '$gray9' },
})

const TransactionProgress: FC<Props> = ({ fromImgs, toImgs, ...props }) => {
  const hasManyFromImgs = fromImgs.length > 5
  return (
    <Flex {...props} align="center">
      {fromImgs.map((src, i) => (
        <Img
          key={i}
          src={src}
          css={{
            '& + img': {
              ml: hasManyFromImgs ? -40 : -30,
            },
          }}
        />
      ))}
      <Flex css={{ gap: '$1', mx: 23 }}>
        <ProgressDot
          css={{ animation: `${loadingStart} 1s ease-in-out infinite` }}
        />
        <ProgressDot
          css={{ animation: `${loadingMiddle} 1s ease-in-out infinite` }}
        />
        <ProgressDot
          css={{ animation: `${loadingEnd} 1s ease-in-out infinite` }}
        />
      </Flex>
      {toImgs.map((src, i) => (
        <Img key={i} src={src} />
      ))}
    </Flex>
  )
}

export default TransactionProgress
