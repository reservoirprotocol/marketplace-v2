import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'
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

type CollectionActionsProps = {
  collection: NonNullable<ReturnType<typeof useCollections>['data']>['0']
}

const CollectionAction = styled(Flex, {
  px: '$4',
  py: '$3',
  color: '$gray12',
  background: '$panelBg',
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
    ? `https://twitter.com/${collection?.twitterUsername}`
    : null

  const containerCss: ComponentPropsWithoutRef<typeof Flex>['css'] = {
    borderRadius: 8,
    overflow: 'hidden',
    gap: 1,
    flexShrink: 0,
    mb: 'auto',
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
          `${window.location.origin}/${marketplaceChain.proxyApi}/collections/refresh/v1`,
          undefined,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ collection: collection.id }),
          }
        )
          .then(({ response }) => {
            if (response.status === 200) {
              addToast?.({
                title: 'Refresh collection',
                description: 'Request to refresh collection was accepted.',
              })
            } else {
              throw 'Request Failed'
            }
            setIsRefreshing(false)
          })
          .catch((e) => {
            addToast?.({
              title: 'Refresh collection failed',
              description:
                'We have queued this collection for an update, check back in a few.',
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

  if (isMobile) {
    return (
      <Flex css={containerCss}>
        <Dropdown
          trigger={collectionActionOverflowTrigger}
          contentProps={dropdownContentProps}
        >
          <Flex direction="column">
            <a
              href={blockExplorerUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CollectionActionDropdownItem>
                {etherscanImage}
                Etherscan
              </CollectionActionDropdownItem>
            </a>
            {collection?.externalUrl && (
              <a
                href={collection.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CollectionActionDropdownItem>
                  <FontAwesomeIcon icon={faGlobe} width={16} height={16} />
                  Website
                </CollectionActionDropdownItem>
              </a>
            )}
            {collection?.discordUrl && (
              <a
                href={collection.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CollectionActionDropdownItem>
                  <FontAwesomeIcon icon={faDiscord} width={16} height={16} />{' '}
                  Discord
                </CollectionActionDropdownItem>
              </a>
            )}
            {twitterLink && (
              <a href={twitterLink} target="_blank" rel="noopener noreferrer">
                <CollectionActionDropdownItem>
                  <FontAwesomeIcon icon={faTwitter} width={16} height={16} />{' '}
                  Twitter
                </CollectionActionDropdownItem>
              </a>
            )}
            {refreshMetadataItem}
          </Flex>
        </Dropdown>
      </Flex>
    )
  }

  return (
    <Flex css={containerCss}>
      <a href={blockExplorerUrl} target="_blank" rel="noopener noreferrer">
        <CollectionAction>{etherscanImage}</CollectionAction>
      </a>
      {twitterLink && (
        <a href={twitterLink} target="_blank" rel="noopener noreferrer">
          <CollectionAction>
            <FontAwesomeIcon icon={faTwitter} width={16} height={16} />
          </CollectionAction>
        </a>
      )}
      {collection?.discordUrl && (
        <a
          href={collection.discordUrl}
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
