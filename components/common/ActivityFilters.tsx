import { useCollectionActivity } from '@reservoir0x/reservoir-kit-ui'
import { Box, Flex, Switch, Text } from 'components/primitives'
import { FC } from 'react'
import * as Collapsible from '@radix-ui/react-collapsible'
import { CollapsibleContent } from 'components/primitives/Collapsible'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHand,
  faRightLeft,
  faSeedling,
  faShoppingCart,
  faTag,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'

type ActivityTypes = Exclude<
  NonNullable<
    NonNullable<
      Exclude<Parameters<typeof useCollectionActivity>['0'], boolean>
    >['types']
  >,
  string
>

type Filters = {
  type: ArrayItemTypes<ActivityTypes>
  name: string
  icon: IconDefinition
}[]

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  activityTypes: NonNullable<ActivityTypes>
  setActivityTypes: (activityTypes: ActivityTypes) => void
}

export const ActivityFilters: FC<Props> = ({
  open,
  setOpen,
  activityTypes,
  setActivityTypes,
}) => {
  const filters: Filters = [
    {
      type: 'sale',
      name: 'Sales',
      icon: faShoppingCart,
    },
    {
      type: 'ask',
      name: 'Listings',
      icon: faTag,
    },
    {
      type: 'bid',
      name: 'Offers',
      icon: faHand,
    },
    {
      type: 'transfer',
      name: 'Transfer',
      icon: faRightLeft,
    },
    {
      type: 'mint',
      name: 'Mint',
      icon: faSeedling,
    },
  ]

  return (
    <Collapsible.Root
      open={open}
      key="hi"
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
          height: 'max-content',
          overflow: 'auto',
        }}
      >
        <Flex
          direction="column"
          css={{
            '& > div:first-of-type': {
              pt: 0,
            },
          }}
        >
          <Text style="subtitle1" css={{ mb: '$4', whiteSpace: 'nowrap' }}>
            Event Type
          </Text>
          {filters.map((filter) => (
            <Flex
              key={filter.type}
              css={{ mb: '$3', gap: '$3' }}
              align="center"
            >
              <Box css={{ color: '$gray11' }}>
                <FontAwesomeIcon icon={filter.icon} width={16} height={16} />
              </Box>
              <Text
                style="body1"
                css={{
                  flex: 1,
                }}
              >
                {filter.name}
              </Text>
              <Flex align="center">
                <Switch
                  checked={activityTypes?.includes(filter.type)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setActivityTypes([...activityTypes, filter.type])
                    } else {
                      setActivityTypes(
                        activityTypes.filter((item) => {
                          return item != filter.type
                        })
                      )
                    }
                  }}
                />
              </Flex>
            </Flex>
          ))}
        </Flex>
      </CollapsibleContent>
    </Collapsible.Root>
  )
}
