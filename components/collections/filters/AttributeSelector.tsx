import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAttributes } from '@reservoir0x/reservoir-kit-ui'
import { Box, Flex, Switch, Text } from 'components/primitives'
import { FC, useState } from 'react'

type Props = {
  attribute: NonNullable<
    ReturnType<typeof useAttributes>['response']['attributes']['0']
  >
}

export const AttributeSelector: FC<Props> = ({ attribute }) => {
  const [open, setOpen] = useState(false)

  return (
    <Box css={{ pt: '$2', borderBottom: '1px solid $gray7' }}>
      <Flex
        align="center"
        justify="between"
        css={{ mb: '$3', cursor: 'pointer' }}
        onClick={() => setOpen(!open)}
      >
        <Text as="h5" style="h6">
          {attribute.key}
        </Text>
        <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
      </Flex>
      {open && (
        <Box css={{ maxHeight: 300, overflow: 'auto', pb: '$2' }}>
          {attribute.values
            .sort((a, b) => b.count - a.count)
            .map((value) => (
              <Flex css={{ mb: '$3', gap: '$3' }} align="center">
                <Flex align="center">
                  <Switch />
                </Flex>
                <Text
                  style="body1"
                  css={{
                    color: '$gray11',
                    flex: 1,
                    whiteSpace: 'pre',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {value.value}
                </Text>

                <Text style="body2" css={{ color: '$gray11' }}>
                  {value.count}
                </Text>
              </Flex>
            ))}
        </Box>
      )}
    </Box>
  )
}
