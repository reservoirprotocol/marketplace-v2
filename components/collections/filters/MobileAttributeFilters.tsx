import { FC, useEffect, useState } from 'react'
import * as RadixDialog from '@radix-ui/react-dialog'
import { Box, Button, Flex, Text } from 'components/primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { useAttributes } from '@reservoir0x/reservoir-kit-ui'
import { AttributeSelector } from './AttributeSelector'
import { clearAllAttributes } from 'utils/router'
import { FullscreenModal } from 'components/common/FullscreenModal'
import { NAVBAR_HEIGHT_MOBILE } from 'components/navbar'

type Props = {
  attributes: ReturnType<typeof useAttributes>['data'] | undefined
  scrollToTop: () => void
}

export const MobileAttributeFilters: FC<Props> = ({
  attributes,
  scrollToTop,
}) => {
  const router = useRouter()
  const [filtersLength, setFiltersLength] = useState(0)

  useEffect(() => {
    let filters = []

    // Extract all queries of attribute type
    Object.keys({ ...router.query }).map((key) => {
      if (
        key.startsWith('attributes[') &&
        key.endsWith(']') &&
        router.query[key] !== ''
      ) {
        if (Array.isArray(router.query[key])) {
          let values = router.query[key] as string[]
          values.forEach((value) => {
            filters.push({ key: key.slice(11, -1), value: value })
          })
        } else {
          filters.push({ key: key.slice(11, -1), value: router.query[key] })
        }
      }
    })

    setFiltersLength(filters.length)
  }, [router.query])

  let filtersEnabled = filtersLength > 0

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
          boxShadow: '0px 1px 5px rgba(0,0,0,0.2)',
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
            {filtersLength}
          </Flex>
        )}
      </Button>
    </Flex>
  )

  if (
    (attributes && attributes?.length === 0) ||
    attributes === null ||
    attributes === undefined
  ) {
    return null
  }

  return (
    <FullscreenModal trigger={trigger}>
      {' '}
      <Flex
        css={{
          flexDirection: 'column',
          height: '100%',
          width: '100%',
        }}
      >
        <Flex
          css={{
            height: NAVBAR_HEIGHT_MOBILE,
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
                {filtersLength}
              </Flex>
            )}
            {filtersEnabled && (
              <Button
                onClick={() => clearAllAttributes(router)}
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
          css={{
            width: '100%',
            maxHeight: `calc(100vh - ${NAVBAR_HEIGHT_MOBILE}px)`,
            overflowY: 'auto',
          }}
        >
          <Box
            css={{
              width: '100%',
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
        </Flex>
      </Flex>
    </FullscreenModal>
  )
}
