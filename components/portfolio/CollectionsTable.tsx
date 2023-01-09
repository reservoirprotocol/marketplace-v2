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

  return <></>
}
