import { useAttributes } from '@reservoir0x/reservoir-kit-ui'
import { Box } from 'components/primitives'
import { FC, useState } from 'react'
import { AttributeSelector } from './AttributeSelector'

import * as Collapsible from '@radix-ui/react-collapsible'

type Props = {
  open: boolean
  attributes: NonNullable<
    ReturnType<typeof useAttributes>['response']['attributes']
  >
}

export const Filters: FC<Props> = ({ attributes, open }) => {
  // const [open, setOpen] = useState(false)

  return (
    <Collapsible.Root
      className="CollapsibleRoot"
      open={open}
      // onOpenChange={setOpen}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Collapsible.Trigger asChild>
          <button className="IconButton">{open ? 'close' : 'open'}</button>
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content>
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
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
