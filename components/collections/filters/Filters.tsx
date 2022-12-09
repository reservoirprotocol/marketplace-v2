import { useAttributes } from '@reservoir0x/reservoir-kit-ui'
import { Box } from 'components/primitives'
import { FC } from 'react'
import { AttributeSelector } from './AttributeSelector'
import * as Collapsible from '@radix-ui/react-collapsible'
import { CollapsibleContent } from 'components/primitives/Collapsible'
import { NAVBAR_HEIGHT } from 'components/navbar'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  attributes: ReturnType<typeof useAttributes>['data'] | undefined
  scrollToTop: () => void
}

export const Filters: FC<Props> = ({
  attributes,
  open,
  setOpen,
  scrollToTop,
}) => {
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
          height: `calc(100vh - ${NAVBAR_HEIGHT}px - 32px)`,
          overflow: 'auto',
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
              .map((attribute) => (
                <AttributeSelector
                  key={attribute.key}
                  attribute={attribute}
                  scrollToTop={scrollToTop}
                />
              ))}
        </Box>
      </CollapsibleContent>
    </Collapsible.Root>
  )
}
