import { Text, Button, Flex } from '../primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import supportedChains from 'utils/chains'
import { useMediaQuery } from 'react-responsive'
import { useMounted } from 'hooks'
import { Dropdown, DropdownMenuItem } from 'components/primitives/Dropdown'
import { useContext } from 'react'
import { ChainContext } from 'context/ChainContextProvider'

const ChainSwitcher = () => {
  const isMounted = useMounted()
  const isSmallDevice = useMediaQuery({ maxWidth: 600 }) && isMounted
  const { chain, switchCurrentChain } = useContext(ChainContext)

  if (supportedChains.length === 1) {
    return null
  }

  const supportedChain = supportedChains.find(
    (supportedChain) => supportedChain.id === chain?.id
  )
  const mainnet = supportedChains.find((chain) => chain.id === 1)
  const chainName = supportedChain ? supportedChain.name : mainnet?.name
  const chainIcon = supportedChain ? supportedChain.iconUrl : mainnet?.iconUrl

  const trigger = (
    <Button aria-label={chainName} color="gray3" size="small" css={{ py: '$3' }}>
      <img style={{ height: 17 }} src={chainIcon} />
      {isSmallDevice ? null : <Text style="body1">{chainName}</Text>}
      <Text css={{ color: '$slate10' }}>
        <FontAwesomeIcon icon={faChevronDown} width={16} height={16} />
      </Text>
    </Button>
  )

  return (
    <Dropdown trigger={trigger} contentProps={{ sideOffset: 5 }}>
      {supportedChains.map((chainOption) => {
        return (
          <DropdownMenuItem
            key={chainOption.id}
            onClick={() => {
              switchCurrentChain(chainOption.id)
            }}
          >
            <Flex align="center" css={{ cursor: 'pointer' }}>
              <img alt={chainOption?.name} style={{ height: 17, width: 17 }} src={chainOption.iconUrl} />
              <Text style="body1" css={{ ml: '$2' }}>
                {chainOption.name}
              </Text>
            </Flex>
          </DropdownMenuItem>
        )
      })}
    </Dropdown>
  )
}

export default ChainSwitcher
