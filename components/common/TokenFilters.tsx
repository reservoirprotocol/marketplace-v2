import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Collapsible from '@radix-ui/react-collapsible'
import { useUserCollections } from '@reservoir0x/reservoir-kit-ui'
import { paths } from '@reservoir0x/reservoir-sdk'
import { NAVBAR_HEIGHT } from 'components/navbar'
import { Flex, Text } from 'components/primitives'
import { CollapsibleContent } from 'components/primitives/Collapsible'
import Image from 'next/image'
import { Dispatch, FC, SetStateAction } from 'react'
import LoadingSpinner from './LoadingSpinner'

type Collections =
  | paths['/users/{user}/collections/v2']['get']['responses']['200']['schema']['collections']
  | ReturnType<typeof useUserCollections>['data']

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  collections: Collections
  filterCollection: string | undefined
  setFilterCollection: Dispatch<SetStateAction<string | undefined>>
  scrollToTop?: () => void
  isLoading?: boolean
}

export const TokenFilters: FC<Props> = ({
  open,
  setOpen,
  collections,
  filterCollection,
  isLoading,
  setFilterCollection,
  scrollToTop,
}) => {
  return (
    <Collapsible.Root
      open={open}
      key="Token Filter"
      onOpenChange={setOpen}
      style={{
        transition: 'width .5s',
        width: open ? 350 : 0,
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
        <Flex
          direction="column"
          css={{
            overflowY: 'scroll',
          }}
        >
          <Text style="subtitle1" css={{ mb: '$2', ml: '$3' }}>
            Collections
          </Text>

          {collections?.length ? (
            collections?.map((collection) => {
              let selected = collection?.collection?.id == filterCollection
              return (
                <Flex
                  key={collection?.collection?.id}
                  css={{
                    py: '$2',
                    px: '$3',
                    gap: '$3',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: selected ? '$gray5' : '$gray4',
                    },
                    backgroundColor: selected ? '$gray5' : '',
                  }}
                  align="center"
                  onClick={() => {
                    if (selected) {
                      setFilterCollection(undefined)
                    } else {
                      setFilterCollection(collection?.collection?.id)
                    }
                    scrollToTop?.()
                  }}
                >
                  {collection?.collection?.image && (
                    <Image
                      style={{
                        borderRadius: '4px',
                        objectFit: 'cover',
                        aspectRatio: '1/1',
                      }}
                      loader={({ src }) => src}
                      src={collection?.collection?.image as string}
                      alt={collection?.collection?.name as string}
                      width={24}
                      height={24}
                    />
                  )}
                  <Text
                    style="body1"
                    css={{
                      flex: 1,
                    }}
                    ellipsify
                  >
                    {collection?.collection?.name}
                  </Text>
                  <Text style="subtitle2" css={{ color: '$gray10' }}>
                    {collection?.ownership?.tokenCount}
                  </Text>
                </Flex>
              )
            })
          ) : (
            <>
              {isLoading ? (
                <Flex align="center" justify="center" css={{ py: '$5' }}>
                  <LoadingSpinner />
                </Flex>
              ) : (
                <Flex
                  direction="column"
                  align="center"
                  css={{ py: '$6', gap: '$4', width: '100%' }}
                >
                  <Text css={{ color: '$gray11' }}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} size="2xl" />
                  </Text>
                  <Text css={{ color: '$gray11' }}>
                    No collections available
                  </Text>
                </Flex>
              )}
            </>
          )}
        </Flex>
      </CollapsibleContent>
    </Collapsible.Root>
  )
}
