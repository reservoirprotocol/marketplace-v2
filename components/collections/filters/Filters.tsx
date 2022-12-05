import { useAttributes } from '@reservoir0x/reservoir-kit-ui'
import { Box } from 'components/primitives'
import { FC } from 'react'
import { AttributeSelector } from './AttributeSelector'
import * as Collapsible from '@radix-ui/react-collapsible'
import { CollapsibleContent } from 'components/primitives/Collapsible'

type Props = {
  open: boolean
  setOpen: (boolean) => void
  attributes: NonNullable<
    ReturnType<typeof useAttributes>['response']['attributes']
  >
}

export const Filters: FC<Props> = ({ attributes, open, setOpen }) => {
  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      style={{
        transition: 'width .5s',
        width: open ? 320 : 0,
      }}
    >
      <CollapsibleContent
        css={{
          position: 'sticky',
          top: 16 + 80,
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
            attributes
              .filter((attribute) => attribute.kind != 'number')
              .map((attribute) => <AttributeSelector attribute={attribute} />)}
        </Box>
      </CollapsibleContent>
    </Collapsible.Root>
  )
}
