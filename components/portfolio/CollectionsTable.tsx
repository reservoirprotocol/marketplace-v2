import { FC, useEffect, useRef } from 'react'
import { useMediaQuery } from 'react-responsive'
import {
  Text,
  Flex,
  TableCell,
  TableRow,
  HeaderRow,
  FormatCryptoCurrency,
  Anchor,
} from '../primitives'
import Image from 'next/image'
import { useIntersectionObserver } from 'usehooks-ts'
import LoadingSpinner from '../common/LoadingSpinner'
import Link from 'next/link'
import { MutatorCallback } from 'swr'
import { useTimeSince, useUserCollections } from 'hooks'
import CancelBid from 'components/buttons/CancelBid'
import { Address } from 'wagmi'
import { size } from 'lodash'

type Props = {
  address: Address | undefined
}

export const CollectionsTable: FC<Props> = ({ address }) => {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {
    rootMargin: '0px 0px 300px 0px',
  })

  const data = useUserCollections(address as string)

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      data.setSize(data.size + 1)
    }
  }, [loadMoreObserver?.isIntersecting])

  const collections = data.data

  console.log(collections)

  return (
    <>
      {/* {!data.isValidating &&
      !data.isLoading &&
      offers &&
      offers.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          css={{ py: '$6', gap: '$4', width: '100%' }}
        >
          <img src="/hand-icon.svg" width={40} height={40} />
          <Text css={{ color: '$gray11' }}>No offers made yet</Text>
        </Flex>
      ) : (
        <Flex direction="column" css={{ width: '100%' }}>
          <TableHeading />
          {offers.map((offer, i) => {
            if (!offer) return null

            return (
              <OfferTableRow
                key={`${offer?.id}-${i}`}
                offer={offer}
                mutate={data?.mutate}
              />
            )
          })}
          <div ref={loadMoreRef}></div>
        </Flex>
      )}
      {data.isValidating && (
        <Flex align="center" justify="center" css={{ py: '$6' }}>
          <LoadingSpinner />
        </Flex>
      )} */}
    </>
  )
}

type OfferTableRowProps = {
  offer: ReturnType<typeof useUserCollections>['data'][0]
  mutate?: MutatorCallback
}

