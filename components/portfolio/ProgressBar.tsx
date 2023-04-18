import { Flex } from '../primitives'
import React, { ComponentPropsWithoutRef, FC } from 'react'

type Props = {
  value: number
  max: number
} & ComponentPropsWithoutRef<typeof Flex>

const ProgressBar: FC<Props> = ({ value, max, ...props }) => {
  return (
    <Flex {...props} css={{ width: '100%', gap: '$2', ...props.css }}>
      {[...Array(max)].map((_item, i) => (
        <Flex
          key={i}
          css={{
            height: 4,
            borderRadius: 99999,
            flex: 1,
            background:
              'linear-gradient(to left, $gray8 50%, $primary9 50%) right',
            backgroundSize: '200% 100%',
            backgroundPosition: i + 1 <= value ? 'left' : 'right',
            transition: 'all 0.5s ease',
          }}
        ></Flex>
      ))}
    </Flex>
  )
}

export default ProgressBar
