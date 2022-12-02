import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAttributes } from '@reservoir0x/reservoir-kit-ui'
import { Box, Flex, Switch, Text } from 'components/primitives'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import {
  addParam,
  toggleOffAttribute,
  toggleOffItem,
  toggleOnAttribute,
  toggleOnItem,
} from 'utils/router'

type Props = {
  attribute: NonNullable<
    ReturnType<typeof useAttributes>['response']['attributes']['0']
  >
}

export const AttributeSelector: FC<Props> = ({ attribute }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <Box
      css={{ pt: '$3', borderBottom: '1px solid $gray7', cursor: 'pointer' }}
    >
      <Flex
        align="center"
        justify="between"
        css={{ mb: '$3', cursor: 'pointer' }}
        onClick={() => setOpen(!open)}
      >
        <Text as="h5" style="subtitle1">
          {attribute.key}
        </Text>
        <FontAwesomeIcon
          icon={open ? faChevronUp : faChevronDown}
          width={16}
          height={16}
        />
      </Flex>
      {open && (
        <Box css={{ maxHeight: 300, overflow: 'auto', pb: '$2' }}>
          {attribute.values
            .sort((a, b) => b.count - a.count)
            .map((value) => (
              <Flex css={{ mb: '$3', gap: '$3' }} align="center">
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
                <Flex align="center">
                  <Switch
                    defaultChecked={
                      router.query[`attributes[${attribute.key}]`] ===
                      value.value
                    }
                    onCheckedChange={(checked) => {
                      console.log('Query ', router.query)
                      // console.log(
                      //   router.query[`attributes[${attribute.key}]`] !=
                      //     undefined
                      // )
                      if (checked) {
                        // if (
                        //   router.query[`attributes[${attribute.key}]`] !=
                        //   undefined
                        // )
                        addParam(
                          router,
                          `attributes[${attribute.key}]`,
                          value.value
                        )
                        // toggleOnAttribute(router, attribute.key, value.value)
                        // else {
                        //   toggleOnAttribute(router, attribute.key, value.value)
                        // }
                      } else {
                        toggleOffAttribute(router, attribute.key)
                      }
                    }}
                  />
                </Flex>
              </Flex>
            ))}
        </Box>
      )}
    </Box>
  )
}
