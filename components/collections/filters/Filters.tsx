import { useAttributes } from '@reservoir0x/reservoir-kit-ui'
import { Box } from 'components/primitives'
import { FC } from 'react'
import { AttributeSelector } from './AttributeSelector'

type Props = {
  attributes: NonNullable<
    ReturnType<typeof useAttributes>['response']['attributes']
  >
}

export const Filters: FC<Props> = ({ attributes }) => {
  return (
    <Box
      css={{
        width: 320,
        background: '$gray3',
        border: '1px solid $gray5',
        position: 'sticky',
        top: 16 + 80,
        borderRadius: 8,
        overflow: 'auto',
        height: 'calc(100vh - 81px - 32px)',
      }}
    >
      <Box
        css={{
          p: '$4',
          '& > div:first-of-type': {
            pt: 0,
          },
        }}
      >
        {attributes &&
          attributes.map((attribute) => (
            <AttributeSelector attribute={attribute} />
          ))}
      </Box>
    </Box>
  )
}
