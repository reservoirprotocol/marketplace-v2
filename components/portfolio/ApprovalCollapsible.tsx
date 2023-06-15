import { FC, useEffect, useMemo, useState } from 'react'
import { Flex, Box, Text } from '../primitives'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  CollapsibleContent,
  CollapsibleRoot,
  slideDown,
  slideUp,
} from '../primitives/Collapsible'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { Execute } from '@reservoir0x/reservoir-sdk'
import { BatchListingData } from './BatchListModal'
import { styled } from '@stitches/react'
import { Marketplace } from './BatchListings'
import LoadingSpinner from 'components/common/LoadingSpinner'
import optimizeImage from 'utils/optimizeImage'

const Img = styled('img', {
  height: 24,
  width: 24,
  borderRadius: 4,
  objectFit: 'cover',
  '& + img': {
    marginLeft: -10,
  },
})

type Props = {
  item: NonNullable<NonNullable<Execute['steps']>[0]['items']>[0]
  batchListingData: BatchListingData[]
  selectedMarketplaces: Marketplace[]
  open?: boolean
}

export const ApprovalCollapsible: FC<Props> = ({
  item,
  batchListingData,
  selectedMarketplaces,
  open,
}) => {
  const [collapsibleOpen, setCollapsibleOpen] = useState(false)

  let isComplete = item.status == 'complete'

  const orderIndexes = item?.orderIndexes || []

  const marketplacesSeekingApproval = useMemo(() => {
    let uniqueMarketplaces: Marketplace[] = []

    orderIndexes.forEach((orderIndex) => {
      if (batchListingData[orderIndex]) {
        const listing = batchListingData[orderIndex].listing

        const marketplace = selectedMarketplaces.find(
          (m) => m.orderbook === listing.orderbook
        )

        if (
          marketplace &&
          !uniqueMarketplaces.find(
            (uniqueMarketplace) =>
              uniqueMarketplace.orderbook === marketplace.orderbook
          )
        ) {
          uniqueMarketplaces.push(marketplace)
        }
      }
    })
    return uniqueMarketplaces
  }, [orderIndexes, item, batchListingData])

  const marketplaceNames = useMemo(() => {
    return marketplacesSeekingApproval
      .map((marketplace) => marketplace.name)
      .join(' and ')
  }, [marketplacesSeekingApproval])

  const collectionImage: string = useMemo(() => {
    const token = batchListingData[orderIndexes[0]]?.token?.token
    return (
      optimizeImage(token?.collection?.imageUrl, 250) || token?.imageSmall || ''
    )
  }, [batchListingData, orderIndexes])

  const collectionName =
    batchListingData[orderIndexes[0]]?.token?.token?.collection?.name ||
    'collection'

  useEffect(() => {
    if (open !== undefined && open !== collapsibleOpen) {
      setCollapsibleOpen(open)
    }
  }, [open])

  useEffect(() => {
    if (isComplete) {
      setCollapsibleOpen(false)
    }
  }, [isComplete])

  if (batchListingData[orderIndexes[0]] == undefined) {
    return null
  }

  return (
    <CollapsibleRoot
      onOpenChange={(open) => {
        setCollapsibleOpen(open)
      }}
      open={collapsibleOpen}
      css={{ backgroundColor: '$gray3', width: '100%' }}
    >
      <CollapsiblePrimitive.Trigger asChild>
        <Flex justify="between" css={{ px: '$4', py: '$3' }}>
          <Flex align="center" css={{ gap: '$3' }}>
            <Box
              css={{
                width: 18,
                height: 18,
                backgroundColor: isComplete ? '$green6' : '$indigo6',
                borderColor: isComplete ? '$green9' : '$indigo9',
                borderStyle: 'solid',
                borderWidth: 4,
                borderRadius: 999,
              }}
            />
            <Text
              style="subtitle2"
              css={{ color: isComplete ? '$gray11' : '$gray12' }}
            >
              Approve Collection
            </Text>
          </Flex>
          <Box
            css={{
              color: '$neutralSolid',
              transform: collapsibleOpen ? 'rotate(180deg)' : 'rotate(0)',
              transition: '.3s',
            }}
          >
            <FontAwesomeIcon icon={faChevronDown} />
          </Box>
        </Flex>
      </CollapsiblePrimitive.Trigger>
      <CollapsibleContent
        css={{
          '&[data-state="open"]': {
            animation: `${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1)`,
          },
          '&[data-state="closed"]': {
            animation: `${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1)`,
          },
        }}
      >
        <Flex
          align="center"
          justify="between"
          css={{
            px: '$4',
            pb: '$2',
            width: '100%',
            gap: '$2',
          }}
        >
          <Flex css={{ gap: '$2' }}>
            <Flex align="center">
              <Img src={collectionImage} />
              {marketplacesSeekingApproval.map((marketplace) => (
                <Img src={marketplace.imageUrl} />
              ))}
            </Flex>
            <Text style="body3" ellipsify>
              Approve {collectionName} on {marketplaceNames}
            </Text>
          </Flex>
          <Flex>
            {item.txHash && item.status == 'incomplete' ? (
              <LoadingSpinner
                css={{
                  width: 18,
                  height: 18,
                  borderWidth: 2,
                  borderBottomColor: '$indigo10',
                }}
              />
            ) : null}
          </Flex>
        </Flex>
      </CollapsibleContent>
    </CollapsibleRoot>
  )
}
