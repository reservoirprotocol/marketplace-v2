import { FC } from 'react'
import { ToggleGroup, ToggleGroupItem } from '../primitives'
import supportedChains from 'utils/chains'
import { useContext } from 'react'
import { ChainContext } from 'context/ChainContextProvider'

type Props = {}

const ChainToggle: FC<Props> = ({}) => {
  const { chain, switchCurrentChain } = useContext(ChainContext)

  if (supportedChains.length === 1) {
    return null
  }

  return (
    <ToggleGroup
      type="single"
      value={chain.name}
      css={{
        width: '100%',
        '@bp800': {
          width: 'auto',
        },
        '> *': {
          width: '100%',
          flex: 1,
          '@bp800': {
            width: 'auto',
            flex: '1 1 auto',
          },
        },
      }}
    >
      {supportedChains.map((chainOption) => (
        <ToggleGroupItem
          key={chainOption.name}
          value={chainOption.name}
          disabled={chainOption.name === chain.name}
          onClick={() => switchCurrentChain(chainOption.id)}
        >
          <img src={chainOption.iconUrl} style={{ height: 20 }} />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export default ChainToggle
