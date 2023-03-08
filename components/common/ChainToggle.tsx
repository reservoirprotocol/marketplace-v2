import { FC } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { ToggleGroup, ToggleGroupItem, Tooltip, Text, Box } from '../primitives'
import supportedChains from 'utils/chains'
import { useContext } from 'react'
import { ChainContext } from 'context/ChainContextProvider'
import { TooltipArrow } from 'components/primitives/Tooltip'

type Props = {}

const ChainToggle: FC<Props> = ({}) => {
  const { chain, switchCurrentChain } = useContext(ChainContext)

  if (supportedChains.length === 1) {
    return null
  }

  return (
    <ToggleGroup type="single" value={chain.name}>
      {supportedChains.map((chainOption) => (
        <ToggleGroupItem
          key={chainOption.name}
          value={chainOption.name}
          disabled={chainOption.name === chain.name}
          onClick={() => switchCurrentChain(chainOption.id)}
          css={{
            width: 56,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <TooltipPrimitive.Root delayDuration={1000}>
            <TooltipPrimitive.Trigger asChild>
              <img src={chainOption.iconUrl} style={{ height: 20 }} />
            </TooltipPrimitive.Trigger>
            <TooltipPrimitive.Content
              sideOffset={5}
              side="top"
              align="center"
              style={{ zIndex: 100 }}
            >
              <TooltipArrow />
              <Box
                css={{
                  zIndex: 9999,
                  $$shadowColor: '$colors$panelShadow',
                  boxShadow: '0px 1px 5px rgba(0,0,0,0.2)',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <Box
                  css={{
                    background: '$neutralBgSubtle',
                    p: '$2',
                  }}
                >
                  {chainOption?.name}
                </Box>
              </Box>
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Root>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export default ChainToggle
