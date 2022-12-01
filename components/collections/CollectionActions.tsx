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
import { FC } from 'react'
import { useEnvChain } from 'hooks'
import { useTheme } from 'next-themes'
import { Dropdown } from 'components/primitives/Dropdown'

type CollectionActionsProps = {
  collection: NonNullable<ReturnType<typeof useCollections>['data']>['0']
}

const CollectionAction = styled(Flex, {
  px: '$4',
  py: '$3',
  color: '$gray12',
  background: '$gray3',
  cursor: 'pointer',
  transition: 'background 0.25s ease-in',
  height: 48,
  alignItems: 'center',
  '&:hover': {
    background: '$gray4',
  },
})

const CollectionActions: FC<CollectionActionsProps> = ({ collection }) => {
  const envChain = useEnvChain()
  const { theme } = useTheme()
  const etherscanLogo =
    theme === 'dark'
      ? '/icons/etherscan-logo-light-circle.svg'
      : '/icons/etherscan-logo-circle.svg'

  const blockExplorerUrl = `${
    envChain?.blockExplorers?.default.url || 'https://etherscan.io'
  }/address/${collection?.id}`

  const collectionActionOverflowTrigger = (
    <CollectionAction>
      <FontAwesomeIcon icon={faEllipsis} width={16} height={16} />
    </CollectionAction>
  )

  return (
    <Flex
      align="start"
      css={{ borderRadius: 8, overflow: 'hidden', mb: 'auto', gap: 1 }}
    >
      <a href={blockExplorerUrl} target="_blank" rel="noopener noreferrer">
        <CollectionAction>
          <img
            src={etherscanLogo}
            alt="Etherscan Icon"
            style={{
              height: 16,
              width: 16,
            }}
          />
        </CollectionAction>
      </a>
      {collection.twitterUsername && (
        <a
          href={`https://twitter.com/${collection?.twitterUsername}`}
          target="_blank"
          rel="noopener noreferrer"
        >
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
        contentProps={{ sideOffset: 4 }}
      >
        <Flex
          css={{
            p: '$2',
          }}
        >
          <Flex align="center" css={{ gap: '$3', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faRefresh} width={16} height={16} />
            Refresh Metadata
          </Flex>
        </Flex>
      </Dropdown>
    </Flex>
  )
}

export default CollectionActions
