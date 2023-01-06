import { Text, Button } from '../primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useChainModal } from '@rainbow-me/rainbowkit'
import { useNetwork } from 'wagmi'
import supportedChains from 'utils/chains'
import { useMediaQuery } from 'react-responsive'
import { useMounted } from 'hooks'

const ChainSwitcher = () => {
  const isMounted = useMounted()
  const isSmallDevice = useMediaQuery({ maxWidth: 600 }) && isMounted
  const { openChainModal } = useChainModal()
  const { chain } = useNetwork()
  const supportedChain = supportedChains.find(
    (supportedChain) => supportedChain.id === chain?.id
  )
  const mainnet = supportedChains.find((chain) => chain.id === 1)
  const chainName = supportedChain ? supportedChain.name : mainnet?.name
  const chainIcon = supportedChain ? supportedChain.iconUrl : mainnet?.iconUrl

  return (
    <Button color="gray3" size="small" onClick={openChainModal}>
      <img style={{ height: 17 }} src={chainIcon} />
      {isSmallDevice ? null : <Text style="body1">{chainName}</Text>}
      <Text css={{ color: '$slate10' }}>
        <FontAwesomeIcon icon={faChevronDown} width={16} height={16} />
      </Text>
    </Button>
  )
}

export default ChainSwitcher
