import {
  Flex,
  FormatCryptoCurrency,
  Text,
  Tooltip,
} from 'components/primitives'
import { Dispatch, FC, SetStateAction, useMemo } from 'react'
import * as Collapsible from '@radix-ui/react-collapsible'
import { CollapsibleContent } from 'components/primitives/Collapsible'
import Image from 'next/image'
import { NAVBAR_HEIGHT } from 'components/navbar'
import { useUserCollections } from '@reservoir0x/reservoir-kit-ui'
import { OpenSeaVerified } from './OpenSeaVerified'
import { PercentChange } from 'components/primitives/PercentChange'
import LoadMoreCollections from 'components/common/LoadMoreCollections'
import optimizeImage from 'utils/optimizeImage'

type Collections = ReturnType<typeof useUserCollections>['data']

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  collections: Collections
  filterCollection: string | undefined
  setFilterCollection: Dispatch<SetStateAction<string | undefined>>
  scrollToTop?: () => void
  loadMoreCollections: () => void
  isLoading?: boolean
  isOwner?: boolean
}

export const TokenFilters: FC<Props> = ({
  open,
  setOpen,
  collections,
  filterCollection,
  setFilterCollection,
  isLoading,
  isOwner,
  scrollToTop,
  loadMoreCollections,
}) => {
  if (collections?.length === 0 || collections == null || isLoading) {
    return null
  }
  return (
    <Collapsible.Root
      open={open}
      key="Token Filter"
      onOpenChange={setOpen}
      style={{
        transition: 'width .5s',
        width: open ? 350 : 0,
        zIndex: 900,
      }}
    >
      <CollapsibleContent
        css={{
          position: 'sticky',
          top: 16 + 80,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px - ${isOwner ? 90 : 32})`,
          overflow: 'auto',
        }}
      >
        <Flex direction="column">
          <Text style="subtitle1" css={{ mb: '$2', ml: '$3' }}></Text>
          {collections?.map((collection) => {
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
                    src={optimizeImage(
                      collection?.collection?.image as string,
                      250
                    )}
                    alt={collection?.collection?.name as string}
                    width={24}
                    height={24}
                  />
                )}
                <Flex direction="column" css={{ minWidth: 0 }}>
                  <Flex css={{ gap: '$1' }}>
                    <Text
                      style="body1"
                      css={{
                        flex: 1,
                      }}
                      ellipsify
                    >
                      {collection?.collection?.name}
                    </Text>
                    <OpenSeaVerified
                      openseaVerificationStatus={
                        collection?.collection?.openseaVerificationStatus
                      }
                    />
                  </Flex>
                  <Text style="subtitle3" css={{ color: '$gray10' }}>
                    Owned: {collection?.ownership?.tokenCount}
                  </Text>
                </Flex>
                <Flex
                  direction="column"
                  css={{ ml: 'auto', flexShrink: 0, alignItems: 'end' }}
                >
                  <Flex css={{ gap: '$1' }}>
                    <Text style="subtitle2">Floor</Text>
                    <FormatCryptoCurrency
                      logoHeight={15}
                      amount={
                        collection.collection?.floorAskPrice?.amount?.decimal
                      }
                      address={
                        collection.collection?.floorAskPrice?.currency?.contract
                      }
                      textStyle="subtitle2"
                    />
                  </Flex>
                  <Tooltip
                    sideOffset={2}
                    side="top"
                    content={
                      <Text style="body3" css={{ display: 'block' }}>
                        24h Floor Price Change
                      </Text>
                    }
                  >
                    <div>
                      <PercentChange
                        value={collection.collection?.volumeChange?.['1day']}
                        decimals={1}
                      />
                    </div>
                  </Tooltip>
                </Flex>
              </Flex>
            )
          })}
          <LoadMoreCollections loadMore={loadMoreCollections} />
        </Flex>
      </CollapsibleContent>
    </Collapsible.Root>
  )
}
