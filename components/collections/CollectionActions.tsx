import { faDiscord, faXTwitter } from '@fortawesome/free-brands-svg-icons'
import {
  faEllipsis,
  faGlobe,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCollections } from '@reservoir0x/reservoir-kit-ui'
import { styled } from '../../stitches.config'
import { Box, Flex } from 'components/primitives'
import { ComponentPropsWithoutRef, FC, useContext, useState } from 'react'
import { useMarketplaceChain, useMounted } from 'hooks'
import { useTheme } from 'next-themes'
import { Dropdown } from 'components/primitives/Dropdown'
import { useMediaQuery } from 'react-responsive'
import fetcher from 'utils/fetcher'
import { ToastContext } from 'context/ToastContextProvider'
import { spin } from 'components/common/LoadingSpinner'
import { DATE_REGEX, timeTill } from 'utils/till'

type CollectionActionsProps = {
  collection: NonNullable<ReturnType<typeof useCollections>['data']>['0']
}

const CollectionAction = styled(Flex, {
  px: '$4',
  py: '$4',
  color: '$gray12',
  background: '$gray2',
  cursor: 'pointer',
  transition: 'background 0.25s ease-in',
  height: 48,
  alignItems: 'center',
  '&:hover': {
    background: '$gray4',
  },
})

const CollectionActionDropdownItem = styled(Flex, {
  gap: '$3',
  cursor: 'pointer',
  alignItems: 'center',
  flexDirection: 'row',
  px: '$4',
  py: 20,
  transition: 'background 0.25s ease-in',
  '&:hover': {
    background: '$gray4',
  },
})

const CollectionActions: FC<CollectionActionsProps> = ({ collection }) => {
  const { addToast } = useContext(ToastContext)
  const isMounted = useMounted()
  const isMobile = useMediaQuery({ maxWidth: 600 }) && isMounted
  const [isRefreshing, setIsRefreshing] = useState(false)
  const marketplaceChain = useMarketplaceChain()
  const { theme } = useTheme()
  const etherscanImage = (
    <img
      src={
        isMounted && theme === 'dark'
          ? '/icons/etherscan-logo-light-circle.svg'
          : '/icons/etherscan-logo-circle.svg'
      }
      alt={marketplaceChain.blockExplorers?.default.name || 'Etherscan'}
      style={{
        height: 16,
        width: 16,
      }}
    />
  )

  const blockExplorerUrl = `${
    marketplaceChain?.blockExplorers?.default.url || 'https://etherscan.io'
  }/address/${collection?.id}`
  const twitterLink = collection?.twitterUsername
    ? `https://x.com/${collection?.twitterUsername}`
    : null

  const containerCss: ComponentPropsWithoutRef<typeof Flex>['css'] = {
    borderRadius: 8,
    overflow: 'hidden',
    gap: 0,
    bg: '$panelBg',
  }

  const dropdownContentProps: ComponentPropsWithoutRef<
    typeof Dropdown
  >['contentProps'] = {
    sideOffset: 4,
    style: { padding: 0, overflow: 'hidden' },
  }

  const collectionActionOverflowTrigger = (
    <CollectionAction>
      <FontAwesomeIcon icon={faEllipsis} width={16} height={16} />
    </CollectionAction>
  )

  const refreshMetadataItem = (
    <CollectionActionDropdownItem
      css={{
        cursor: isRefreshing ? 'not-allowed' : 'pointer',
      }}
      onClick={(e) => {
        if (isRefreshing) {
          e.preventDefault()
          return
        }
        setIsRefreshing(true)
        fetcher(
          `${process.env.NEXT_PUBLIC_PROXY_URL}${marketplaceChain.proxyApi}/collections/refresh/v2`,
          undefined,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ collection: collection.id }),
          }
        )
          .then(({ data, response }) => {
            if (response.status === 200) {
              addToast?.({
                title: 'Refresh collection',
                description: 'Request to refresh collection was accepted.',
              })
            } else {
              throw data
            }
            setIsRefreshing(false)
          })
          .catch((e) => {
            const ratelimit = DATE_REGEX.exec(e?.message)?.[0]

            addToast?.({
              title: 'Refresh collection failed',
              description: ratelimit
                ? `This collection was recently refreshed. The next available refresh is ${timeTill(
                    ratelimit
                  )}.`
                : `This collection was recently refreshed. Please try again later.`,
            })
            setIsRefreshing(false)
            throw e
          })
      }}
    >
      <Box
        css={{
          animation: isRefreshing
            ? `${spin} 1s cubic-bezier(0.76, 0.35, 0.2, 0.7) infinite`
            : 'none',
        }}
      >
        <FontAwesomeIcon icon={faRefresh} width={16} height={16} />
      </Box>
      Refresh Metadata
    </CollectionActionDropdownItem>
  )

  return (
    <Flex css={containerCss}>
      <a href={blockExplorerUrl} target="_blank" rel="noopener noreferrer">
        <CollectionAction>{etherscanImage}</CollectionAction>
      </a>
      {twitterLink && (
        <a href={twitterLink} target="_blank" rel="noopener noreferrer">
          <CollectionAction>
            <FontAwesomeIcon icon={faXTwitter} width={16} height={16} />
          </CollectionAction>
        </a>
      )}
      {collection?.discordUrl && (
        <a
          href={collection?.discordUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <CollectionAction>
            <FontAwesomeIcon icon={faDiscord} width={16} height={16} />
          </CollectionAction>
        </a>
      )}
      {collection?.externalUrl && (
        <a
          href={collection.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <CollectionAction>
            <FontAwesomeIcon icon={faGlobe} width={16} height={16} />
          </CollectionAction>
        </a>
      )}
      <Dropdown
        trigger={collectionActionOverflowTrigger}
        contentProps={dropdownContentProps}
      >
        {refreshMetadataItem}
      </Dropdown>
    </Flex>
  )
}

export default CollectionActions
