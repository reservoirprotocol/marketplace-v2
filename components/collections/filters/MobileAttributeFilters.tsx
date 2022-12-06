import { FC, useEffect, useState } from 'react'
import { Content } from 'components/primitives/Dialog'
import {
  Root as DialogRoot,
  DialogTrigger,
  DialogPortal,
} from '@radix-ui/react-dialog'
import * as RadixDialog from '@radix-ui/react-dialog'
import { Box, Button, Flex, Text } from 'components/primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { useAttributes } from '@reservoir0x/reservoir-kit-ui'
import { AttributeSelector } from './AttributeSelector'
import { clearAllAttributes } from 'utils/router'

type Props = {
  attributes: ReturnType<typeof useAttributes>['data'] | undefined
  scrollToTop: () => void
}

export const MobileActivityFilters: FC<Props> = ({
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
          ;(router.query[key] as string[]).map((value) => {
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

  const children = (
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
                  attribute={attribute}
                  scrollToTop={scrollToTop}
                />
              ))}
        </Box>
      </Flex>
    </Flex>
  )
  return (
    <DialogRoot modal={false}>
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
        <DialogTrigger asChild>
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
                {filtersLength}
              </Flex>
            )}
          </Button>
        </DialogTrigger>
      </Flex>
      <DialogPortal>
        <Content
          onInteractOutside={(e) => {
            e.preventDefault()
          }}
          css={{
            width: '100%',
            height: '100%',
            borderRadius: '0px',
            border: '0px',
            minWidth: '100%',
            maxWidth: '100vw',
            maxHeight: '100vh',
            top: '0%',
            zIndex: 9999,
          }}
        >
          {children}
        </Content>
      </DialogPortal>
    </DialogRoot>
  )
}
