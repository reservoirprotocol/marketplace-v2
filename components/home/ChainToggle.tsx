import { ToggleGroup, ToggleGroupItem, Text } from '../primitives'
import {FC, useContext} from 'react'
import supportedChains from "../../utils/chains";
import {ChainContext} from "../../context/ChainContextProvider";

const chainOptions = [...supportedChains.map(c => `${c.id}`)] as const
export type ChainToggleOption = typeof chainOptions[number]

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
          css={{ p: '$space$2' }}
        >
          <img style={{ height: 30, width: 30 }} src={optionItem.iconUrl} />
          {!compact && (
            <Text style="body1" css={{ ml: '$2' }}>
              {optionItem.name}
            </Text>
          )}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export default ChainToggle
