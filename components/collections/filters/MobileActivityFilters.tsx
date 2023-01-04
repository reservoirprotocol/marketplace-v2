import { FC } from 'react'
import * as RadixDialog from '@radix-ui/react-dialog'
import { Box, Button, Flex, Switch, Text } from 'components/primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHand,
  faRightLeft,
  faSeedling,
  faShoppingCart,
  faTag,
  faXmark,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { FullscreenModal } from 'components/common/FullscreenModal'
import { useCollectionActivity } from '@reservoir0x/reservoir-kit-ui'

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
  activityTypes: NonNullable<ActivityTypes>
  setActivityTypes: (activityTypes: ActivityTypes) => void
}

export const MobileActivityFilters: FC<Props> = ({
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

  let filtersEnabled = activityTypes.length > 0

  const trigger = (
    <Flex
      justify="center"
      css={{
        position: 'fixed',
        left: 0,
        bottom: '70px',
        width: '100vw',
        zIndex: 99,
      }}
    >
      <Button
        css={{
          justifyContent: 'center',
          alignItems: 'center',
          justifyItems: 'center',
          position: 'fixed',
          px: '$6',
          py: '$3',
        }}
        type="button"
        size="small"
        corners="pill"
        color="gray3"
      >
        <Text style="h6">Filter</Text>
        {filtersEnabled && (
          <Flex
            justify="center"
            align="center"
            css={{
              height: '24px',
              width: '24px',
              backgroundColor: '$gray4',
              borderRadius: '100%',
              fontSize: 'medium',
              fontWeight: '500',
            }}
          >
            {activityTypes.length}
          </Flex>
        )}
      </Button>
    </Flex>
  )

  return (
    <FullscreenModal trigger={trigger}>
      {' '}
      <Flex
        css={{
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Flex
          css={{
            py: '$4',
            px: '$4',
            width: '100%',
            borderBottom: '1px solid $gray4',
          }}
          align="center"
          justify="between"
        >
          <Flex align="center">
            <Text style="h5" css={{ mr: '$3' }}>
              Filter
            </Text>
            {filtersEnabled && (
              <Flex
                justify="center"
                css={{
                  height: '24px',
                  width: '24px',
                  backgroundColor: '$gray3',
                  borderRadius: '100%',
                  mr: '$3',
                }}
              >
                {activityTypes.length}
              </Flex>
            )}
            {filtersEnabled && (
              <Button
                onClick={() => {
                  setActivityTypes([])
                }}
                color="ghost"
                size="small"
                css={{ color: '$primary11', fontWeight: 400 }}
              >
                Clear all
              </Button>
            )}
          </Flex>
          <RadixDialog.Close>
            <Flex
              css={{
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                alignItems: 'center',
                borderRadius: 8,
                backgroundColor: '$gray3',
                color: '$gray12',
                '&:hover': {
                  backgroundColor: '$gray4',
                },
              }}
            >
              <FontAwesomeIcon icon={faXmark} width={16} height={16} />
            </Flex>
          </RadixDialog.Close>
        </Flex>
        <Flex
          direction="column"
          css={{
            p: '$4',
            '& > div:first-of-type': {
              pt: 0,
            },
          }}
        >
          <Text style="subtitle1" css={{ mb: '$4' }}>
            Event Type
          </Text>
          {filters.map((filter) => (
            <Flex
              key={filter.name}
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
      </Flex>
    </FullscreenModal>
  )
}
