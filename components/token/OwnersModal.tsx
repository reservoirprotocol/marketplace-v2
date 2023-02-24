import {FC, ReactElement, useEffect, useRef} from 'react'
import { paths } from '@nftearth/reservoir-sdk'
import {DialogPortal, DialogTrigger, Root as DialogRoot} from "@radix-ui/react-dialog";
import {Anchor, Flex, HeaderRow, TableCell, TableRow, Text} from "../primitives";
import {Content} from "../primitives/Dialog";
import Link from "next/link";
import {useIntersectionObserver} from "usehooks-ts";
import { useENSResolver, useMarketplaceChain, useMounted, useOwners } from "hooks";
import LoadingSpinner from "../common/LoadingSpinner";

type Props = {
  token: paths['/owners/v1']['get']['parameters']["query"]["token"],
  children: ReactElement
}

type TokenOwnerRowProps = {
  // @ts-ignore
  data: paths['/owners/v1']['get']["responses"]["200"]["schema"]["owners"][0]
}

const gridTemplateColumns = '1fr 100px';

const TokenOwnerRow : FC<TokenOwnerRowProps> = ({ data }) => {
  const { displayName: ownerDisplayName } = useENSResolver(data?.address)

  return (
    <TableRow css={{
      gridTemplateColumns,
      px: '$4',
      py: '$1'
    }}>
      <TableCell >
        <Link href={`/profile/${data.address}`} legacyBehavior={true}>
          <Anchor color="primary" weight="normal" css={{ ml: '$1' }}>
            {ownerDisplayName}
          </Anchor>
        </Link>
      </TableCell>
      <TableCell css={{ textAlign: 'center' }}>
        <Text style="body1">{data.ownership.tokenCount}</Text>
      </TableCell>
    </TableRow>
  )
}

export const OwnersModal: FC<Props> = ({ token, children }) => {
  const isMounted = useMounted()
  const marketplaceChain = useMarketplaceChain();
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})

  let ownersQuery: Parameters<typeof useOwners>['1'] = {
    token,
    limit: 500,
  }
  const {
    data: owners,
    isFetchingPage,
    isValidating,
    fetchNextPage
  } = useOwners(
    marketplaceChain,
    ownersQuery,
    {
      revalidateOnMount: true,
      fallbackData: [],
      revalidateFirstPage: true,
    }
  )

  console.log(owners);

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      fetchNextPage()
    }
  }, [loadMoreObserver?.isIntersecting, isFetchingPage])

  if (!isMounted) {
    return null;
  }

  return (
    <DialogRoot modal={false}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogPortal>
        <Content
          css={{
            top: '20%',
            zIndex: 9999,
            maxWidth: 500,
            minWidth: 350,
            maxHeight: 400
          }}
        >
          <HeaderRow css={{
            backgroundColor: '$primary5',
            display: 'grid',
            gridTemplateColumns,
            top: 0,
            position: 'sticky',
            px: '$4',
            py: '$1'
          }}>
            <TableCell >
              <Text style="body1">Owner</Text>
            </TableCell>
            <TableCell css={{ textAlign: 'center' }}>
              <Text style="body1">Count</Text>
            </TableCell>
          </HeaderRow>
          {owners.map(d => (
            <TokenOwnerRow key={`owner-${token}-${d.address}`} data={d}/>
          ))}
          <Flex ref={loadMoreRef}/>
          {isValidating && (
            <Flex align="center" justify="center" css={{ py: '$5' }}>
              <LoadingSpinner />
            </Flex>
          )}
        </Content>
      </DialogPortal>
    </DialogRoot>
  )
}
