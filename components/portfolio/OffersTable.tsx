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
  Button,
} from '../primitives'
import Image from 'next/image'
import { useIntersectionObserver } from 'usehooks-ts'
import LoadingSpinner from '../common/LoadingSpinner'
import { useBids } from '@reservoir0x/reservoir-kit-ui'
import Link from 'next/link'
import { MutatorCallback } from 'swr'
import { useTimeSince } from 'hooks'
import CancelBid from 'components/buttons/CancelBid'
import { Address } from 'wagmi'

type Props = {
  address: Address | undefined
}

const desktopTemplateColumns = '1.25fr .75fr repeat(3, 1fr)'

export const OffersTable: FC<Props> = ({ address }) => {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {
    rootMargin: '0px 0px 300px 0px',
  })

  const {
    data: offers,
    fetchNextPage,
    mutate,
    isValidating,
    isFetchingPage,
  } = useBids({
    maker: address,
    includeCriteriaMetadata: true,
  })

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      fetchNextPage()
    }
  }, [loadMoreObserver?.isIntersecting])

  return (
    <>
      {!isValidating && !isFetchingPage && offers && offers.length === 0 ? (
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
            return (
              <OfferTableRow
                key={`${offer?.id}-${i}`}
                offer={offer}
                mutate={mutate}
              />
            )
          })}
          <div ref={loadMoreRef}></div>
        </Flex>
      )}
      {isValidating && (
        <Flex align="center" justify="center" css={{ py: '$6' }}>
          <LoadingSpinner />
        </Flex>
      )}
    </>
  )
}

type OfferTableRowProps = {
  offer: ReturnType<typeof useBids>['data'][0]
  mutate?: MutatorCallback
}

const OfferTableRow: FC<OfferTableRowProps> = ({ offer, mutate }) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })
  const expiration = useTimeSince(offer?.expiration)

  let criteriaData = offer?.criteria?.data

  let imageSrc: string = (
    criteriaData?.token?.tokenId
      ? criteriaData?.token?.image || criteriaData?.collection?.image
      : criteriaData?.collection?.image
  ) as string

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
          <Link href={`/${offer?.contract}/${criteriaData?.token?.tokenId}`}>
            <Flex align="center">
              {imageSrc && (
                <Image
                  style={{
                    borderRadius: '4px',
                    objectFit: 'cover',
                    aspectRatio: '1/1',
                  }}
                  loader={({ src }) => src}
                  src={imageSrc}
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
                  {criteriaData?.collection?.name}
                </Text>
                <Text style="subtitle2" ellipsify>
                  #{criteriaData?.token?.tokenId}
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
              <Text style="subtitle2">{expiration}</Text>
            </Flex>
          </a>
          <CancelBid
            bidId={offer?.id as string}
            mutate={mutate}
            trigger={
              <Button css={{ color: '$red11' }} color="gray3">
                Cancel
              </Button>
            }
          />
        </Flex>
      </Flex>
    )
  }

  return (
    <TableRow
      key={offer?.id}
      css={{ gridTemplateColumns: desktopTemplateColumns }}
    >
      <TableCell css={{ minWidth: 0 }}>
        <Link href={`/${offer?.contract}/${criteriaData?.token?.tokenId}`}>
          <Flex align="center">
            {imageSrc && (
              <Image
                style={{
                  borderRadius: '4px',
                  objectFit: 'cover',
                  aspectRatio: '1/1',
                }}
                loader={({ src }) => src}
                src={imageSrc}
                alt={`${criteriaData?.token?.name}`}
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
                {criteriaData?.collection?.name}
              </Text>
              <Text style="subtitle2" ellipsify>
                #{criteriaData?.collection?.id}
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
        <Text style="subtitle2">{expiration}</Text>
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
            mutate={mutate}
            trigger={
              <Button css={{ color: '$red11' }} color="gray3">
                Cancel
              </Button>
            }
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
      gridTemplateColumns: desktopTemplateColumns,
    }}
  >
    <TableCell>
      <Text style="subtitle3" subtleColor>
        Items
      </Text>
    </TableCell>
    <TableCell>
      <Text style="subtitle3" subtleColor>
        Offer Amount
      </Text>
    </TableCell>
    <TableCell>
      <Text style="subtitle3" subtleColor>
        Expiration
      </Text>
    </TableCell>
    <TableCell>
      <Text style="subtitle3" subtleColor>
        Marketplace
      </Text>
    </TableCell>
    <TableCell></TableCell>
  </HeaderRow>
)