const OfferTableRow: FC<OfferTableRowProps> = ({ offer, mutate }) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })

  if (isSmallDevice) {
    return (
      <Flex
        key={offer?.id}
        direction="column"
        align="start"
        css={{
          gap: '$3',
          borderBottom: '1px solid $gray3',
          py: '$3',
          width: '100%',
          overflow: 'hidden',
          flex: 1,
        }}
      >
        <Flex justify="between" css={{ width: '100%' }}>
          <Link href={`/${offer?.contract}/${offer?.id}`}>
            <Flex align="center">
              {offer?.criteria?.data?.token?.image && (
                <Image
                  style={{
                    borderRadius: '4px',
                    objectFit: 'cover',
                    aspectRatio: '1/1',
                  }}
                  loader={({ src }) => src}
                  src={offer?.criteria?.data?.token?.image as string}
                  alt={`${offer?.id}`}
                  width={36}
                  height={36}
                />
              )}
              <Flex
                direction="column"
                css={{
                  ml: '$2',
                  overflow: 'hidden',
                  minWidth: 0,
                }}
              >
                <Text style="subtitle3" ellipsify css={{ color: '$gray11' }}>
                  {offer?.criteria?.data?.collection?.name}
                </Text>
                <Text style="subtitle2" ellipsify>
                  #{offer?.criteria?.data?.token?.tokenId}
                </Text>
              </Flex>
            </Flex>
          </Link>
          <FormatCryptoCurrency
            amount={offer?.price?.amount?.native}
            address={offer?.price?.currency?.contract}
            textStyle="subtitle2"
            logoHeight={14}
          />
        </Flex>
        <Flex justify="between" align="center" css={{ width: '100%' }}>
          <a href={`https://${offer?.source?.domain}`} target="_blank">
            <Flex align="center" css={{ gap: '$2' }}>
              <img
                width="20px"
                height="20px"
                src={(offer?.source?.icon as string) || ''}
                alt={`${offer?.source?.name}`}
              />
              <Text style="subtitle2">{useTimeSince(offer?.expiration)}</Text>
            </Flex>
          </a>
          <CancelBid
            bidId={offer?.id as string}
            buttonChildren="Cancel"
            buttonCss={{ color: '$red11' }}
            mutate={mutate}
          />
        </Flex>
      </Flex>
    )
  }

  return (
    <TableRow
      key={offer?.id}
      css={{ gridTemplateColumns: '1.25fr .75fr 1fr 1fr 1fr' }}
    >
      <TableCell css={{ minWidth: 0 }}>
        <Link href={`/${offer?.contract}/${offer?.id}`}>
          <Flex align="center">
            {offer?.criteria?.data?.token?.image && (
              <Image
                style={{
                  borderRadius: '4px',
                  objectFit: 'cover',
                  aspectRatio: '1/1',
                }}
                loader={({ src }) => src}
                src={offer?.criteria?.data?.token?.image as string}
                alt={`${offer?.criteria?.data?.token?.name}`}
                width={48}
                height={48}
              />
            )}
            <Flex
              direction="column"
              css={{
                ml: '$2',
                overflow: 'hidden',
              }}
            >
              <Text style="subtitle3" ellipsify css={{ color: '$gray11' }}>
                {offer?.criteria?.data?.collection?.name}
              </Text>
              <Text style="subtitle2" ellipsify>
                #{offer?.criteria?.data?.collection?.id}
              </Text>
            </Flex>
          </Flex>
        </Link>
      </TableCell>
      <TableCell>
        <FormatCryptoCurrency
          amount={offer?.price?.amount?.native}
          address={offer?.price?.currency?.contract}
          textStyle="subtitle2"
          logoHeight={14}
        />
      </TableCell>
      <TableCell>
        <Text style="subtitle2">{useTimeSince(offer?.expiration)}</Text>
      </TableCell>
      <TableCell>
        <Flex align="center" css={{ gap: '$2' }}>
          <img
            width="20px"
            height="20px"
            src={(offer?.source?.icon as string) || ''}
            alt={`${offer?.source?.name}`}
          />
          <Anchor
            href={`https://${offer?.source?.domain as string}`}
            target="_blank"
            color="primary"
            weight="normal"
          >
            {offer?.source?.name as string}
          </Anchor>
        </Flex>
      </TableCell>
      <TableCell>
        <Flex justify="end">
          <CancelBid
            bidId={offer?.id as string}
            buttonChildren="Cancel"
            buttonCss={{ color: '$red11' }}
            mutate={mutate}
          />
        </Flex>
      </TableCell>
    </TableRow>
  )
}

const TableHeading = () => (
  <HeaderRow
    css={{
      display: 'none',
      '@md': { display: 'grid' },
      gridTemplateColumns: '1.25fr .75fr 1fr 1fr 1fr',
    }}
  >
    <TableCell>
      <Text style="subtitle3" css={{ color: '$gray11' }}>
        Collection
      </Text>
    </TableCell>
    <TableCell>
      <Text style="subtitle3" css={{ color: '$gray11' }}>
        Volume
      </Text>
    </TableCell>
    <TableCell>
      <Text style="subtitle3" css={{ color: '$gray11' }}>
        Top Offer
      </Text>
    </TableCell>
    <TableCell>
      <Text style="subtitle3" css={{ color: '$gray11' }}>
        Floor Price
      </Text>
    </TableCell>
    <TableCell>
      <Text style="subtitle3" css={{ color: '$gray11' }}>
        Owned
      </Text>
    </TableCell>
  </HeaderRow>
)
