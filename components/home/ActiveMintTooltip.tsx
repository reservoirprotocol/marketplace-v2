import { faSeedling } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Flex, Tooltip, Text } from 'components/primitives'

export const ActiveMintTooltip = () => {
  return (
    <Tooltip
      content={
        <Text style="body3" css={{ display: 'block' }}>
          Actively minting
        </Text>
      }
    >
      <Flex css={{ color: '$green10' }}>
        <FontAwesomeIcon icon={faSeedling} />
      </Flex>
    </Tooltip>
  )
}
