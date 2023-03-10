import { ToggleGroup, ToggleGroupItem, Text, Flex } from '../primitives'
import { FC, useContext } from 'react'
import supportedChains from 'utils/chains'
import { ChainContext } from 'context/ChainContextProvider'

type Props = {
  compact?: boolean
}

const ChainToggle: FC<Props> = ({ compact }) => {
  if (supportedChains.length === 1) {
    return null
  }

  const { chain, switchCurrentChain } = useContext(ChainContext)

  return (
    <ToggleGroup
      type="single"
      value={`${chain.id}`}
      onValueChange={(value) => {
        switchCurrentChain(value)
      }}
      css={{ maxWidth: 'max-content' }}
    >
      {supportedChains.map((optionItem) => (
        <ToggleGroupItem
          key={`chain-${optionItem.id}`}
          value={`${optionItem.id}`}
          disabled={optionItem.id === chain.id}
          css={{
            p: '$space$2',
            ...(!compact ? {
              width: 180
            } : {})
          }}
          aria-label={optionItem.name}
        >
          <Flex align="center">
            <img
              alt={optionItem.name}
              style={{ height: 30, width: 30 }}
              src={optionItem.iconUrl}
            />
            {!compact && (
              <Text style="h6" css={{ ml: '$2', color: 'black' }}>
                {optionItem.name}
              </Text>
            )}
          </Flex>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export default ChainToggle
